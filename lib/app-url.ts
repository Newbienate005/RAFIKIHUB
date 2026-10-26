import { site } from "@/lib/site";

/**
 * Where links in emails point (reset links, "Open the inbox"). Built from configured addresses only,
 * never the request's Host header, which an attacker could set: APP_URL, else Vercel's production
 * address, else the site URL; the local dev server in development.
 */
export function appUrl(req: Request) {
  if (!process.env.APP_URL && process.env.NODE_ENV !== "production") return new URL(req.url).origin;
  return configuredAppUrl();
}

/** The same, where there's no request to hand (server actions): localhost in development. */
export function configuredAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return site.url;
}
