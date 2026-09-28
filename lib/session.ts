import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DashboardRole } from "./dashboard";

/**
 * Signed-cookie sessions for the dashboards. No database needed.
 * - "master": the site owner, signed in at /login with MASTER_PASSWORD; can open every dashboard.
 * - "member": someone who just submitted the join or casting form; sees their own dashboard only.
 * Tokens are HMAC-signed with SESSION_SECRET (falls back to MASTER_PASSWORD). With neither set,
 * sessions are switched off and the forms keep showing their thank-you message.
 */
export type Session =
  | { kind: "master"; exp: number }
  | {
      kind: "member";
      role: DashboardRole;
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

const secret = () => process.env.SESSION_SECRET || process.env.MASTER_PASSWORD || "";
const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export const sessionsEnabled = () => Boolean(secret());

export function encodeSession(s: NewSession, days: number): string | null {
  if (!sessionsEnabled()) return null;
  const data = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + days * 864e5 })).toString("base64url");
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

export async function getSession() {
  return decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
}

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
