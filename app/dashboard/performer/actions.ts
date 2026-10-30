"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { configuredAppUrl } from "@/lib/app-url";
import { cannotApply } from "@/lib/casting-eligibility";
import { nairobiToday } from "@/lib/content-kinds";
import type { TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, auditionApplications, auditions, talentProfiles } from "@/lib/db/schema";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";
import { getSession } from "@/lib/session";

type Result = { ok: true } | { ok: false; error: string };

/** A performer applies to an open casting from their dashboard. Every rule is checked here, not just in the page. */
export async function applyToCasting(auditionId: number): Promise<Result> {
  const s = await getSession();
  if (!s || s.kind !== "member" || s.role !== "performer" || !s.accountId) return { ok: false, error: "Log in with your performer account to apply." };
  const db = getDb();
  if (!db) return { ok: false, error: "Applications aren't available right now. Try again soon." };

  const [me] = await db.select({ name: accounts.name, email: accounts.email, status: accounts.status, category: accounts.category, country: accounts.country, profileUrl: accounts.profileUrl }).from(accounts).where(eq(accounts.id, s.accountId)).limit(1);
  if (!me || me.status === "blocked") return { ok: false, error: "Your account can't apply right now. Email info@rafikihub.com." };
  // Casting directors look at the profile, so there has to be one
  const [profile] = me.profileUrl ? await db.select({ data: talentProfiles.data, category: talentProfiles.category }).from(talentProfiles).where(eq(talentProfiles.profileUrl, me.profileUrl)).limit(1) : [];
  if (!profile) return { ok: false, error: "Create your profile first: casting directors need it to see your photos and credits." };

  const [c] = await db.select().from(auditions).where(eq(auditions.id, auditionId)).limit(1);
  if (!c) return { ok: false, error: "That casting no longer exists." };
  const data = profile.data as TalentProfile;
  const reason = cannotApply(c, { category: profile.category || me.category, country: data.personalData?.country || me.country, gender: data.personalData?.gender }, nairobiToday());
  if (reason) return { ok: false, error: reason };

  try {
    await db.insert(auditionApplications).values({ auditionId, applicantId: s.accountId, status: "new" });
  } catch (e) {
    if ((e as { code?: string })?.code === "23505") return { ok: false, error: "You've already applied to this casting." };
    console.error("[apply] couldn't save the application", e);
    return { ok: false, error: "We couldn't save your application. Try again in a minute." };
  }

  if (emailConfigured()) {
    const url = configuredAppUrl();
    const owner = c.ownerId ? (await db.select({ name: accounts.name, email: accounts.email }).from(accounts).where(eq(accounts.id, c.ownerId)).limit(1))[0] : null;
    const ownerEmail = owner?.email || c.contactEmail;
    after(async () => {
      await sendEmail({
        to: me.email,
        ...noticeEmail({
          name: me.name,
          subject: `Application received: ${c.title}`.slice(0, 140),
          paragraphs: [`Your application for "${c.title}" (${c.ref}) has been sent to the casting team.`, "Keep your profile up to date: it's what they look at. You'll get an email if you're shortlisted."],
          button: { label: "See my applications", href: `${url}/dashboard/performer?tab=opportunities` },
        }),
      }).catch((e) => console.error("[apply] couldn't email the performer", e));
      if (ownerEmail) {
        await sendEmail({
          to: ownerEmail,
          ...noticeEmail({
            name: owner?.name || c.contactName || "",
            subject: `New application: ${c.title}`.slice(0, 140),
            paragraphs: [`${me.name} applied to "${c.title}" (${c.ref}).`, "Open your dashboard to see their profile and move them along the shortlist."],
            button: { label: "See applicants", href: `${url}/dashboard/casting?tab=castings` },
          }),
        }).catch((e) => console.error("[apply] couldn't email the casting owner", e));
      }
    });
  }
  revalidatePath("/dashboard/performer");
  revalidatePath("/dashboard/casting");
  return { ok: true };
}

/** A performer withdraws their own application while it's still open (not after an audition is booked or a decision is made). */
export async function withdrawApplication(applicationId: number): Promise<Result> {
  const s = await getSession();
  if (!s || s.kind !== "member" || !s.accountId) return { ok: false, error: "Log in first." };
  const db = getDb();
  if (!db) return { ok: false, error: "Try again soon." };
  const changed = await db
    .update(auditionApplications)
    .set({ status: "withdrawn" })
    .where(and(eq(auditionApplications.id, applicationId), eq(auditionApplications.applicantId, s.accountId), inArray(auditionApplications.status, ["new", "shortlisted"])))
    .returning({ id: auditionApplications.id });
  revalidatePath("/dashboard/performer");
  revalidatePath("/dashboard/casting");
  return changed.length ? { ok: true } : { ok: false, error: "This application can't be withdrawn now." };
}
