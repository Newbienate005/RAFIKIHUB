"use server";

import { and, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendApplicationFeedback } from "@/lib/application-feedback";
import { getDb } from "@/lib/db";
import { auditionApplications, auditions } from "@/lib/db/schema";
import { getSession } from "@/lib/session";

/** What a casting director can set on applications to their own castings (withdrawing is the performer's call) */
const allowed = ["new", "shortlisted", "audition-booked", "declined"];

/** A casting director moves an application to one of their own castings on (shortlist, audition, not selected). */
export async function setMyApplicationStatus(applicationId: number, form: FormData) {
  const s = await getSession();
  if (!s || s.kind !== "member" || s.role !== "casting" || !s.accountId) throw new Error("Sign in with your casting account.");
  const status = String(form.get("status") ?? "");
  if (!allowed.includes(status)) throw new Error("Unknown status.");
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  // Only applications to castings this account owns, and only when the status really changes
  const changed = await db
    .update(auditionApplications)
    .set({ status })
    .where(and(
      eq(auditionApplications.id, applicationId),
      ne(auditionApplications.status, status),
      ne(auditionApplications.status, "withdrawn"), // a performer who withdrew stays withdrawn
      sql`${auditionApplications.auditionId} IN (SELECT ${auditions.id} FROM ${auditions} WHERE ${auditions.ownerId} = ${s.accountId})`,
    ))
    .returning({ id: auditionApplications.id });
  if (changed.length) sendApplicationFeedback(db, applicationId, status);
  revalidatePath("/dashboard/casting");
}
