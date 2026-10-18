import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "./db";
import { accounts } from "./db/schema";
import type { DashboardRole } from "./dashboard";

/**
 * Signed-cookie sessions for the dashboards. No database needed.
 * - "master": the site owner, signed in at /login with MASTER_PASSWORD; can open every dashboard.
 * - "member": a member signed in with their email and password (accountId set), or someone who just
 *   submitted the join or casting form (no accountId); either way they see their own dashboard only.
 * Tokens are HMAC-signed with SESSION_SECRET, which must be its own random value: anyone can get a signed
 * cookie from the join form, so a key shared with MASTER_PASSWORD could be guessed offline. Only local
 * development falls back to MASTER_PASSWORD. With no key, sessions are switched off and the forms keep
 * showing their thank-you message.
 */
export type Session =
  | { kind: "master"; exp: number; /** Fingerprint of MASTER_PASSWORD: changing the password ends every admin session */ mv?: string }
  | {
      kind: "member";
      role: DashboardRole;
      /** Set when signed in with an email and password (a real account); absent for someone who just applied */
      accountId?: number;
      /** Fingerprint of the account's password hash: a reset ends every older session */
      pv?: string;
      name: string;
      email: string;
      category?: string;
      plan?: string;
      location?: string;
      company?: string;
      project?: string;
      exp: number;
    };

export type NewSession = Session extends infer S ? (S extends Session ? Omit<S, "exp"> : never) : never;

export const SESSION_COOKIE = "rh_session";
export const MASTER_DAYS = 7;
export const MEMBER_DAYS = 30;

const secret = () => process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : process.env.MASTER_PASSWORD || "");
const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export const sessionsEnabled = () => Boolean(secret());

/** A short fingerprint of a password hash. Changing the password changes it, so sessions issued earlier stop working. */
export const passwordVersion = (hash: string | null | undefined) => createHash("sha256").update(hash ?? "").digest("base64url").slice(0, 16);
const masterVersion = () => createHmac("sha256", "rafikihub-master-version").update(process.env.MASTER_PASSWORD ?? "").digest("base64url").slice(0, 16);

export function encodeSession(s: NewSession, days: number): string | null {
  if (!sessionsEnabled()) return null;
  const payload = s.kind === "master" ? { ...s, mv: masterVersion() } : s;
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + days * 864e5 })).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function decodeSession(token?: string): Session | null {
  if (!token || !sessionsEnabled()) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const s = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Session;
    return typeof s.exp === "number" && s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

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
