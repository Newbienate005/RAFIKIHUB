#!/usr/bin/env node
/**
 * Imports the old rafikihub.com MySQL export into the new database.
 *
 *   npm run import:old -- path/to/rafikihub-old.sql --dry-run     # check the export, change nothing
 *   npm run import:old -- path/to/rafikihub-old.sql               # import
 *   npm run import:old -- path/to/rafikihub-old.sql --copy-files  # also copy photos, reels and blog images to Vercel Blob
 *
 * Options
 *   --dry-run              Read and convert everything, print what would be imported, write nothing.
 *   --assets-base <url>    Where the old uploaded files can be downloaded (default https://rafikihub.com).
 *   --assets-dir <folder>  A local copy of the old site's assets/ folder, used instead of downloading.
 *   --copy-files           Copy every referenced photo, voice clip and blog image into Vercel Blob
 *                          (needs BLOB_READ_WRITE_TOKEN). Photos are resized to web size (WebP, 1600px long edge)
 *                          on the way. Do this before rafikihub.com points at the new site, because the old files
 *                          stop being reachable then.
 *   --copy-videos          With --copy-files, also copy the showreels (about 11 GB, so off by default). Without it
 *                          they keep loading from the old hosting.
 *
 * Safe to run more than once (until the switch-over): accounts and castings are updated, profiles are
 * refreshed only if nobody has edited them in the admin, and everything else is added once.
 * Needs DATABASE_URL (read from .env.local) and the tables from `npm run db:push`.
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { parseDump } from "./lib/mysqldump.mjs";
import { transform } from "./lib/transform-old.mjs";
import { profileCompleteness } from "../lib/profile-completeness.ts";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const file = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--assets-base" && args[args.indexOf(a) - 1] !== "--assets-dir");
const dryRun = flag("--dry-run");
const assetsBase = value("--assets-base", "https://rafikihub.com");
const assetsDir = value("--assets-dir", null);
const copyFiles = flag("--copy-files");
const copyVideos = flag("--copy-videos");

if (!file) {
  console.error("Usage: npm run import:old -- path/to/export.sql [--dry-run] [--copy-files] [--assets-dir folder]");
  process.exit(1);
}

const log = (...m) => console.log(...m);

// The only tables the import reads; everything else (e.g. the huge `emails` log) is skipped unparsed
const USED = new Set([
  "users", "cities", "nationalities", "traits", "skills", "credits", "training", "photos", "videos", "voices", "files",
  "auditions", "talent_categories", "talent_countries", "auditions_applications", "agents", "billing", "payment_history",
  "services", "locations", "location_services", "blog", "classes", "testimonials", "partners", "faqs",
]);

log(`Reading ${path.basename(file)}…`);
const tables = parseDump(await readFile(file, "utf8"), { only: USED });
log(`Read ${tables.size} tables: ${[...tables].map(([t, r]) => `${t} (${r.length})`).join(", ")}`);
if (tables.skipped?.size) {
  const mb = (b) => `${(b / 1048576).toFixed(1)} MB`;
  log(`Not needed, skipped: ${[...tables.skipped].sort((a, b) => b[1] - a[1]).map(([t, b]) => `${t} (${mb(b)})`).join(", ")}`);
}
if (!tables.has("users")) {
  console.error("This export has no `users` table. Export the whole RafikiHub database from phpMyAdmin.");
  process.exit(1);
}

const out = transform(tables, { assetsBase });
for (const p of out.profiles) p.completeness = profileCompleteness(p.data).percent;

const summary = {
  "Member accounts": out.accounts.length,
  "Talent profiles": out.profiles.length,
  "  of which published": out.profiles.filter((p) => p.published).length,
  "  of which 100% complete": out.profiles.filter((p) => p.completeness >= 100).length,
  "Casting breakdowns": out.auditions.length,
  "Applications": out.applications.length,
  "Agent links": out.agentLinks.length,
  "Payments": out.payments.length,
  "Sio Bahati bookings": out.bookings.length,
  "Location requests": out.locationRequests.length,
  "Blog posts": out.articles.length,
};
log("\nTo import:");
for (const [k, v] of Object.entries(summary)) log(`  ${k.padEnd(28)} ${v}`);
if (Object.keys(out.report.skipped).length) {
  log("\nLeft out:");
  for (const [k, v] of Object.entries(out.report.skipped)) log(`  ${String(v).padStart(5)}  ${k}`);
}
for (const n of out.report.notes) log(`  Note: ${n}`);

if (dryRun) {
  log("\nDry run: nothing was written. Run again without --dry-run to import.");
  process.exit(0);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("\nDATABASE_URL isn't set. Add it to .env.local (use a Neon dev branch first), then run again.");
  process.exit(1);
}
const sql = neon(url);

/* ───────────── optional: copy old files into Vercel Blob ───────────── */
const moved = new Map(); // old-site link → its copy in Blob
if (copyFiles) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("\n--copy-files needs BLOB_READ_WRITE_TOKEN in .env.local.");
    process.exit(1);
  }
  const { put, head } = await import("@vercel/blob");
  const sharp = (await import("sharp")).default;
  // Old photos are mostly uncompressed PNGs of 1–3 MB; web size is a tenth of that
  const resize = (body) => sharp(body, { failOn: "none" }).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  const prefix = `${assetsBase.replace(/\/$/, "")}/assets/`;
  const urls = new Set();
  const collect = (u) => { if (typeof u === "string" && u.startsWith(prefix)) urls.add(u); };
  for (const p of out.profiles) {
    p.data.media.headshots.forEach(collect);
    p.data.media.voiceClips.forEach((c) => collect(c.url));
    if (copyVideos) p.data.media.reels.forEach((c) => collect(c.url));
  }
  for (const a of out.articles) collect(a.data.image);
  log(`\nCopying ${urls.size} files to Vercel Blob${copyVideos ? "" : " (showreels stay on the old hosting; add --copy-videos to copy them too)"}…`);
  let failed = 0;
  const list = [...urls];
  const worker = async () => {
    while (list.length) {
      const src = list.pop();
      const rel = decodeURIComponent(src.slice(prefix.length));
      const isImage = rel.startsWith("images/") && !/\.gif$/i.test(rel);
      const pathname = `legacy/${isImage ? rel.replace(/\.[a-z0-9]+$/i, "") + ".webp" : rel}`;
      try {
        const existing = await head(pathname).catch(() => null);
        if (existing) { moved.set(src, existing.url); continue; }
        let body;
        if (assetsDir) {
          const local = path.join(assetsDir, ...rel.split("/"));
          await access(local);
          body = await readFile(local);
        } else {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          body = Buffer.from(await res.arrayBuffer());
        }
        if (isImage) body = await resize(body).catch(() => null) ?? body;
        const blob = await put(pathname, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, multipart: body.length > 20 * 1024 * 1024 });
        moved.set(src, blob.url);
      } catch (e) {
        failed++;
        if (failed <= 10) console.warn(`  couldn't copy ${rel}: ${e.message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  const swap = (u) => (u && moved.get(u)) || u;
  for (const p of out.profiles) {
    p.data.media.headshots = p.data.media.headshots.map(swap);
    p.data.media.showreelUrl = swap(p.data.media.showreelUrl);
    p.data.media.voiceoverReelUrl = swap(p.data.media.voiceoverReelUrl);
    p.data.media.reels = p.data.media.reels.map((c) => ({ ...c, url: swap(c.url) }));
    p.data.media.voiceClips = p.data.media.voiceClips.map((c) => ({ ...c, url: swap(c.url) }));
  }
  for (const a of out.articles) a.data.image = swap(a.data.image);
  log(`  Copied ${moved.size}, failed ${failed}${failed ? " (those keep their old link; re-run to retry)" : ""}.`);
}

/* ───────────── write ───────────── */

/** Runs one INSERT … SELECT FROM jsonb_to_recordset($1) per batch of rows. */
async function load(label, rows, query, size = 400) {
  let done = 0;
  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    await sql(query, [JSON.stringify(batch)]);
    done += batch.length;
  }
  log(`  ${label.padEnd(22)} ${done}`);
}

log("\nImporting…");
try {
  await load("Member accounts", out.accounts, `
    INSERT INTO accounts (legacy_id, email, name, role, category, password_hash, hash_algo, status, is_admin, phone, country, profile_url, plan_id, last_login_at, created_at)
    SELECT x.legacy_id, left(x.email, 200), left(x.name, 160), x.role, left(x.category, 80), x.password_hash, x.hash_algo, x.status, coalesce(x.is_admin, false),
           left(x.phone, 40), left(x.country, 80), left(x.profile_url, 120), x.plan_id, x.last_login_at, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(legacy_id int, email text, name text, role text, category text, password_hash text, hash_algo text, status text,
         is_admin boolean, phone text, country text, profile_url text, plan_id text, last_login_at timestamptz, created_at timestamptz)
    -- someone may already have signed up on the new site with the same email
    WHERE NOT EXISTS (SELECT 1 FROM accounts a WHERE lower(a.email) = x.email AND a.legacy_id IS DISTINCT FROM x.legacy_id)
    ON CONFLICT (legacy_id) DO UPDATE SET
      email = excluded.email, name = excluded.name, role = excluded.role, category = excluded.category, status = excluded.status,
      phone = excluded.phone, country = excluded.country, profile_url = excluded.profile_url, plan_id = excluded.plan_id, last_login_at = excluded.last_login_at,
      -- once a member has logged in on the new site their password is re-hashed: never put the old MD5 back
      password_hash = CASE WHEN accounts.hash_algo = 'md5' OR accounts.password_hash IS NULL THEN excluded.password_hash ELSE accounts.password_hash END,
      hash_algo = CASE WHEN accounts.hash_algo = 'md5' OR accounts.password_hash IS NULL THEN excluded.hash_algo ELSE accounts.hash_algo END`);

  await load("Talent profiles", out.profiles, `
    INSERT INTO talent_profiles (profile_url, full_name, category, published, represented, data, source, completeness, updated_at)
    SELECT left(x.profile_url, 120), left(x.full_name, 160), left(x.category, 60), x.published, false, x.data, 'legacy', x.completeness, now()
    FROM jsonb_to_recordset($1::jsonb) AS x(profile_url text, full_name text, category text, published boolean, data jsonb, completeness int)
    ON CONFLICT (profile_url) DO UPDATE SET
      full_name = excluded.full_name, category = excluded.category, published = excluded.published, data = excluded.data,
      completeness = excluded.completeness, updated_at = now()
    WHERE talent_profiles.source = 'legacy'`, 100);

  // Profiles edited on the new site aren't refreshed above, but their old-site links still move to the copies
  if (moved.size) {
    let n = 0;
    for (const row of await sql(`SELECT profile_url, data FROM talent_profiles WHERE source <> 'legacy'`)) {
      const before = JSON.stringify(row.data);
      let after = before;
      for (const [from, to] of moved) if (after.includes(from)) after = after.split(from).join(to);
      if (after !== before) { await sql(`UPDATE talent_profiles SET data = $2::jsonb WHERE profile_url = $1`, [row.profile_url, after]); n++; }
    }
    log(`  ${"Edited profiles' links".padEnd(22)} ${n}`);
  }

  await load("Casting breakdowns", out.auditions, `
    INSERT INTO auditions (legacy_id, ref, owner_id, title, type, gender, categories, countries, body, closes_on, filled, status, published_at, created_at, updated_at)
    SELECT x.legacy_id, left(x.ref, 20), a.id, left(x.title, 200), left(x.type, 80), left(x.gender, 20), x.categories, x.countries, x.body, x.closes_on,
           x.filled, x.status, x.published_at, coalesce(x.created_at, now()), now()
    FROM jsonb_to_recordset($1::jsonb) AS x(legacy_id int, ref text, owner_legacy_id int, title text, type text, gender text, categories jsonb, countries jsonb,
         body text, closes_on date, filled boolean, status text, published_at timestamptz, created_at timestamptz)
    JOIN accounts a ON a.legacy_id = x.owner_legacy_id
    ON CONFLICT (legacy_id) DO UPDATE SET
      title = excluded.title, type = excluded.type, gender = excluded.gender, categories = excluded.categories, countries = excluded.countries,
      body = excluded.body, closes_on = excluded.closes_on, filled = excluded.filled, status = excluded.status, updated_at = now()`);

  await load("Applications", out.applications, `
    INSERT INTO audition_applications (audition_id, applicant_id, status, created_at)
    SELECT au.id, ac.id, x.status, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(audition_legacy_id int, applicant_legacy_id int, status text, created_at timestamptz)
    JOIN auditions au ON au.legacy_id = x.audition_legacy_id
    JOIN accounts ac ON ac.legacy_id = x.applicant_legacy_id
    ON CONFLICT (audition_id, applicant_id) DO NOTHING`);

  await load("Agent links", out.agentLinks, `
    INSERT INTO agent_clients (agent_id, performer_id, status, created_at)
    SELECT ag.id, pf.id, x.status, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(agent_legacy_id int, performer_legacy_id int, status text, created_at timestamptz)
    JOIN accounts ag ON ag.legacy_id = x.agent_legacy_id
    JOIN accounts pf ON pf.legacy_id = x.performer_legacy_id
    ON CONFLICT (agent_id, performer_id) DO NOTHING`);

  await load("Payments", out.payments, `
    INSERT INTO payments (legacy_key, account_id, plan_id, amount_ksh, phone, provider, reference, status, paid_at, created_at)
    SELECT x.legacy_key, a.id, x.plan_id, x.amount_ksh, left(x.phone, 20), x.provider, left(x.reference, 80), x.status, x.paid_at, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(legacy_key text, account_legacy_id int, plan_id text, amount_ksh int, phone text, provider text, reference text,
         status text, paid_at timestamptz, created_at timestamptz)
    JOIN accounts a ON a.legacy_id = x.account_legacy_id
    ON CONFLICT (legacy_key) DO NOTHING`);

  await load("Sio Bahati bookings", out.bookings, `
    INSERT INTO service_bookings (legacy_id, service, full_name, email, phone, preferred_date, notes, status, created_at)
    SELECT x.legacy_id, left(x.service, 40), left(x.full_name, 160), left(x.email, 200), left(x.phone, 40), left(x.preferred_date, 60), x.notes, x.status, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(legacy_id int, service text, full_name text, email text, phone text, preferred_date text, notes text, status text, created_at timestamptz)
    ON CONFLICT (legacy_id) DO NOTHING`);

  await load("Location requests", out.locationRequests, `
    INSERT INTO location_requests (legacy_id, organization, email, country, phone, nature, crew, from_date, to_date, location_type, services, details, status, created_at)
    SELECT x.legacy_id, left(x.organization, 200), left(x.email, 200), left(x.country, 80), left(x.phone, 40), left(x.nature, 200), left(x.crew, 40),
           left(x.from_date, 40), left(x.to_date, 40), left(x.location_type, 80), left(x.services, 300), x.details, x.status, coalesce(x.created_at, now())
    FROM jsonb_to_recordset($1::jsonb) AS x(legacy_id int, organization text, email text, country text, phone text, nature text, crew text, from_date text,
         to_date text, location_type text, services text, details text, status text, created_at timestamptz)
    ON CONFLICT (legacy_id) DO NOTHING`);

  // Blog posts go in as content; existing posts with the same link name are left alone
  await load("Blog posts", out.articles, `
    INSERT INTO content_items (kind, slug, data, published, sort_order)
    SELECT 'articles', left(x.slug, 200), x.data, x.published, 0
    FROM jsonb_to_recordset($1::jsonb) AS x(slug text, data jsonb, published boolean)
    ON CONFLICT (kind, slug) DO NOTHING`);

  await sql(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ('import:last', $1::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = now()`,
    [JSON.stringify({ at: new Date().toISOString(), file: path.basename(file), summary, skipped: out.report.skipped, notes: out.report.notes, filesCopied: copyFiles })],
  );
} catch (e) {
  console.error(`\nThe import stopped: ${e.message}`);
  if (/relation .* does not exist|column .* does not exist/i.test(e.message)) console.error("Run `npm run db:push` first to create or update the tables.");
  process.exit(1);
}

log("\nDone. Open /admin to check the members and profiles.");
if (out.articles.length) log("Imported blog posts show on the site once Blog posts is copied into the database in /admin (Website content → Blog posts).");
if (!copyFiles) log("Photos, reels and voice clips still load from the old site's files on Hostinger. When the new site takes over rafikihub.com, serve those files from a subdomain and set LEGACY_ASSETS_URL.");
