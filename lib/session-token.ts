import { createHash, createHmac, timingSafeEqual } from "node:crypto";
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
export const masterVersion = () => createHmac("sha256", "rafikihub-master-version").update(process.env.MASTER_PASSWORD ?? "").digest("base64url").slice(0, 16);

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
