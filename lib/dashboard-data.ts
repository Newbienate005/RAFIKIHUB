import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { TalentProfile } from "./data";
import { getDb } from "./db";
import { accounts, agentClients, auditionApplications, auditions, talentProfiles } from "./db/schema";

/**
 * Real data for the member dashboards: what a performer applied for and who represents them, and for
 * casting professionals their castings, the people who applied and (for agents) their roster.
 * Every function returns an empty list if the database is unavailable, so a dashboard never breaks.
 */

async function safe<T>(label: string, run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch (e) {
    console.error(`[dashboard] ${label} failed`, e);
    // Pass it on: the page shows "couldn't load, try again" rather than an empty list that looks real
    throw e;
  }
}

/** Castings a performer has applied for, newest first. */
export async function getMyApplications(accountId: number) {
  const db = getDb();
  if (!db) return [];
  return safe("applications", () =>
    db
      .select({ id: auditionApplications.id, status: auditionApplications.status, appliedAt: auditionApplications.createdAt, ref: auditions.ref, title: auditions.title, type: auditions.type, closesOn: auditions.closesOn, castingStatus: auditions.status })
      .from(auditionApplications)
      .innerJoin(auditions, eq(auditions.id, auditionApplications.auditionId))
      .where(eq(auditionApplications.applicantId, accountId))
      .orderBy(desc(auditionApplications.createdAt))
      .limit(50),
  );
}

/** Agents a performer has linked their profile to. */
export async function getMyAgents(accountId: number) {
  const db = getDb();
  if (!db) return [];
  return safe("agents", () =>
    db
      .select({ id: agentClients.id, status: agentClients.status, name: accounts.name, country: accounts.country, since: agentClients.createdAt })
      .from(agentClients)
      .innerJoin(accounts, eq(accounts.id, agentClients.agentId))
      .where(eq(agentClients.performerId, accountId))
      .orderBy(desc(agentClients.createdAt)),
  );
}

/** A casting professional's castings, with how many people applied to each and how many are shortlisted. */
export async function getMyCastings(accountId: number) {
  const db = getDb();
  if (!db) return [];
  return safe("castings", () =>
    db
      .select({
        id: auditions.id, ref: auditions.ref, title: auditions.title, type: auditions.type, gender: auditions.gender, location: auditions.location,
        closesOn: auditions.closesOn, status: auditions.status, filled: auditions.filled,
        applications: sql<number>`(select count(*)::int from ${auditionApplications} a where a.audition_id = ${auditions.id})`,
        shortlisted: sql<number>`(select count(*)::int from ${auditionApplications} a where a.audition_id = ${auditions.id} and a.status in ('shortlisted', 'audition-booked'))`,
      })
      .from(auditions)
      .where(eq(auditions.ownerId, accountId))
      .orderBy(desc(auditions.closesOn))
      .limit(100),
  );
}

/** The latest applications to a casting professional's castings, with each applicant's profile. */
export async function getApplicationsToMe(accountId: number, limit = 50) {
  const db = getDb();
  if (!db) return [];
  return safe("received applications", () =>
    db
      .select({
        id: auditionApplications.id, status: auditionApplications.status, appliedAt: auditionApplications.createdAt, viaAgent: auditionApplications.submittedByAgentId,
        castingRef: auditions.ref, castingTitle: auditions.title,
        name: accounts.name, category: accounts.category, profileUrl: talentProfiles.profileUrl, published: talentProfiles.published,
        headshot: sql<string | null>`${talentProfiles.data}->'media'->'headshots'->>0`,
        playingAge: sql<{ min: number; max: number } | null>`${talentProfiles.data}->'personalData'->'playingAge'`,
      })
      .from(auditionApplications)
      .innerJoin(auditions, eq(auditions.id, auditionApplications.auditionId))
      .innerJoin(accounts, eq(accounts.id, auditionApplications.applicantId))
      .leftJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
      .where(eq(auditions.ownerId, accountId))
      .orderBy(desc(auditionApplications.createdAt))
      .limit(limit),
  );
}

/** Performers linked to an agent. */
export async function getMyRoster(agentId: number) {
  const db = getDb();
  if (!db) return [];
  return safe("roster", () =>
    db
      .select({ id: agentClients.id, status: agentClients.status, name: accounts.name, category: accounts.category, profileUrl: talentProfiles.profileUrl, published: talentProfiles.published })
      .from(agentClients)
      .innerJoin(accounts, eq(accounts.id, agentClients.performerId))
      .leftJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
      .where(eq(agentClients.agentId, agentId))
      .orderBy(desc(agentClients.createdAt)),
  );
}

export type TalentSearch = { q?: string; category?: string; city?: string; language?: string };
export type TalentResult = Pick<TalentProfile, "profileUrl" | "fullName" | "category" | "cities" | "languages"> & { headshot: string | null; playingAge: TalentProfile["personalData"]["playingAge"] };

const like = (s: string) => `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

/**
 * Published profiles matching a casting professional's search. Cities and languages are typed freely
 * on the old site ("Nairobi", "Nairobi, Kenya", "nairobi"…), so they match as text, ignoring case.
 * Profiles with a headshot come first.
 *
 * Filters run on lowercase generated columns with trigram indexes (scripts/sql/2026-10-18-talent-search.sql),
 * so a search doesn't read every profile's whole record; only the fields a result card shows are fetched.
 */
export async function searchTalent(f: TalentSearch, limit = 48): Promise<{ results: TalentResult[]; total: number }> {
  const db = getDb();
  if (!db) return { results: [], total: 0 };
  const where = [eq(talentProfiles.published, true)];
  const term = (v?: string) => like(v!.trim().toLowerCase());
  if (f.q?.trim()) where.push(sql`search_name like ${term(f.q)}`);
  if (f.category) where.push(eq(talentProfiles.category, f.category));
  if (f.city?.trim()) where.push(sql`search_places like ${term(f.city)}`);
  if (f.language?.trim()) where.push(sql`search_languages like ${term(f.language)}`);
  try {
    const cond = and(...where);
    const [rows, [count]] = await Promise.all([
      db
        .select({
          profileUrl: talentProfiles.profileUrl,
          fullName: talentProfiles.fullName,
          category: talentProfiles.category,
          cities: sql<string[] | null>`${talentProfiles.data}->'cities'`,
          languages: sql<string[] | null>`${talentProfiles.data}->'languages'`,
          headshot: sql<string | null>`${talentProfiles.data}->'media'->'headshots'->>0`,
          playingAge: sql<TalentResult["playingAge"]>`${talentProfiles.data}->'personalData'->'playingAge'`,
        })
        .from(talentProfiles)
        .where(cond)
        .orderBy(sql`has_headshot desc`, desc(talentProfiles.completeness), talentProfiles.fullName)
        .limit(limit),
      db.select({ n: sql<number>`count(*)::int` }).from(talentProfiles).where(cond),
    ]);
    return {
      total: count?.n ?? 0,
      results: rows.map((r) => ({ ...r, category: r.category as TalentResult["category"], cities: r.cities ?? [], languages: r.languages ?? [], playingAge: r.playingAge ?? null })),
    };
  } catch (e) {
    console.error("[dashboard] talent search failed", e);
    // Pass it on: the page shows "couldn't load, try again" rather than an empty list that looks real
    throw e;
  }
}

/** Names of the given accounts, e.g. the agents who submitted applications (for the "Via" column). */
export async function agentNames(ids: number[]) {
  const db = getDb();
  if (!db || !ids.length) return new Map<number, string>();
  const rows = await safe("agent names", () => db.select({ id: accounts.id, name: accounts.name }).from(accounts).where(inArray(accounts.id, ids)));
  return new Map(rows.map((r) => [r.id, r.name]));
}
