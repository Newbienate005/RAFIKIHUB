"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { configuredAppUrl } from "@/lib/app-url";
import { getDb } from "@/lib/db";
import { accounts, memberDocuments } from "@/lib/db/schema";
import { documentKinds } from "@/lib/document-rules";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";
import { assertMaster } from "@/lib/session";

const labelOf = (kind: string) => [...documentKinds.young, ...documentKinds.pet].find((k) => k.id === kind)?.label ?? "Document";

/** Approve or reject one member document; the member is told by email either way. */
export async function reviewDocument(id: number, form: FormData) {
  await assertMaster();
  const status = String(form.get("status") ?? "");
  if (status !== "approved" && status !== "rejected") throw new Error("Unknown status.");
  const note = String(form.get("note") ?? "").trim().slice(0, 500) || null;
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  const [d] = await db
    .update(memberDocuments)
    .set({ status, note: status === "rejected" ? note : null, reviewedAt: new Date() })
    .where(and(eq(memberDocuments.id, id)))
    .returning({ accountId: memberDocuments.accountId, kind: memberDocuments.kind });
  if (d && emailConfigured()) {
    const [m] = await db.select({ name: accounts.name, email: accounts.email }).from(accounts).where(eq(accounts.id, d.accountId)).limit(1);
    if (m?.email) {
      const label = labelOf(d.kind);
      const msg = noticeEmail({
        name: m.name,
        subject: status === "approved" ? `${label} approved` : `Please send your ${label.toLowerCase()} again`,
        paragraphs: status === "approved"
          ? [`Thank you. The RafikiHub team has checked your ${label.toLowerCase()} and approved it.`]
          : [`The RafikiHub team couldn't accept your ${label.toLowerCase()}.${note ? ` The reason: ${note}` : ""}`, "Please upload a clearer or updated copy from your dashboard."],
        button: { label: "Open my dashboard", href: `${configuredAppUrl()}/dashboard/performer` },
      });
      after(() => sendEmail({ to: m.email, ...msg }).catch((e) => console.error("[documents] couldn't email the member", e)));
    }
  }
  revalidatePath("/admin/documents");
  revalidatePath("/admin");
}
