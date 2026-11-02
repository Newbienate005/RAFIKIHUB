"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { accounts, reviews } from "@/lib/db/schema";
import { assertMaster } from "@/lib/session";

/** Approve (show it) or reject (hide it) one review. */
export async function moderateReview(id: number, form: FormData) {
  await assertMaster();
  const status = String(form.get("status") ?? "");
  if (status !== "approved" && status !== "rejected") throw new Error("Unknown status.");
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  const [r] = await db.update(reviews).set({ status, reviewedAt: new Date() }).where(eq(reviews.id, id)).returning({ kind: reviews.kind, subject: reviews.subject });
  // Refresh wherever the review shows
  if (r?.kind === "service") revalidatePath("/services");
  if (r?.kind === "performer") {
    const [p] = await db.select({ url: accounts.profileUrl }).from(accounts).where(eq(accounts.id, Number(r.subject))).limit(1);
    if (p?.url) revalidatePath(`/profile/${p.url}`);
  }
  revalidatePath("/dashboard/performer");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin");
}
