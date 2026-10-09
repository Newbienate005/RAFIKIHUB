import { eq } from "drizzle-orm";
import type { TalentProfile } from "./data";
import { getDb } from "./db";
import { accounts, talentProfiles } from "./db/schema";
import { profileCompleteness } from "./profile-completeness";

/** A signed-in member's account and (for performers and pets) their talent profile. */
export async function getMember(accountId: number) {
  const db = getDb();
  if (!db) return null;
  const [account] = await db
    .select({ id: accounts.id, name: accounts.name, email: accounts.email, role: accounts.role, category: accounts.category, status: accounts.status, planId: accounts.planId, planExpiresAt: accounts.planExpiresAt, country: accounts.country, phone: accounts.phone, profileUrl: accounts.profileUrl })
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);
  if (!account) return null;
  let profile: { data: TalentProfile; published: boolean } | null = null;
  if (account.profileUrl) {
    const [row] = await db.select({ data: talentProfiles.data, published: talentProfiles.published }).from(talentProfiles).where(eq(talentProfiles.profileUrl, account.profileUrl)).limit(1);
    profile = row ?? null;
  }
  return { account, profile, completeness: profile ? profileCompleteness(profile.data) : null };
}
