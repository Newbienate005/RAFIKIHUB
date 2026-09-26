import { and, desc, eq } from "drizzle-orm";
import { exampleProfile, type TalentProfile } from "./data";
import { getDb } from "./db";
import { talentProfiles } from "./db/schema";

const isDev = process.env.NODE_ENV !== "production";

/** One published profile by its old-site URL (e.g. "katesnow"). */
export async function getProfile(profileUrl: string): Promise<TalentProfile | null> {
  const db = getDb();
  if (db) {
    try {
      const [row] = await db
        .select({ data: talentProfiles.data })
        .from(talentProfiles)
        .where(and(eq(talentProfiles.profileUrl, profileUrl), eq(talentProfiles.published, true)))
        .limit(1);
      if (row) return row.data;
    } catch (e) {
      console.error("[profiles] lookup failed", e);
    }
  }
  // The fictional example profile is only served in development, for previewing the layout.
  return isDev && profileUrl === exampleProfile.profileUrl ? exampleProfile : null;
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
    return [];
  }
}

/** Profiles similar to this one (same category), for "More actors" on a profile page. */
export async function getSimilarProfiles(p: TalentProfile, limit = 3): Promise<TalentProfile[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({ data: talentProfiles.data })
      .from(talentProfiles)
      .where(and(eq(talentProfiles.published, true), eq(talentProfiles.category, p.category)))
      .limit(limit + 1);
    return rows.map((r) => r.data).filter((x) => x.profileUrl !== p.profileUrl).slice(0, limit);
  } catch {
    return [];
  }
}
