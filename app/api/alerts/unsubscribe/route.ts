import { eq } from "drizzle-orm";
import { checkAlertsToken } from "@/lib/alerts-token";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

const page = (title: string, text: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | RafikiHub</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#121212;color:#fff;font-family:system-ui,sans-serif">
<main style="max-width:30rem;padding:2rem;text-align:center"><p style="font-weight:900;font-size:1.4rem;color:#FF8033">RAFIKI<span style="color:#fff">HUB</span></p>
<h1 style="font-size:1.6rem">${title}</h1><p style="color:#cbcbcb;line-height:1.5">${text}</p>
<p><a href="/" style="color:#FF8033">Back to RafikiHub</a></p></main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

/** The "Turn off casting alerts" link in each alert email. The signed token means only that member can use it. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = Number(u.searchParams.get("a"));
  if (!checkAlertsToken(id, u.searchParams.get("t") ?? "")) return page("That link doesn't work", "It may be incomplete. Copy the whole link from the email, or email info@rafikihub.com and we'll turn alerts off for you.", 400);
  const db = getDb();
  if (!db) return page("Try again soon", "We couldn't reach the database just now. Please try the link again in a minute.", 503);
  await db.update(accounts).set({ castingAlerts: false }).where(eq(accounts.id, id));
  return page("Casting alerts are off", "You won't get emails about new castings any more. You can still see every open casting on your dashboard, and email info@rafikihub.com to turn alerts back on.");
}
