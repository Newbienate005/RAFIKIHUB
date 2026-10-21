import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { exampleProfile, type TalentProfile } from "./data";
import { getDb } from "./db";
import { talentProfiles } from "./db/schema";

const isDev = process.env.NODE_ENV !== "production";

/** Cache tags: one per profile, and one for every profile (the "More actors" lists). Saves revalidate them. */
const PROFILES_TAG = "profiles";
export const profileTag = (profileUrl: string) => `profile:${profileUrl}`;

// The database reads are cached so profile pages can be cached too (rendered on the first visit, then
// served from Vercel's cache for an hour). A failed read throws, so errors are never cached.
const readProfile = (profileUrl: string) =>
  unstable_cache(
    async () => {
      const db = getDb();
      if (!db) return null;
      const [row] = await db
        .select({ data: talentProfiles.data })
        .from(talentProfiles)
        .where(and(eq(talentProfiles.profileUrl, profileUrl), eq(talentProfiles.published, true)))
        .limit(1);
      return row?.data ?? null;
    },
    ["profile", profileUrl],
    { tags: [PROFILES_TAG, profileTag(profileUrl)], revalidate: 3600 },
  )();

/** One published profile by its old-site URL (e.g. "katesnow"). */
export async function getProfile(profileUrl: string): Promise<TalentProfile | null> {
  try {
    const p = await readProfile(profileUrl);
    if (p) return p;
  } catch (e) {
    console.error("[profiles] lookup failed", e);
  }
  // The fictional example profile is only served in development, for previewing the layout.
  return isDev && profileUrl === exampleProfile.profileUrl ? exampleProfile : null;
}

/** Every published profile URL, for the sitemap. */
export async function getPublishedProfileUrls(): Promise<{ profileUrl: string; updatedAt: Date }[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({ profileUrl: talentProfiles.profileUrl, updatedAt: talentProfiles.updatedAt })
      .from(talentProfiles)
      .where(eq(talentProfiles.published, true));
  } catch (e) {
    console.error("[profiles] sitemap lookup failed", e);
    // Pass it on: the page shows "couldn't load, try again" rather than an empty list that looks real
    throw e;
  }
}

/** Actors represented by RafikiHub Talent Management, for the roster. */
export async function getRepresentedProfiles(limit = 12): Promise<TalentProfile[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({ data: talentProfiles.data })
      .from(talentProfiles)
      .where(and(eq(talentProfiles.published, true), eq(talentProfiles.represented, true)))
      .orderBy(desc(talentProfiles.updatedAt))
      .limit(limit);
    return rows.map((r) => r.data);
  } catch (e) {
    console.error("[profiles] roster failed", e);
    // Pass it on: the page shows "couldn't load, try again" rather than an empty list that looks real
    throw e;
  }
}

/** Profiles similar to this one (same category), for "More actors" on a profile page. */
export async function getSimilarProfiles(p: TalentProfile, limit = 3): Promise<TalentProfile[]> {
  const read = unstable_cache(
    async () => {
      const db = getDb();
      if (!db) return [];
      const rows = await db
        .select({ data: talentProfiles.data })
        .from(talentProfiles)
        .where(and(eq(talentProfiles.published, true), eq(talentProfiles.category, p.category)))
        .limit(limit + 1);
      return rows.map((r) => r.data).filter((x) => x.profileUrl !== p.profileUrl).slice(0, limit);
    },
    ["similar-profiles", p.category, p.profileUrl, String(limit)],
    { tags: [PROFILES_TAG], revalidate: 3600 },
  );
  try {
    return await read();
  } catch (e) {
    // Only a "More actors" strip: leave it out rather than fail the profile page
    console.error("[profiles] similar profiles failed", e);
    return [];
  }
}
