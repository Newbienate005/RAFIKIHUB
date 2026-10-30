import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed "turn off casting alerts" links, so nobody can unsubscribe someone else by guessing an id. */
const secret = () => process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : process.env.MASTER_PASSWORD || "dev");

export const alertsToken = (accountId: number) => createHmac("sha256", secret()).update(`casting-alerts:${accountId}`).digest("base64url").slice(0, 32);

export function checkAlertsToken(accountId: number, token: string) {
  if (!secret() || !Number.isInteger(accountId) || accountId < 1) return false;
  const a = Buffer.from(alertsToken(accountId)), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
