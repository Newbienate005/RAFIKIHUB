import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db: NeonHttpDatabase<typeof schema> | null = null;

/** Returns null when DATABASE_URL isn't set, so the site still builds and runs without a database. */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!db) db = drizzle(neon(url), { schema });
  return db;
}

export { schema };
