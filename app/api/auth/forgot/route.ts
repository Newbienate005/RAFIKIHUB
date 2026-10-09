import { NextResponse } from "next/server";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { accounts, passwordResets } from "@/lib/db/schema";
import { emailConfigured, resetEmail, sendEmail } from "@/lib/email";
import { newToken, tokenHash } from "@/lib/password";
import { site } from "@/lib/site";

const SAME_ANSWER = { ok: true, message: "If that email has a RafikiHub account, we've sent a link to reset the password. Check your inbox and spam folder." };

/**
 * Where reset links point. Built from configured addresses only (never the request's Host header,
 * which an attacker could set): APP_URL, else Vercel's production address, else the site URL;
 * localhost in development.
 */
function appUrl(req: Request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") return new URL(req.url).origin;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return site.url;
}

export async function POST(req: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "Password reset isn't available right now. Email info@rafikihub.com." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "Enter the email address you signed up with." }, { status: 400 });

  const [acct] = await db.select({ id: accounts.id, name: accounts.name, email: accounts.email, status: accounts.status }).from(accounts).where(sql`lower(${accounts.email}) = ${email}`).limit(1);
  // Same answer whether or not the account exists, so this can't be used to find out who's a member
  if (!acct || acct.status === "blocked") return NextResponse.json(SAME_ANSWER);

  // No more than 3 links an hour per account, so nobody can flood a member's inbox
  const [{ recent }] = await db
    .select({ recent: count() })
    .from(passwordResets)
    .where(and(eq(passwordResets.accountId, acct.id), gt(passwordResets.createdAt, new Date(Date.now() - 60 * 60_000))));
  if (recent >= 3) return NextResponse.json(SAME_ANSWER);

  const token = newToken();
  await db.insert(passwordResets).values({ accountId: acct.id, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 60 * 60_000) });
  const link = `${appUrl(req)}/reset-password?token=${token}`;

  if (!emailConfigured()) {
    // Not set up yet: in development, print the link so the flow can be tested; never log it in production
    if (process.env.NODE_ENV !== "production") console.info(`[forgot] Email isn't set up. Reset link for account ${acct.id}: ${link}`);
    else console.warn("[forgot] RESEND_API_KEY isn't set, so a reset email couldn't be sent.");
    return NextResponse.json(SAME_ANSWER);
  }
  try {
    await sendEmail({ to: acct.email, ...resetEmail(acct.name, link) });
  } catch (e) {
    console.error("[forgot] sending failed", e);
  }
  return NextResponse.json(SAME_ANSWER);
}
