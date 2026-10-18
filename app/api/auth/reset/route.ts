import { NextResponse } from "next/server";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accounts, passwordResets } from "@/lib/db/schema";
import { hashPassword, passwordProblem, tokenHash } from "@/lib/password";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, encodeSession } from "@/lib/session";

/** Sets a new password from a reset link, then signs the member in. */
export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "Password reset isn't available right now." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { token?: unknown; password?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const problem = passwordProblem(password);
  if (problem) return NextResponse.json({ ok: false, error: problem, fields: { password: problem } }, { status: 400 });

  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(and(eq(passwordResets.tokenHash, tokenHash(token)), isNull(passwordResets.usedAt), gt(passwordResets.expiresAt, new Date())))
    .limit(1);
  if (!reset) return NextResponse.json({ ok: false, error: "This reset link has expired or has already been used. Ask for a new one." }, { status: 400 });

  // Check the account and hash the password before touching the link, so a failure here doesn't waste it
  const [acct] = await db.select().from(accounts).where(eq(accounts.id, reset.accountId)).limit(1);
  if (!acct || acct.status === "blocked") return NextResponse.json({ ok: false, error: "This account can't be signed into. Email info@rafikihub.com." }, { status: 403 });
  const { hash, algo } = await hashPassword(password);

  // Use the link up and set the password in one transaction: both happen, or neither does.
  // The password only changes if this request is the one that used the link, so it can't be replayed.
  const stamp = new Date();
  const [used] = await db.batch([
    db.update(passwordResets).set({ usedAt: stamp }).where(and(eq(passwordResets.id, reset.id), isNull(passwordResets.usedAt))).returning({ id: passwordResets.id }),
    db
      .update(accounts)
      // Getting the email proves they own the address, so an unverified account becomes active
      .set({ passwordHash: hash, hashAlgo: algo, failedLogins: 0, lockedUntil: null, lastLoginAt: stamp, status: acct.status === "unverified" ? "active" : acct.status })
      .where(and(eq(accounts.id, acct.id), sql`EXISTS (SELECT 1 FROM password_resets WHERE id = ${reset.id} AND used_at = ${stamp})`)),
  ]);
  if (!used.length) return NextResponse.json({ ok: false, error: "This reset link has already been used. Ask for a new one." }, { status: 400 });

  const role = acct.role === "casting" ? "casting" : "performer";
  const session = encodeSession({ kind: "member", role, accountId: acct.id, name: acct.name, email: acct.email, category: acct.category ?? undefined, plan: acct.planId ?? undefined }, MEMBER_DAYS);
  const res = NextResponse.json({ ok: true, redirect: `/dashboard/${role}?reset=1` });
  if (session) res.cookies.set(SESSION_COOKIE, session, cookieOptions(MEMBER_DAYS));
  return res;
}
