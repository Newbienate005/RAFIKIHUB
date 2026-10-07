"use server";

import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { contentKinds, fromForm, isContentKind, type ContentKind } from "@/lib/content-kinds";
import { contentTag, seededKey } from "@/lib/content";
import { getDb } from "@/lib/db";
import { contentItems, siteSettings } from "@/lib/db/schema";
import { assertMaster } from "@/lib/session";

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string> };

function db() {
  const d = getDb();
  if (!d) throw new Error("The database isn't connected.");
  return d;
}

/** Makes the website show the change straight away. */
function refresh(kind: ContentKind) {
  revalidateTag(contentTag(kind));
  revalidatePath("/", "layout");
}

async function isSeeded(kind: ContentKind) {
  const [row] = await db().select({ key: siteSettings.key }).from(siteSettings).where(eq(siteSettings.key, seededKey(kind))).limit(1);
  return Boolean(row);
}

/**
 * Copies a section's built-in content into the database, so the database becomes the source of truth.
 * Safe to call twice: it does nothing once the section is marked as copied.
 */
export async function seedKind(kind: string) {
  await assertMaster();
  if (!isContentKind(kind)) throw new Error("Unknown section.");
  if (await isSeeded(kind)) return;
  const cfg = contentKinds[kind];
  const items = cfg.seed() as unknown as Record<string, unknown>[];
  if (items.length) {
    await db()
      .insert(contentItems)
      .values(items.map((data, i) => ({ kind, data, slug: cfg.slugField ? String(data[cfg.slugField]) : null, sortOrder: i * 10 })))
      .onConflictDoNothing();
  }
  await db().insert(siteSettings).values({ key: seededKey(kind), value: { at: new Date().toISOString(), count: items.length } }).onConflictDoNothing();
  refresh(kind);
}

export async function seedKindAction(kind: string) {
  await seedKind(kind);
  redirect(`/admin/content/${kind}`);
}

/** Create (id "new") or update one item. */
export async function saveContent(kind: string, id: string, _prev: FormState, form: FormData): Promise<FormState> {
  await assertMaster();
  if (!isContentKind(kind)) return { message: "Unknown section." };
  if (!(await isSeeded(kind))) await seedKind(kind);
  const cfg = contentKinds[kind];
  const parsed = fromForm(cfg.fields, form);
  if ("errors" in parsed) return { errors: parsed.errors, message: "Some fields need attention." };
  const data = parsed.data;
  const slug = cfg.slugField ? String(data[cfg.slugField]) : null;
  const published = form.get("_published") === "on";

  try {
    if (id === "new") {
      // New items go to the end of the list
      const [last] = await db().select({ s: contentItems.sortOrder }).from(contentItems).where(eq(contentItems.kind, kind)).orderBy(desc(contentItems.sortOrder)).limit(1);
      await db().insert(contentItems).values({ kind, slug, data, published, sortOrder: (last?.s ?? 0) + 10 });
    } else {
      await db()
        .update(contentItems)
        .set({ data, slug, published, updatedAt: new Date() })
        .where(and(eq(contentItems.id, Number(id)), eq(contentItems.kind, kind)));
    }
  } catch (e) {
    if ((e as { code?: string })?.code === "23505") {
      return { errors: { [cfg.slugField ?? ""]: "Another item already uses this link name." }, message: "Some fields need attention." };
    }
    console.error("[admin] save failed", e);
    return { message: "We couldn't save that. Try again." };
  }
  refresh(kind);
  redirect(`/admin/content/${kind}?saved=1`);
}

export async function deleteContent(kind: string, id: number) {
  await assertMaster();
  if (!isContentKind(kind)) throw new Error("Unknown section.");
  await db().delete(contentItems).where(and(eq(contentItems.id, id), eq(contentItems.kind, kind)));
  refresh(kind);
  redirect(`/admin/content/${kind}?deleted=1`);
}

export async function setPublished(kind: string, id: number, published: boolean) {
  await assertMaster();
  if (!isContentKind(kind)) throw new Error("Unknown section.");
  await db().update(contentItems).set({ published, updatedAt: new Date() }).where(and(eq(contentItems.id, id), eq(contentItems.kind, kind)));
  refresh(kind);
}

/** Swaps an item with its neighbour above or below. */
export async function moveContent(kind: string, id: number, direction: "up" | "down") {
  await assertMaster();
  if (!isContentKind(kind)) throw new Error("Unknown section.");
  const d = db();
  const [item] = await d.select().from(contentItems).where(and(eq(contentItems.id, id), eq(contentItems.kind, kind))).limit(1);
  if (!item) return;
  const [other] = await d
    .select()
    .from(contentItems)
    .where(and(eq(contentItems.kind, kind), direction === "up" ? lt(contentItems.sortOrder, item.sortOrder) : gt(contentItems.sortOrder, item.sortOrder)))
    .orderBy(direction === "up" ? desc(contentItems.sortOrder) : asc(contentItems.sortOrder))
    .limit(1);
  if (!other) return;
  await d.update(contentItems).set({ sortOrder: other.sortOrder }).where(eq(contentItems.id, item.id));
  await d.update(contentItems).set({ sortOrder: item.sortOrder }).where(eq(contentItems.id, other.id));
  refresh(kind);
}
