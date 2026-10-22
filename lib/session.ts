import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "./db";
import { accounts } from "./db/schema";
import type { DashboardRole } from "./dashboard";

// The signed token itself lives in session-token.ts (no Next.js imports, so it can be unit tested)
import { SESSION_COOKIE, decodeSession, masterVersion, passwordVersion, type Session } from "./session-token";
export { MASTER_DAYS, MEMBER_DAYS, SESSION_COOKIE, encodeSession, passwordVersion, sessionsEnabled, type NewSession, type Session } from "./session-token";

export const cookieOptions = (days: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: days * 86400,
});

/**
 * The signed-in session, still checked against the database: an admin session ends when MASTER_PASSWORD
 * changes, and a member session ends when the account is blocked or its password is reset.
 * Cached per request, so several checks on one page cost one lookup.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const s = decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s) return null;
  if (s.kind === "master") return s.mv === masterVersion() ? s : null;
  if (!s.accountId) return s; // just applied through a form: no account to check
  const db = getDb();
  if (!db) return null;
  try {
    const [a] = await db.select({ status: accounts.status, passwordHash: accounts.passwordHash }).from(accounts).where(eq(accounts.id, s.accountId)).limit(1);
    if (!a || a.status === "blocked" || s.pv !== passwordVersion(a.passwordHash)) return null;
    return s;
  } catch (e) {
    console.error("[session] couldn't check the account", e);
    return null;
  }
});

/** Guard for a dashboard page: signed-out visitors go to /login, members only see their own role. */
export async function requireDashboard(role: DashboardRole) {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.kind === "member" && s.role !== role) redirect(`/dashboard/${s.role}`);
  return s;
}

/** Constant-time comparison against MASTER_PASSWORD (hashing first so lengths always match). */
export function checkMasterPassword(input: string) {
  const pw = process.env.MASTER_PASSWORD;
  if (!pw) return false;
  const h = (v: string) => createHmac("sha256", "rafikihub-master").update(v).digest();
  return timingSafeEqual(h(input), h(pw));
}

/** Guard for /admin pages: only the master login gets in. */
export async function requireMaster() {
  const s = await getSession();
  if (s?.kind !== "master") redirect("/login?next=/admin");
  return s;
}

/** The same check for server actions and admin API routes, which must never trust the page that called them. */
export async function assertMaster() {
  const s = await getSession();
  if (s?.kind !== "master") throw new Error("Not signed in as admin.");
}

/** Guard for pages and actions that need a real member account (signed in with email and password). */
export async function requireAccount() {
  const s = await getSession();
  if (s?.kind !== "member" || !s.accountId) redirect("/login");
  return s as Extract<Session, { kind: "member" }> & { accountId: number };
}
