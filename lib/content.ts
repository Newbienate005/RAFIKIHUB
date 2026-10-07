import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { contentKinds, type ContentKind, type ContentTypes } from "./content-kinds";
import { getDb } from "./db";
import { contentItems, siteSettings } from "./db/schema";

export const contentTag = (kind: ContentKind) => `content:${kind}`;
export const seededKey = (kind: ContentKind) => `seeded:${kind}`;

/**
 * Published items of one section, from the database once that section has been copied in
 * (see /admin), otherwise the built-in content in lib/data.ts. Returns null to mean "use the seed".
 */
async function readKind(kind: ContentKind): Promise<unknown[] | null> {
  const db = getDb();
  if (!db) return null;
  const [seeded] = await db.select({ key: siteSettings.key }).from(siteSettings).where(eq(siteSettings.key, seededKey(kind))).limit(1);
  if (!seeded) return null;
  const rows = await db
    .select({ data: contentItems.data })
    .from(contentItems)
    .where(and(eq(contentItems.kind, kind), eq(contentItems.published, true)))
    .orderBy(asc(contentItems.sortOrder), asc(contentItems.id));
  return rows.map((r) => r.data);
}

/**
 * Cached per section and refreshed the moment the admin saves (revalidateTag). Database errors are
 * not cached: the page falls back to the built-in content for that request and tries again next time.
 */
export async function getContent<K extends ContentKind>(kind: K): Promise<ContentTypes[K][]> {
  const cached = unstable_cache(() => readKind(kind), ["content", kind], { tags: [contentTag(kind)], revalidate: 3600 });
  try {
    const rows = await cached();
    if (rows) return rows as ContentTypes[K][];
  } catch (e) {
    console.error(`[content] couldn't read ${kind}, using the built-in content`, e);
  }
  return contentKinds[kind].seed() as ContentTypes[K][];
}

/** Blog posts, newest first. */
export async function getArticles() {
  const all = await getContent("articles");
  return [...all].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
