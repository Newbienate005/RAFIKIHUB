#!/usr/bin/env node
// Runs a .sql file of schema changes against DATABASE_URL, one statement at a time, stopping at the first error.
//   npm run db:sql -- scripts/sql/2026-10-09-member-login.sql
// Use this instead of `npm run db:push` on PostgreSQL 18 (see the note in each file).
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const file = process.argv[2];
if (!file) { console.error("Usage: npm run db:sql -- path/to/file.sql"); process.exit(1); }
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL isn't set (.env.local)."); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
const text = (await readFile(file, "utf8")).replace(/^\s*--.*$/gm, "");
// Split on semicolons that end a statement (these files have no semicolons inside strings or bodies)
const statements = text.split(/;\s*(?:\n|$)/).map((s) => s.trim()).filter(Boolean);
for (const [i, st] of statements.entries()) {
  try {
    await sql(st);
    console.log(`  ${String(i + 1).padStart(2)}. ok   ${st.split("\n")[0].slice(0, 90)}`);
  } catch (e) {
    console.error(`  ${String(i + 1).padStart(2)}. FAILED ${st.split("\n")[0].slice(0, 90)}\n      ${e.message}`);
    process.exit(1);
  }
}
console.log(`Done: ${statements.length} statements.`);
