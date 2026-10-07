# Moving data from the old rafikihub.com database

**The importer is built:** `scripts/import-old-db.mjs`. See "Running the import" below, or the
Import page in the admin (`/admin/import`). Sections 2 and 3 describe what it does.

## Running the import

1. Export the old database from Hostinger: phpMyAdmin → the RafikiHub database → Export (Quick, SQL). Keep the file private.
2. Check it, changing nothing: `npm run import:old -- path/to/export.sql --dry-run`
3. Put a **Neon dev branch** connection string in `.env.local` as `DATABASE_URL`, run `npm run db:push`, then
   `npm run import:old -- path/to/export.sql`. Check members and profiles in `/admin`.
4. Repeat against the live database. Before rafikihub.com points at the new site, run once more with
   `--copy-files` (needs `BLOB_READ_WRITE_TOKEN`) so photos, reels and blog images are copied from the old
   site into Vercel Blob. `--assets-dir <folder>` reads them from a downloaded copy of the old `assets/` folder instead.

Re-running is safe: accounts and castings are updated, profiles are refreshed only while `source = 'legacy'`
(editing a profile in the admin sets it to `admin`), and everything else is inserted once (legacy ids and keys).
Tests: `npm run test:import` (runs against `scripts/lib/fixtures/old-sample.sql`, a fictional export).

### Corrections found in the old PHP code

- The comma-joined copies on `users` (skills, cities, nationalities) are actually **space-joined**. The importer uses the child tables.
- `agent_bio` is plain text for performers, crew and pets; only casting accounts (role 2) have HTML. The importer strips HTML from all of them.
- Castings store **"All Categories" / "All Countries" as literal rows**. The importer turns them into empty lists (= everyone).
- The main photo is the one with `photos.profile = 1`, else the lowest id. Photos with `status = 0` were hidden and stay out.
- Deleting a user on the old site never deleted their child rows, so the export has orphans. The importer skips them and counts them.
- The code writes the text `"NULL"` for empty values in places; it's treated as empty.
- For casting and rooms accounts, `date_of_birth` holds the signup time, not a birthday.
- `payment_history` amounts were shown with a `$` sign; they're imported as Ksh, so check a few.
- Old profile links (`link_url`) are random strings with capitals. They're kept exactly, so old links keep working.
- Not imported: rooms and studio accounts (role 6), pet *profiles* (their accounts are imported), every row in `files`, and the
  content tables (`classes`, `testimonials`, `partners`, `faqs`), which are curated in the admin.
- **Security:** the old `.env` holds an Elastic Email API key, and `data/files/payment.php` has a Pesawise API key and secret
  hard-coded. Rotate all three, and never copy them into this repo.

The old site (PHP + MySQL) keeps its data in a MySQL database. The code (`master-main.zip`) holds no data export, so the
first step is an export from the old host. This document maps the old tables to the new Postgres schema in
`lib/db/schema.ts` and lists what the migration script has to handle.

## 1. Get an export

From the old host's control panel (phpMyAdmin → Export) or on the server:

```bash
mysqldump --single-transaction --hex-blob --default-character-set=utf8mb4 <database> > rafikihub-old.sql
```

Also copy the uploaded files. The database only stores bare filenames, and the folder depends on the table:

| Files | Old folder |
|---|---|
| Profile photos (`photos`, `users.image_link`) | `assets/images/gallery/` |
| Blog images (`blog.image`) | `assets/images/blog/` |
| Showreels (`videos`) and voice clips (`voices`) | `assets/videos/`, `assets/voices/` |
| Documents (`files`) and invoices | `assets/files/`, `assets/pdf/files/` |
| Room and studio photos (`rooms_photos`) | `assets/images/rooms/` |
| Casting and email inline images | `assets/images/talents/` |
| Video library thumbnails (`classes`) | `assets/images/classes/` |
| Partner logos | `assets/images/partners/` |

**Treat the export as sensitive.** It contains ID/passport numbers, KRA PINs and weak password hashes.

## 2. Old tables → new tables

**One old `users` table holds every account.** Its `roles_id` says what kind of account it is:
1 = admin, 2 = casting professional, agent or corporate, 3 = performer, 4 = crew, 5 = pet, 6 = rooms and studio.

| Old | New | Notes |
|---|---|---|
| `users` (account columns) | `accounts` | `legacy_id` ← `users.id`; role 3/4/5 → `performer`, role 2 → `casting`; `category` ← `membership_category`; status lower-cased. Skip role 1 test/admin rows or import them with `is_admin`. |
| `users` (profile columns) + `cities`, `nationalities`, `traits`, `skills`, `credits`, `training`, `photos`, `videos`, `voices` | `talent_profiles` (one row, profile in the `data` JSON) | `profile_url` ← `users.link_url` so old `/profile?url=` links keep working. `published` ← status Active and `visible = 'Yes'`. Mapping of each field is below. |
| `auditions` + `talent_categories` + `talent_countries` | `auditions` | `ref` ← `random_id`; categories and countries become JSON arrays (empty = "All"); `filled` ← `status = 1`; `closes_on` ← `close_date`. |
| `auditions_applications` | `audition_applications` | The old table copies the whole audition into each row; keep only `audition_id`, `user_id` and a status of `new`. |
| `agents` | `agent_clients` | `performer_id` ← `user_id`, `agent_id` ← `agent_id`, status PENDING/APPROVED lower-cased. |
| `billing`, `payment_history` | `payments` | Amounts in Ksh; `reference` ← `transactionreference`. |
| `services` (Sio Bahati bookings) | `service_bookings` | `full_name` ← firstname + lastname, `preferred_date` ← `sdate`. |
| `locations` | `location_requests` | Location scouting requests. |
| `blog` | `lib/data.ts` → `articles` | Few rows, so they live in code. Pull the full body of each post from here (the new site only has summaries for the older posts, and is missing "Conversations with the Collective – A mental health initiative with AFFC", 2 June 2023). |
| `faqs`, `testimonials`, `partners`, `classes` | `lib/data.ts` | Small content tables; copy what's still wanted into the code. `classes` fills the Video Library. |
| `rooms_and_studios`, `rooms_photos`, `rooms_and_studio_bookings` | — | No home yet. The rooms and studio hire feature wasn't carried over. |
| `invoices`, `signatures`, `corners`, `popup`, `emails`, `emails_store`, `settings`, `plans`, `plan_categories`, `years` | — | Not needed, or replaced by code (plans and prices are in `lib/data.ts`). |

### Profile fields (`users` → `talent_profiles.data`, the `TalentProfile` type in `lib/data.ts`)

- `fullName` ← `name`; `category` ← `membership_category`; `bio` ← `agent_bio` (may contain HTML).
- `personalData.dateOfBirth` ← date part of `date_of_birth`; `playingAge` ← `age_from`/`age_to`.
- `height` ← `first_height` + `second_height` (feet and inches, or centimetres if the value contains "cm").
- `appearance`, `eyeColor`, `hairColor`, `hairLength`, `facialHair`, voice quality/character and vocal range: match the old
  text against the new option lists, and set anything unrecognised to null.
- Measurements (`chest`, `waist`, `hips`, `inside_leg`, `inside_arm`, `collar`, `hat`, `weight`, `shoe_size`, `dress_size`) are free text with an optional unit.
- Cities, nationalities and traits come from their own tables (`user_id` → `users.id`).
- Skills come from the `skills` table (`type`: Language, Dialect, Music, Other, Performance, Present, Sport, Vehicle).
  Don't use the comma-joined copies on `users`.
- Credits ← `credits` (production_name, production_type, production_year, role, company, director).
- Training ← `training` (course_name, institution_name, date_started, date_ended).
- Media: headshots ← `photos.name` (the one flagged `profile` first), showreel ← first `videos` row or `users.youtube`, voice reel ← first `voices` row.
- **Leave out of the public JSON:** `id_passport`, `tax_pin`, and ID, passport, birth certificate and consent documents in `files`.
- **No home in the new type:** social links, the pet fields, and Sport/Vehicle/Music/Performance/Presenting skills.
  Add fields for them if you want them, or leave them out on purpose.

## 3. Things the script must handle

1. **Passwords are unsalted MD5.** Import them into `accounts.password_hash` with `hash_algo = 'md5'`. When login is built,
   check MD5 once, then re-hash with bcrypt or argon2 and clear `hash_algo`. Or skip them and ask everyone to reset
   their password. Either way, don't keep MD5 hashes longer than necessary.
2. **Dates** are `Y-m-d H:i:s` strings in Kenyan time (UTC+3), with some `0000-00-00` and empty values. Convert those to null.
3. **Emails** had no unique constraint. De-duplicate case-insensitively before inserting into `accounts`.
4. **Keep old ids** in `legacy_id` and remap every `user_id`, `owner_id`, `agent_id` and `audition_id` through them.
5. **Status values mix formats** ('Active', 'PENDING', 0/1, 'Yes'). Normalise them to the lower-case values in the new schema.
6. **Encoding:** watch for broken characters in names (latin1 stored as utf8).
7. **Blocked, unverified and expired users:** import them with `published = false` rather than dropping them.

## 4. Order of work

1. Get the MySQL export and the uploaded files.
2. Run `npm run db:push` to create the new tables.
3. Write `scripts/migrate-old-db.mjs` against the real export: accounts → talent profiles → auditions → applications → agent links → payments.
4. Upload photos, showreels and voice clips to storage (e.g. Vercel Blob), and write absolute URLs into the profiles.
5. Check a sample of profiles on `/profile/<old link_url>` against the old site before switching the domain.
