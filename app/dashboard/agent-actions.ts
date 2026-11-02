"use server";

import { and, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { configuredAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";
import { accounts, agentClients } from "@/lib/db/schema";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";
import { getSession } from "@/lib/session";

async function me() {
  const s = await getSession();
  const db = getDb();
  if (!s || s.kind !== "member" || !s.accountId || !db) throw new Error("Log in first.");
  return { s, db, id: s.accountId };
}

function tell(to: string, name: string, subject: string, line: string, href: string) {
  if (!emailConfigured()) return;
  after(() => sendEmail({ to, ...noticeEmail({ name, subject, paragraphs: [line], button: { label: "Open my dashboard", href: `${configuredAppUrl()}${href}` } }) })
    .catch((e) => console.error("[agents] couldn't send an email", e)));
}

/** A performer asks an agent (an agent account, picked from the list) to represent them. The agent approves it. */
export async function requestAgent(form: FormData) {
  const { s, db, id } = await me();
  if (s.role !== "performer") throw new Error("Only performers can link an agent.");
  const agentId = Number(form.get("agentId"));
  const [agent] = await db.select({ name: accounts.name, email: accounts.email }).from(accounts)
    .where(and(eq(accounts.id, agentId), eq(accounts.role, "casting"), ilike(accounts.category, "%agent%"), or(eq(accounts.status, "active"), eq(accounts.status, "unverified")))).limit(1);
  if (!agent) throw new Error("That agent isn't on RafikiHub.");
  const added = await db.insert(agentClients).values({ agentId, performerId: id }).onConflictDoNothing().returning({ id: agentClients.id });
  if (added.length) {
    const [p] = await db.select({ name: accounts.name }).from(accounts).where(eq(accounts.id, id)).limit(1);
    tell(agent.email, agent.name, "A performer wants you as their agent", `${p?.name ?? "A performer"} asked to join your roster on RafikiHub. Approve them from "My talents" to submit them for castings.`, "/dashboard/casting?tab=roster");
  }
  revalidatePath("/dashboard/performer");
}

/** The agent approves a performer's request; they can then submit them for castings. */
export async function approveClient(linkId: number) {
  const { db, id } = await me();
  const [l] = await db.update(agentClients).set({ status: "approved" })
    .where(and(eq(agentClients.id, linkId), eq(agentClients.agentId, id), eq(agentClients.status, "pending")))
    .returning({ performerId: agentClients.performerId });
  if (l) {
    const [[p], [a]] = await Promise.all([
      db.select({ name: accounts.name, email: accounts.email }).from(accounts).where(eq(accounts.id, l.performerId)).limit(1),
      db.select({ name: accounts.name }).from(accounts).where(eq(accounts.id, id)).limit(1),
    ]);
    if (p) tell(p.email, p.name, "Your agent approved you", `${a?.name ?? "Your agent"} approved your link on RafikiHub, so they can now submit you for castings. You'll get an email each time they do.`, "/dashboard/performer?tab=agents");
  }
  revalidatePath("/dashboard/casting");
}

/** Either side ends a link (or the agent declines a request). */
export async function removeAgentLink(linkId: number) {
  const { db, id } = await me();
  await db.delete(agentClients).where(and(eq(agentClients.id, linkId), or(eq(agentClients.agentId, id), eq(agentClients.performerId, id))));
  revalidatePath("/dashboard/performer");
  revalidatePath("/dashboard/casting");
}
