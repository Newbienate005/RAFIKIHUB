# RafikiHub website (v2)

The new rafikihub.com: a Next.js 15 site with member logins, talent profiles, castings, M-Pesa membership
payments and an admin, backed by a Neon Postgres database.

- **Staging:** https://rafikihub-b42r.vercel.app (Vercel). Every push to `main` deploys there.
- **Production:** rafikihub.com moves to this site on **Hostinger**, replacing the old PHP site. See "Moving to Hostinger" below.
- **Design:** follow [DESIGN.md](DESIGN.md) and [CLAUDE.md](CLAUDE.md) (RafikiHub orange `#FF8033`, dark surfaces, pill buttons).

## Run it on your computer

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local      # then fill in the values (see Settings)
npm run dev                     # open http://localhost:3000
```

> **`.env.local` points at the live database.** Anything you do locally (sign-ups, imports, SQL, test accounts)
> changes the real site's data. Use a Neon branch in `DATABASE_URL` if you want to experiment.

Without `DATABASE_URL` the site still runs, using the built-in content in `lib/data.ts`. Forms say the database
isn't connected, and `/profile/example-performer` shows a fictional example profile.

## Settings

Every setting the site reads is listed, with notes, in [.env.example](.env.example). Set them in `.env.local` and
wherever the site runs.

| Setting | What it's for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live domain, for canonical links, the sitemap and schema |
| `DATABASE_URL` | The Neon Postgres connection string |
| `MASTER_PASSWORD` | The master login at `/login`: opens `/admin` and previews both dashboards |
| `SESSION_SECRET` | Signs login cookies. Required in production; changing it signs everyone out |
| `APP_URL` | Where links in emails point (password resets, "Open my dashboard") |
| `ELASTIC_EMAIL_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | Emails to members and form alerts to the team (`RESEND_API_KEY` also works) |
| `BLOB_READ_WRITE_TOKEN` | Photo, showreel, voice clip and document uploads (Vercel Blob; works from any host) |
| `PESAWISE_API_KEY`, `PESAWISE_API_SECRET`, `PESAWISE_BALANCE_ID`, `PESAWISE_WEBHOOK_TOKEN` | M-Pesa membership payments |
| `LEGACY_ASSETS_URL` | Where the old site's `/assets/...` files are served from after the switch |

The admin home page (`/admin`) shows which of these are set up.

## Database changes

The database is Neon **PostgreSQL 18**.

- **Never run `npm run db:push` on it.** drizzle-kit 0.30.6 misreads PostgreSQL 18's named NOT NULL constraints
  and tries to drop them.
- Instead, write an idempotent `.sql` file in `scripts/sql/` (dated, like the ones there) and run it:
  `npm run db:sql -- scripts/sql/<file>.sql`. Keep `lib/db/schema.ts` in step by hand.
- `npm run db:check` lists the tables and row counts (read-only).

## Logins and dashboards

- **Members** join at `/join` and log in with their email and password. Performers, crew and pets get the
  Performer dashboard. Agents, casting directors and brands get the Casting dashboard.
- **The team** uses the master login at `/login` (not linked in the menus) to open the admin at `/admin`.
- **The admin covers:**
  - Members and profiles, castings, member documents, reviews and the inbox
  - Website content: blog posts, the Video Library, team, partners, testimonials, FAQs and contact listings
  - The old-site import

## Bringing data over from the old site

The importer is `scripts/import-old-db.mjs`. [docs/MIGRATION.md](docs/MIGRATION.md) explains what it moves and
how old fields map to new ones.

```bash
npm run import:old -- path/to/export.sql --dry-run   # check the export, changes nothing
npm run import:old -- path/to/export.sql             # import (into whatever DATABASE_URL points at)
```

Re-running is safe. Profiles members have edited on the new site keep their edits.

## Tests

```bash
npm test               # everything: lib/*.test.ts and the importer tests
npm run test:import    # just the importer, against a fictional old-site export
```

## Moving to Hostinger

1. Deploy this site as a Node.js app on Hostinger (`npm run build`, then `npm start`), with every setting above.
2. Serve the old site's uploaded files (about 14.7 GB) from a Hostinger subdomain, e.g. `media.rafikihub.com`, and
   set `LEGACY_ASSETS_URL` to it. Old photos, reels and the Video Library's testimonial video load from there.
3. Set `APP_URL` and `NEXT_PUBLIC_SITE_URL` to `https://rafikihub.com`.
4. In Pesawise, change the callback URL to `https://rafikihub.com/api/payments/pesawise?token=<PESAWISE_WEBHOOK_TOKEN>`.
5. Export the old database once more and run the import, so the last sign-ups on the old site come across.
6. Point rafikihub.com at the new site. Old links (`/profile?url=…`, `/article?url=…`, `/join-now` and the rest) redirect
   to their new pages (`next.config.mjs`).

## After launch: SEO

- Add the site to **Google Search Console** and **Bing Webmaster Tools**, and submit `https://rafikihub.com/sitemap.xml`.
- Create or claim the **Google Business Profile** for RafikiHub in Nairobi, with the same name, phone and email as the site.
- Test structured data at search.google.com/test/rich-results (home, `/faq`, a blog post, a profile).

Already built in: metadata and share images on every page, JSON-LD (Organization, LocalBusiness, FAQPage,
Article, Person, VideoObject and breadcrumbs), `robots.txt`, `sitemap.xml` and `/llms.txt`.

## Where to edit things

| What | Where |
|---|---|
| Blog posts, videos, team, partners, testimonials, FAQs, contact listings | The admin (`/admin`); `lib/data.ts` holds the built-in starting content |
| Phone, email, domain, menus, social links | `lib/site.ts` |
| Membership plans and prices, profile options | `lib/data.ts` |
| Images | `lib/images.ts` and `public/images/` |
| Colours and fonts | the top of `app/globals.css` |
