"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { services } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, auditionApplications, auditions, reviews, serviceBookings } from "@/lib/db/schema";
import { failures, recordFailure } from "@/lib/rate-limit";
import { checkReview } from "@/lib/reviews";
import { getSession } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Leave one review. Only people who really worked together can review:
 * a casting director on someone who applied to their casting, a performer on a casting they applied to,
 * a member on a service booked with their email. It waits for the team before it shows anywhere.
 */
export async function leaveReview(subject: string, form: FormData): Promise<Result> {
  const s = await getSession();
  const db = getDb();
  if (!s || s.kind !== "member" || !s.accountId || !db) return { ok: false, error: "Log in to leave a review." };
  const r = checkReview({ kind: form.get("kind"), rating: form.get("rating"), body: form.get("body") });
  if ("error" in r) return { ok: false, error: r.error };
  const me = s.accountId;

  const notWithdrawn = ne(auditionApplications.status, "withdrawn");
  let allowed = false;
  if (r.kind === "performer") {
    const [x] = await db.select({ id: auditionApplications.id }).from(auditionApplications).innerJoin(auditions, eq(auditions.id, auditionApplications.auditionId))
      .where(and(eq(auditionApplications.applicantId, Number(subject)), eq(auditions.ownerId, me), notWithdrawn)).limit(1);
    allowed = Boolean(x);
  } else if (r.kind === "casting") {
    const [x] = await db.select({ id: auditionApplications.id }).from(auditionApplications)
      .where(and(eq(auditionApplications.auditionId, Number(subject)), eq(auditionApplications.applicantId, me), notWithdrawn)).limit(1);
    allowed = Boolean(x);
  } else if (services.some((sv) => sv.id === subject)) {
    const [x] = await db.select({ id: serviceBookings.id }).from(serviceBookings).innerJoin(accounts, sql`lower(${accounts.email}) = lower(${serviceBookings.email})`)
      .where(and(eq(accounts.id, me), eq(serviceBookings.service, subject))).limit(1);
    allowed = Boolean(x);
  }
  if (!allowed) return { ok: false, error: "You can only review people, castings and services you've worked with on RafikiHub." };

  const key = `reviews:${me}`;
  if ((await failures(db, key, 24 * 60 * 60).catch(() => 0)) >= 20) return { ok: false, error: "That's a lot of reviews for one day. Try again tomorrow." };
  const added = await db.insert(reviews).values({ authorId: me, kind: r.kind, subject, rating: r.rating, body: r.body }).onConflictDoNothing().returning({ id: reviews.id });
  if (!added.length) return { ok: false, error: "You've already reviewed this." };
  await recordFailure(db, key, 24 * 60 * 60).catch(() => {});
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
  return { ok: true };
}
