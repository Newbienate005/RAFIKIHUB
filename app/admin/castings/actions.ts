"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/AdminForm";
import { breakdownTypes, breakdownGenders, applicationStatuses } from "@/lib/admin/castings";
import { profileCategories } from "@/lib/data";
import { getDb } from "@/lib/db";
import { auditionApplications, auditions, castingCalls } from "@/lib/db/schema";
import { assertMaster } from "@/lib/session";

function db() {
  const d = getDb();
  if (!d) throw new Error("The database isn't connected.");
  return d;
}

function refresh() {
  revalidatePath("/admin/castings", "layout");
  revalidatePath("/dashboard/performer");
}

const newRef = () => `RH-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;

/** Create (id "new") or update a breakdown. Saving never publishes: that's a separate, deliberate step. */
export async function saveBreakdown(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  await assertMaster();
  const s = (k: string) => String(form.get(k) ?? "").trim();
  const errors: Record<string, string> = {};
  const title = s("title");
  if (!title) errors.title = "Add a title.";
  const type = s("type");
  if (!(breakdownTypes as readonly string[]).includes(type)) errors.type = "Choose a type.";
  const gender = s("gender") || "Everybody";
  if (!(breakdownGenders as readonly string[]).includes(gender)) errors.gender = "Choose who it's for.";
  const body = s("body");
  if (body.length < 20) errors.body = "Describe the roles: at least a couple of sentences.";
  const closesOn = s("closesOn");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(closesOn)) errors.closesOn = "Pick the closing date.";
  else if (id === "new" && closesOn < new Date().toISOString().slice(0, 10)) errors.closesOn = "The closing date has already passed.";
  const contactEmail = s("contactEmail");
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errors.contactEmail = "Enter a valid email address.";
  const categories = form.getAll("categories").map(String).filter((c) => (profileCategories as readonly string[]).includes(c));
  const countries = s("countries").split(/\r?\n|,/).map((c) => c.trim()).filter(Boolean);
  if (Object.keys(errors).length) return { errors, message: "Some fields need attention." };

  const values = {
    title, type, gender, body, closesOn, categories, countries,
    company: s("company") || null, contactName: s("contactName") || null, contactEmail: contactEmail || null,
    location: s("location") || null, shootDates: s("shootDates") || null,
    filled: form.get("filled") === "on",
    updatedAt: new Date(),
  };
  let savedId = Number(id);
  if (id === "new") {
    const castingCallId = Number(s("castingCallId")) || null;
    const [row] = await db().insert(auditions).values({ ...values, ref: newRef(), castingCallId, status: "draft" }).returning({ id: auditions.id });
    savedId = row.id;
    if (castingCallId) await db().update(castingCalls).set({ status: "in-progress" }).where(eq(castingCalls.id, castingCallId));
  } else {
    await db().update(auditions).set(values).where(eq(auditions.id, savedId));
  }
  refresh();
  redirect(`/admin/castings/${savedId}?saved=1`);
}

/** draft → published → closed (and back, if needed). */
export async function setBreakdownStatus(id: number, status: "draft" | "published" | "closed") {
  await assertMaster();
  const [row] = await db().select({ publishedAt: auditions.publishedAt, castingCallId: auditions.castingCallId }).from(auditions).where(eq(auditions.id, id)).limit(1);
  if (!row) return;
  await db()
    .update(auditions)
    .set({ status, updatedAt: new Date(), ...(status === "published" && !row.publishedAt ? { publishedAt: new Date() } : {}) })
    .where(eq(auditions.id, id));
  if (status === "published" && row.castingCallId) await db().update(castingCalls).set({ status: "published" }).where(eq(castingCalls.id, row.castingCallId));
  refresh();
}

export async function setApplicationStatus(applicationId: number, form: FormData) {
  await assertMaster();
  const status = String(form.get("status") ?? "");
  if (!(applicationStatuses as readonly string[]).includes(status)) throw new Error("Unknown status.");
  await db().update(auditionApplications).set({ status }).where(eq(auditionApplications.id, applicationId));
  refresh();
}
