import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "./db";
import { accounts, auditions, reviews, serviceBookings } from "./db/schema";
import type { ReviewKind } from "./reviews";

/** Reads for reviews. Public pages get an empty list if the database is down, never an error. */
async function quiet<T>(label: string, empty: T, run: (db: NonNullable<ReturnType<typeof getDb>>) => Promise<T>): Promise<T> {
  const db = getDb();
  if (!db) return empty;
  try {
    return await run(db);
  } catch (e) {
    console.error(`[reviews] ${label} failed`, e);
    return empty;
  }
}

/** Approved reviews of one performer or service, newest first. */
export function getApprovedReviews(kind: ReviewKind, subject: string) {
  return quiet("approved reviews", [], (db) =>
    db.select({ id: reviews.id, rating: reviews.rating, body: reviews.body, author: accounts.name, createdAt: reviews.createdAt })
      .from(reviews).innerJoin(accounts, eq(accounts.id, reviews.authorId))
      .where(and(eq(reviews.kind, kind), eq(reviews.subject, subject), eq(reviews.status, "approved")))
      .orderBy(desc(reviews.createdAt)).limit(20),
  );
}

/** What this member has already reviewed, as "kind:subject" keys (so the form shows "Reviewed ✓"). */
export async function getMyReviewKeys(authorId: number) {
  const rows = await quiet("my reviews", [], (db) => db.select({ kind: reviews.kind, subject: reviews.subject }).from(reviews).where(eq(reviews.authorId, authorId)));
  return new Set(rows.map((r) => `${r.kind}:${r.subject}`));
}

/** Services this member booked with their account email. */
export async function getMyBookedServices(accountId: number) {
  const rows = await quiet("booked services", [], (db) =>
    db.selectDistinct({ service: serviceBookings.service }).from(serviceBookings)
      .innerJoin(accounts, sql`lower(${accounts.email}) = lower(${serviceBookings.email})`).where(eq(accounts.id, accountId)),
  );
  return rows.map((r) => r.service);
}

/** For each open casting, the average approved rating performers gave all castings by the same poster. */
export async function getCastingPosterRatings(auditionIds: number[]) {
  const past = alias(auditions, "past");
  const rows = auditionIds.length
    ? await quiet("poster ratings", [], (db) =>
        db.select({ id: auditions.id, avg: sql<string>`avg(${reviews.rating})`, count: sql<string>`count(${reviews.id})` })
          .from(auditions)
          .innerJoin(past, eq(past.ownerId, auditions.ownerId))
          .innerJoin(reviews, and(eq(reviews.kind, "casting"), eq(reviews.subject, sql`${past.id}::text`), eq(reviews.status, "approved")))
          .where(inArray(auditions.id, auditionIds))
          .groupBy(auditions.id),
      )
    : [];
  return new Map(rows.map((r) => [r.id, { avg: Number(r.avg), count: Number(r.count) }]));
}

/** Approved casting-director reviews of the performer behind a profile page. */
export function getProfileReviews(profileUrl: string) {
  return quiet("profile reviews", [], (db) =>
    db.select({ id: reviews.id, rating: reviews.rating, body: reviews.body, author: accounts.name, createdAt: reviews.createdAt })
      .from(reviews).innerJoin(accounts, eq(accounts.id, reviews.authorId))
      .where(and(eq(reviews.kind, "performer"), eq(reviews.status, "approved"), sql`${reviews.subject} = (SELECT id::text FROM accounts WHERE profile_url = ${profileUrl} LIMIT 1)`))
      .orderBy(desc(reviews.createdAt)).limit(20),
  );
}
