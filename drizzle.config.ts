import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit only reads .env on its own; the site and the importer keep DATABASE_URL in .env.local
if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
