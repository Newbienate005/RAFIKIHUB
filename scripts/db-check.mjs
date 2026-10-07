// Read-only: lists the tables and row counts, to check `npm run db:push` worked.
//   npm run db:check
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const tables = await sql("select table_name from information_schema.tables where table_schema = 'public' order by 1");
for (const { table_name } of tables) {
  const [{ n }] = await sql(`select count(*)::int as n from "${table_name}"`);
  console.log(`${table_name.padEnd(24)} ${n}`);
}
