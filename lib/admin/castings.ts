import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { auditions } from "@/lib/db/schema";

export const breakdownTypes = ["Film", "TV", "Theatre", "Commercial", "Music video", "Voice over", "Modelling", "Event", "Other"] as const;
export const breakdownGenders = ["Everybody", "Female", "Male"] as const;
export const breakdownStatuses = ["draft", "published", "closed"] as const;
export const applicationStatuses = ["new", "shortlisted", "audition-booked", "declined", "withdrawn"] as const;

export type Breakdown = typeof auditions.$inferSelect;

/**
 * Breakdowns members can see right now: published and not yet closed.
 * Shown on the Performer dashboard. Categories and countries are "everyone" when empty.
 */
export async function getOpenBreakdowns(limit = 20): Promise<Breakdown[]> {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(auditions)
      .where(and(eq(auditions.status, "published"), gte(auditions.closesOn, sql`(now() at time zone 'Africa/Nairobi')::date`)))
      .orderBy(asc(auditions.closesOn), desc(auditions.publishedAt))
      .limit(limit);
  } catch (e) {
    console.error("[castings] couldn't load breakdowns", e);
    return [];
  }
}
