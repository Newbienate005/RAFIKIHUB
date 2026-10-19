import { site } from "@/lib/site";

/**
 * Where links in emails point (reset links, "Open the inbox"). Built from configured addresses only,
 * never the request's Host header, which an attacker could set: APP_URL, else Vercel's production
 * address, else the site URL; the local dev server in development.
 */
export function appUrl(req: Request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") return new URL(req.url).origin;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return site.url;
}
