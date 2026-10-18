import { NextResponse } from "next/server";
import { fromThisSite } from "@/lib/same-site";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/password";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, encodeSession, passwordVersion } from "@/lib/session";

const MAX_FAILURES = 8;
const LOCK_MINUTES = 15;
const wrong = () => NextResponse.json({ ok: false, error: "That email and password don't match. Check them, or reset your password." }, { status: 401 });

/** Member sign-in with email and password. Old-site MD5 passwords are upgraded to scrypt on the way in. */
export async function POST(req: Request) {
  // Signing in from a form on another website could plant someone else's session
  if (!fromThisSite(req)) return NextResponse.json({ ok: false, error: "This form has to be sent from rafikihub.com. Reload the page and try again." }, { status: 403 });
  const res = await signIn(req);
  // A plain form post that failed goes back to the login page with a message, not a page of JSON
  if (res.status !== 303 && !(req.headers.get("content-type") ?? "").includes("application/json")) {
    return NextResponse.redirect(new URL("/login?error=1", req.url), 303);
  }
  return res;
}

async function signIn(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "Sign-in isn't available right now. Try again soon." }, { status: 503 });
  // JSON from the sign-in form; a plain form post if someone submits before the page's script has loaded
  const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
  const body = (isForm
    ? Object.fromEntries((await req.formData().catch(() => new FormData())).entries())
    : await req.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });

  const [acct] = await db.select().from(accounts).where(sql`lower(${accounts.email}) = ${email}`).limit(1);
  if (!acct) {
    await new Promise((r) => setTimeout(r, 800)); // same pace as a wrong password, so emails can't be probed
    return wrong();
  }
  if (acct.lockedUntil && acct.lockedUntil > new Date()) {
    return NextResponse.json({ ok: false, error: `Too many wrong passwords. Try again in ${LOCK_MINUTES} minutes, or reset your password.` }, { status: 429 });
  }

  const { ok, needsRehash } = await verifyPassword(acct.passwordHash, acct.hashAlgo, password);
  if (!ok) {
    // Counted in one statement, so parallel guesses can't overwrite each other and slip past the limit
    await db
      .update(accounts)
      .set({
        failedLogins: sql`CASE WHEN ${accounts.failedLogins} + 1 >= ${MAX_FAILURES} THEN 0 ELSE ${accounts.failedLogins} + 1 END`,
        lockedUntil: sql`CASE WHEN ${accounts.failedLogins} + 1 >= ${MAX_FAILURES} THEN now() + make_interval(mins => ${LOCK_MINUTES}) ELSE ${accounts.lockedUntil} END`,
      })
      .where(eq(accounts.id, acct.id));
    await new Promise((r) => setTimeout(r, 800));
    return wrong();
  }
  if (acct.status === "blocked") {
    return NextResponse.json({ ok: false, error: "This account has been blocked. Email info@rafikihub.com if you think that's a mistake." }, { status: 403 });
  }

  const upgrade = needsRehash ? await hashPassword(password) : null;
  await db
    .update(accounts)
    .set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date(), ...(upgrade ? { passwordHash: upgrade.hash, hashAlgo: upgrade.algo } : {}) })
    .where(eq(accounts.id, acct.id));

  const role = acct.role === "casting" ? "casting" : "performer";
  const token = encodeSession({ kind: "member", role, accountId: acct.id, pv: passwordVersion(upgrade?.hash ?? acct.passwordHash), name: acct.name, email: acct.email, category: acct.category ?? undefined, plan: acct.planId ?? undefined }, MEMBER_DAYS);
  if (!token) return NextResponse.json({ ok: false, error: "Sign-in isn't set up on this server yet." }, { status: 503 });
  const res = isForm ? NextResponse.redirect(new URL(`/dashboard/${role}`, req.url), 303) : NextResponse.json({ ok: true, redirect: `/dashboard/${role}` });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(MEMBER_DAYS));
  return res;
}
