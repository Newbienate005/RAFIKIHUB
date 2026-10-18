import { sql } from "drizzle-orm";
import type { getDb } from "@/lib/db";

type Db = NonNullable<ReturnType<typeof getDb>>;

/**
 * Remembers changes the admin made on the new site, so re-running the old-site import
 * (scripts/import-old-db.mjs) doesn't undo them. Stored in site_settings as { items: [...] }.
 * - "import:deleted-profiles": profile links the admin deleted; the import won't recreate or relink them.
 * - "import:moderated-auditions": breakdowns the admin edited or opened/closed; the import won't overwrite them.
 */
export type ImportGuardKey = "import:deleted-profiles" | "import:moderated-auditions";

export async function rememberForImport(db: Db, key: ImportGuardKey, item: string | number) {
  const v = JSON.stringify(item);
  await db.execute(sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, jsonb_build_object('items', jsonb_build_array(${v}::jsonb)), now())
    ON CONFLICT (key) DO UPDATE SET
      value = jsonb_set(site_settings.value, '{items}',
        CASE WHEN coalesce(site_settings.value->'items', '[]'::jsonb) @> jsonb_build_array(${v}::jsonb)
             THEN site_settings.value->'items'
             ELSE coalesce(site_settings.value->'items', '[]'::jsonb) || jsonb_build_array(${v}::jsonb) END),
      updated_at = now()`);
}
