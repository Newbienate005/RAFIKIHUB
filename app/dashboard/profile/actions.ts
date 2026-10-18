"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/AdminForm";
import { emptyProfile, limitToMemberFields, parseProfileForm } from "@/lib/admin/profile-form";
import { profileCategories, type TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, talentProfiles } from "@/lib/db/schema";
import { profileCompleteness } from "@/lib/profile-completeness";
import { profileTag } from "@/lib/profiles";
import { getSession } from "@/lib/session";

const slug = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "member";

/** A member saving their own profile. They can't change their link name, publish it, or mark themselves represented. */
export async function saveOwnProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const s = await getSession();
  if (s?.kind !== "member" || !s.accountId) return { message: "Your session has ended. Sign in again to save." };
  const db = getDb();
  if (!db) return { message: "Saving isn't available right now. Try again soon." };
  const [account] = await db.select().from(accounts).where(eq(accounts.id, s.accountId)).limit(1);
  if (!account || account.status === "blocked") return { message: "This account can't edit a profile. Email info@rafikihub.com." };
  if (account.role === "casting") return { message: "Casting accounts don't have a talent profile." };

  let base: TalentProfile = emptyProfile();
  let url = account.profileUrl;
  let existing: { published: boolean; represented: boolean } | null = null;
  if (url) {
    const [row] = await db.select({ data: talentProfiles.data, published: talentProfiles.published, represented: talentProfiles.represented }).from(talentProfiles).where(eq(talentProfiles.profileUrl, url)).limit(1);
    if (row) { base = row.data; existing = { published: row.published, represented: row.represented }; }
  }
  if (!existing) {
    // First profile: a link name from their name, made unique
    const root = slug(account.name);
    url = root;
    for (let n = 2; (await db.select({ u: talentProfiles.profileUrl }).from(talentProfiles).where(eq(talentProfiles.profileUrl, url)).limit(1)).length; n++) url = `${root}-${n}`;
    const cat = account.category && (profileCategories as readonly string[]).includes(account.category) ? (account.category as TalentProfile["category"]) : "Actor";
    base = { ...base, fullName: account.name, category: cat, contactDetails: { ...base.contactDetails, country: account.country ?? "Kenya" } };
  }

  // The link name is fixed: whatever the browser sent, use the saved one
  form.set("profileUrl", url!);
  const parsed = parseProfileForm(form, base);
  if ("errors" in parsed) return { errors: parsed.errors, message: "Some fields need attention." };
  // Admin-only fields keep their saved values, whatever the browser sent
  const p = { ...limitToMemberFields(parsed.profile, base), profileUrl: url! };

  const values = {
    fullName: p.fullName,
    category: p.category,
    data: p,
    // "member": edited by the member, so re-running the old-site import never overwrites it
    source: "member",
    completeness: profileCompleteness(p).percent,
    updatedAt: new Date(),
  };
  try {
    if (existing) await db.update(talentProfiles).set(values).where(eq(talentProfiles.profileUrl, url!));
    else {
      // The new profile and the account's link to it are saved together, or not at all
      await db.batch([
        db.insert(talentProfiles).values({ ...values, profileUrl: url!, published: false, represented: false }),
        db.update(accounts).set({ profileUrl: url }).where(eq(accounts.id, account.id)),
      ]);
    }
  } catch (e) {
    // Someone else took this link name a moment ago: saving again picks the next free one
    if ((e as { code?: string })?.code === "23505") return { message: "That link name was just taken. Press Save again and we'll pick another." };
    console.error("[member] profile save failed", e);
    return { message: "We couldn't save that. Try again." };
  }
  revalidateTag(profileTag(url!));
  revalidatePath(`/profile/${url}`);
  revalidatePath("/dashboard/performer");
  // Saved from the dashboard's Edit CV tab: back there
  redirect(form.get("_return") === "cv" ? "/dashboard/performer?tab=cv&saved=1#cv" : "/dashboard/profile?saved=1");
}
