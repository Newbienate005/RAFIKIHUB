import { sql } from "drizzle-orm";
import type { getDb } from "@/lib/db";

type Db = NonNullable<ReturnType<typeof getDb>>;

/**
 * A small fixed-window counter kept in site_settings (key "rl:<name>", value { n, start }), so it
 * works across serverless instances without extra services. Counts failures only.
 */
const keyFor = (name: string) => `rl:${name}`.slice(0, 80);

/** How many failures are on record in the current window. */
export async function failures(db: Db, name: string, windowSec: number): Promise<number> {
  const rows = (await db.execute(sql`
    SELECT (value->>'n')::int AS n FROM site_settings
    WHERE key = ${keyFor(name)} AND (value->>'start')::float >= extract(epoch from now()) - ${windowSec}`)) as unknown as { rows?: { n: number }[] } | { n: number }[];
  const list = Array.isArray(rows) ? rows : rows.rows ?? [];
  return list[0]?.n ?? 0;
}

/** Records one failure, starting a new window if the last one has run out. */
export async function recordFailure(db: Db, name: string, windowSec: number) {
  await db.execute(sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${keyFor(name)}, jsonb_build_object('n', 1, 'start', extract(epoch from now())), now())
    ON CONFLICT (key) DO UPDATE SET
      value = CASE WHEN (site_settings.value->>'start')::float < extract(epoch from now()) - ${windowSec}
                   THEN jsonb_build_object('n', 1, 'start', extract(epoch from now()))
                   ELSE jsonb_set(site_settings.value, '{n}', to_jsonb((site_settings.value->>'n')::int + 1)) END,
      updated_at = now()`);
}

export async function clearFailures(db: Db, name: string) {
  await db.execute(sql`DELETE FROM site_settings WHERE key = ${keyFor(name)}`);
}

/** The caller's IP as Vercel (or a proxy in front of Hostinger) reports it. */
export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
