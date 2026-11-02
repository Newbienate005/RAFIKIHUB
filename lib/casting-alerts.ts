import { and, eq, isNotNull, isNull, ne } from "drizzle-orm";
import { alertsToken } from "@/lib/alerts-token";
import { configuredAppUrl } from "@/lib/app-url";
import { cannotApply } from "@/lib/casting-eligibility";
import { nairobiToday } from "@/lib/content-kinds";
import type { TalentProfile } from "@/lib/data";
import type { getDb } from "@/lib/db";
import { accounts, auditions, talentProfiles } from "@/lib/db/schema";
import { emailConfigured, noticeEmail, sendBulk } from "@/lib/email";

type Db = NonNullable<ReturnType<typeof getDb>>;

/**
 * Emails every performer who can apply when a casting goes live: the same category, country and gender rules as
 * applying. Runs once per casting (auditions.alerted_at is claimed first), skips anyone who turned alerts off,
 * and each email carries a signed link to turn them off. Returns how many were sent.
 */
export async function sendCastingAlerts(db: Db, auditionId: number): Promise<number> {
  if (!emailConfigured()) return 0;
  // Claim the casting first, so a double click or a second publish never sends twice
  const [c] = await db
    .update(auditions)
    .set({ alertedAt: new Date() })
    .where(and(eq(auditions.id, auditionId), eq(auditions.status, "published"), isNull(auditions.alertedAt)))
    .returning();
  if (!c) return 0;

  const members = await db
    .select({ id: accounts.id, name: accounts.name, email: accounts.email, category: accounts.category, country: accounts.country, profileCategory: talentProfiles.category, data: talentProfiles.data })
    .from(accounts)
    .innerJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
    .where(and(eq(accounts.role, "performer"), ne(accounts.status, "blocked"), eq(accounts.castingAlerts, true), isNotNull(accounts.email)));

  const today = nairobiToday();
  const url = configuredAppUrl();
  const recipients = members
    .filter((m) => {
      const pd = (m.data as TalentProfile).personalData;
      return !cannotApply(c, { category: m.profileCategory || m.category, country: pd?.country || m.country, gender: pd?.gender }, today);
    })
    .map((m) => ({
      email: m.email,
      fields: { first: m.name.split(" ")[0] || "there", unsub: `${url}/api/alerts/unsubscribe?a=${m.id}&t=${alertsToken(m.id)}` },
    }));
  if (!recipients.length) return 0;

  const closes = new Date(`${c.closesOn}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "long" });
  const email = noticeEmail({
    name: "{first}",
    subject: `New casting: ${c.title}`.slice(0, 140),
    paragraphs: [
      `A new casting that matches your profile just went live on RafikiHub: "${c.title}" (${c.type}${c.location ? `, ${c.location}` : ""}).`,
      `Applications close on ${closes}. Apply from your dashboard in one tap.`,
    ],
    button: { label: "See the casting", href: `${url}/dashboard/performer?tab=opportunities` },
    footer: { label: "Turn off casting alerts", href: "{unsub}" },
  });
  await sendBulk(recipients, email);
  return recipients.length;
}
