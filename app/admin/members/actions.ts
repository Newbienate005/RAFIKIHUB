"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
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
