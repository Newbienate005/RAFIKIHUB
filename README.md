# RafikiHub website (v2)

Next.js 15 site for RafikiHub, with SEO + AEO built in, forms saved to a Postgres database, and ready to host on Vercel.

## 1. Run it on your computer

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local      # then fill in the values
npm run dev                     # open http://localhost:3000
```

The site runs without a database. Forms will show a "database isn't connected yet" message until step 3 is done.

## 2. Bring over the images from the old site

```bash
npm run images:import
```

This crawls rafikihub.com and downloads every image (headshots, logo, banners) into `public/images/legacy/`.
Open `public/images/legacy/index.html` in your browser to see them all with their file paths.

Then open `lib/images.ts` and point each slot at the file you want, e.g.

```ts
logo: "/images/legacy/logo.png",
hero: [{ src: "/images/legacy/june-wekesa.jpg", name: "June Wekesa", role: "Actress" }, ...]
```

Any slot without a file shows a neat initials placeholder, so nothing ever looks broken. Restart `npm run dev` after adding images.

## 3. Connect the database (Neon Postgres, free tier)

The database stores four things (see `lib/db/schema.ts`):

| Table | Filled by |
|---|---|
| `members` | Join form (`/join`) |
| `casting_calls` | Post a casting form (`/casting`) |
| `contact_messages` | Contact form (`/contact`) |
| `newsletter_subscribers` | Footer email sign-up |

**Easiest way, through Vercel (after step 4):**
1. In your Vercel project, open **Storage → Create Database → Neon (Serverless Postgres)** and connect it to the project.
   Vercel adds `DATABASE_URL` to your environment variables automatically.
2. Copy that `DATABASE_URL` into your local `.env.local`.
3. Create the tables:
   ```bash
   npm run db:push
   ```
4. Redeploy on Vercel. Forms now save.

**Or directly with Neon:** sign up at neon.tech, create a project, copy the connection string into `DATABASE_URL`, run `npm run db:push`, and add the same variable in Vercel → Settings → Environment Variables.

**See submissions:** `npm run db:studio` opens a table browser, or use the Tables view in the Neon console.

Want to use Supabase or another Postgres instead? Any Postgres connection string works in `DATABASE_URL`.

## 4. Host on Vercel

1. Push this folder to a GitHub repository:
   ```bash
   git init && git add . && git commit -m "RafikiHub v2"
   git branch -M main
   git remote add origin https://github.com/<you>/rafikihub.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New → Project** → import the repo. Vercel detects Next.js; keep the defaults.
3. Add environment variables: `NEXT_PUBLIC_SITE_URL=https://rafikihub.com` (and `DATABASE_URL`, see step 3).
4. Click **Deploy**. You get a `*.vercel.app` preview link.
5. Point your domain: Vercel → Project → **Settings → Domains** → add `rafikihub.com` and `www.rafikihub.com`,
   then update the DNS records at your domain registrar exactly as Vercel shows (usually an `A` record to `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`).

Every future `git push` redeploys automatically.

## 5. After launch: SEO checklist

- Add the site to **Google Search Console** and **Bing Webmaster Tools**, then submit `https://rafikihub.com/sitemap.xml`.
- Old URLs (`/about-us`, `/join-now`, `/services`) redirect permanently to the new pages (`next.config.mjs`), so existing rankings carry over. Add more there if you find other old links.
- Create or claim a **Google Business Profile** for RafikiHub in Nairobi, using the same name, phone and email as the site.
- Test structured data at search.google.com/test/rich-results (home, /faq, a blog post).

## What's built in for SEO and AEO

- **Metadata** on every page: unique title, description, canonical URL, Open Graph and Twitter cards, plus an auto-generated share image (`app/opengraph-image.tsx`).
- **Structured data (JSON-LD):** Organization + LocalBusiness, WebSite, FAQPage, BreadcrumbList, Article, Service and Person.
- **Answer-first content:** question headings ("What is RafikiHub?", "How does casting work?") with a direct answer in the first sentence, which is what Google's AI Overviews, ChatGPT, Perplexity and Claude quote.
- **FAQ in plain HTML** (`<details>`) so answers are readable by every crawler, with or without JavaScript.
- **`robots.txt`** that allows search engines and AI answer engines, **`sitemap.xml`**, and **`/llms.txt`**, a plain-text summary for AI assistants.
- Static pages, optimised images (AVIF/WebP), semantic HTML, accessible forms and keyboard focus for strong Core Web Vitals.

## Where to edit things

| What | File |
|---|---|
| Phone, email, domain, social links | `lib/site.ts` |
| FAQs, testimonials, member types, team, articles, profile structure | `lib/data.ts` |
| Images | `lib/images.ts` |
| Colours and fonts | top of `app/globals.css` |
| Form fields | the page file, e.g. `app/join/page.tsx`, plus `lib/validation.ts` |

To add a blog post, add an entry to `articles` in `lib/data.ts`. It appears on `/blog`, in the sitemap and gets Article schema automatically.
