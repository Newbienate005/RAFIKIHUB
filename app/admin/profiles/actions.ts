"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { emptyProfile, parseProfileForm } from "@/lib/admin/profile-form";
import { getDb } from "@/lib/db";
import { accounts, talentProfiles } from "@/lib/db/schema";
import { profileCompleteness } from "@/lib/profile-completeness";
import { assertMaster } from "@/lib/session";
import type { FormState } from "@/components/admin/AdminForm";

function db() {
  const d = getDb();
  if (!d) throw new Error("The database isn't connected.");
  return d;
}

function refresh(url: string) {
  revalidatePath(`/profile/${url}`);
  revalidatePath("/talent-management");
  revalidatePath("/admin/profiles");
}

/** Create (url "new") or update a talent profile. */
export async function saveProfile(originalUrl: string, _prev: FormState, form: FormData): Promise<FormState> {
  await assertMaster();
  const isNew = originalUrl === "new";
  let base = emptyProfile();
  if (!isNew) {
    const [row] = await db().select({ data: talentProfiles.data }).from(talentProfiles).where(eq(talentProfiles.profileUrl, originalUrl)).limit(1);
    if (!row) return { message: "That profile no longer exists." };
    base = row.data;
  }
  const parsed = parseProfileForm(form, base);
  if ("errors" in parsed) return { errors: parsed.errors, message: "Some fields need attention." };
  const p = parsed.profile;
  const values = {
    profileUrl: p.profileUrl,
    fullName: p.fullName,
    category: p.category,
    published: form.get("_published") === "on",
    represented: p.representedByRafikiHub,
    data: p,
    source: "admin",
    completeness: profileCompleteness(p).percent,
    updatedAt: new Date(),
  };
  try {
    if (isNew) await db().insert(talentProfiles).values(values);
    else {
      await db().update(talentProfiles).set(values).where(eq(talentProfiles.profileUrl, originalUrl));
      // Keep the member's account pointing at their profile if the link name changed
      if (p.profileUrl !== originalUrl) await db().update(accounts).set({ profileUrl: p.profileUrl }).where(eq(accounts.profileUrl, originalUrl));
    }
  } catch (e) {
    if ((e as { code?: string })?.code === "23505") return { errors: { profileUrl: "Another profile already uses this link name." }, message: "Some fields need attention." };
    console.error("[admin] profile save failed", e);
    return { message: "We couldn't save that. Try again." };
  }
  refresh(p.profileUrl);
  if (p.profileUrl !== originalUrl && !isNew) refresh(originalUrl);
  redirect(`/admin/profiles/${p.profileUrl}?saved=1`);
}

export async function setProfileFlag(url: string, flag: "published" | "represented", value: boolean) {
  await assertMaster();
  const [row] = await db().select({ data: talentProfiles.data }).from(talentProfiles).where(eq(talentProfiles.profileUrl, url)).limit(1);
  if (!row) return;
  const set = flag === "published" ? { published: value } : { represented: value, data: { ...row.data, representedByRafikiHub: value } };
  await db().update(talentProfiles).set({ ...set, updatedAt: new Date() }).where(eq(talentProfiles.profileUrl, url));
  refresh(url);
}

export async function deleteProfile(url: string) {
  await assertMaster();
  await db().delete(talentProfiles).where(eq(talentProfiles.profileUrl, url));
  await db().update(accounts).set({ profileUrl: null }).where(eq(accounts.profileUrl, url));
  refresh(url);
  redirect("/admin/profiles?deleted=1");
}
