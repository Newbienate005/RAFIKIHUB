"use server";

import { eq, getTableColumns } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import { inboxTypes, isInboxKey } from "@/lib/admin/inbox";
import { getDb } from "@/lib/db";
import { assertMaster } from "@/lib/session";

/** Moves one inbox item to another status. */
export async function setInboxStatus(key: string, id: number, form: FormData) {
  await assertMaster();
  if (!isInboxKey(key)) throw new Error("Unknown inbox.");
  const cfg = inboxTypes[key];
  const status = String(form.get("status") ?? "");
  if (!cfg.statuses || !(cfg.statuses as readonly string[]).includes(status)) throw new Error("Unknown status.");
  const db = getDb();
  if (!db) throw new Error("The database isn't connected.");
  const cols = getTableColumns(cfg.table) as Record<string, PgColumn>;
  await db.update(cfg.table).set({ status } as never).where(eq(cols.id, id));
  revalidatePath("/admin", "layout");
}
