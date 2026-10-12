import { count, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "./db";
import { accounts, auditionApplications, auditions } from "./db/schema";
import { site } from "./site";

export type SiteStats = { members: string; castings: number | null; applications: number | null };

const read = unstable_cache(
  async () => {
    const db = getDb();
    if (!db) return null;
    const [[m], [c], [a]] = await Promise.all([
      db.select({ n: count() }).from(accounts).where(eq(accounts.status, "active")),
      db.select({ n: count() }).from(auditions),
      db.select({ n: count() }).from(auditionApplications),
    ]);
    return { members: m?.n ?? 0, castings: c?.n ?? 0, applications: a?.n ?? 0 };
  },
  ["site-stats"],
  { revalidate: 3600 },
);

/**
 * Live numbers for the home page's proof line, refreshed hourly. Falls back to the round figure in
 * lib/site.ts (and no casting numbers) when the database isn't there or the read fails.
 */
export async function getSiteStats(): Promise<SiteStats> {
  try {
    const s = await read();
    if (s && s.members > 0) {
      return { members: s.members.toLocaleString("en-KE"), castings: s.castings || null, applications: s.applications || null };
    }
  } catch (e) {
    console.error("[stats] couldn't read the site numbers", e);
  }
  return { members: site.memberCount, castings: null, applications: null };
}
