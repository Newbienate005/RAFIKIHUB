"use server";

import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { accounts, agentClients, auditionApplications, auditions, passwordResets, payments, talentProfiles } from "@/lib/db/schema";
import { rememberForImport } from "@/lib/admin/import-guard";
import { assertMaster } from "@/lib/session";

const statuses = ["active", "unverified", "expired", "blocked"];

export async function setAccountStatus(id: number, form: FormData) {
  await assertMaster();
  const status = String(form.get("status") ?? "");
  if (!statuses.includes(status)) throw new Error("Unknown status.");
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  await db.update(accounts).set({ status }).where(eq(accounts.id, id));
  revalidatePath("/admin/members");
}

/** Deletes a member's login and everything that's only theirs. Castings they posted stay, without an owner. */
export async function deleteAccount(id: number) {
  await assertMaster();
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  const [a] = await db.select({ legacyId: accounts.legacyId, profileUrl: accounts.profileUrl }).from(accounts).where(eq(accounts.id, id)).limit(1);
  if (!a) redirect("/admin/members?deleted=1"); // already gone
  // One transaction, so nothing is left pointing at an account that no longer exists
  await db.batch([
    db.delete(passwordResets).where(eq(passwordResets.accountId, id)),
    db.delete(payments).where(eq(payments.accountId, id)),
    db.delete(agentClients).where(or(eq(agentClients.agentId, id), eq(agentClients.performerId, id))),
    db.delete(auditionApplications).where(eq(auditionApplications.applicantId, id)),
    db.update(auditionApplications).set({ submittedByAgentId: null }).where(eq(auditionApplications.submittedByAgentId, id)),
    db.update(auditions).set({ ownerId: null }).where(eq(auditions.ownerId, id)),
    ...(a.profileUrl ? [db.delete(talentProfiles).where(eq(talentProfiles.profileUrl, a.profileUrl))] : []),
    db.delete(accounts).where(eq(accounts.id, id)),
  ] as const);
  // So re-running the old-site import doesn't bring them back
  if (a.legacyId != null) await rememberForImport(db, "import:deleted-accounts", a.legacyId);
  if (a.profileUrl) await rememberForImport(db, "import:deleted-profiles", a.profileUrl);
  revalidatePath("/admin/members");
  revalidatePath("/talent");
  redirect("/admin/members?deleted=1");
}
