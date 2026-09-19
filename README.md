# RafikiHub

A React + TypeScript + Tailwind v4 frontend for rafikihub.com, built with Vite. This started as a Figma Make prototype and has been cleaned up here into a standalone project — no Figma Make tooling required, just plain `npm`/`vite`.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to port 5173). `npm run build` produces a production build in `dist/`; `npm run typecheck` runs TypeScript with no emit.

## Stack

- **React 19** + **TypeScript 5.7**, built with **Vite 8**
- **Tailwind CSS v4** (CSS-first `@theme`, see `src/index.css`)
- State-based SPA routing — there's no router library; `App.tsx` holds a `Page` union type and a `navigate(page, data)` function passed down through props. There are no URL routes; deep-linking would need to be added if that matters for the real site.
- `src/theme.tsx` exposes a `useTheme()` hook with a flat token object (`t.bg`, `t.fg`, `t.terra`, etc.) — light theme only right now.
- `src/data.ts` holds the mock/seed data (testimonials, team, blog posts, timeline, etc.) consumed by the pages.

## Where the content stands

Most pages now carry real, verbatim or structurally-matched content pulled from the actual rafikihub.com codebase (a PHP snapshot the client shared): Terms & Conditions and Privacy Policy (`TermsPage.tsx`/`PrivacyPage.tsx`, sourced from `src/termsData.ts`/`src/privacyData.ts`), About's four core sections, the Homepage's "Kick-off your career" copy, Services' quote/essay, and — as of the latest pass — the dashboards and forms:

- **Register** (`RegisterPage.tsx`) — the real two-step flow from `register.php`/`registerForm.php`/`signup.php`: a quick Name/Email/Country/Phone/Gender panel, then a full Personal Details + Account Details form (Member Option → Member Category, Wardrobe/Young-Performer conditionals, a 3-credit minimum for Actor/Actress, password confirmation).
- **Join / Options** (`JoinPage.tsx`/`OptionsPage.tsx`) — the real 8 membership category cards (Performers, Agents, Casting Professionals, Young Performers, Crew, Pets, Corporates, Rooms & Studio) with their actual bullet copy and Rooms & Studio's listing criteria. There is no pricing anywhere on the real site, so the old 4-tier price table is gone.
- **Locations** (`LocationsPage.tsx`) — the real film-location scouting request form (Organization, Country, dates, Intended Location, Services Required, etc.), not a member-cities gallery.
- **Contacts** (`ContactsPage.tsx`) — the real searchable Agent/Casting/Corporate directory with a quick-signup sidebar widget, not a "contact us" form.
- **Talent Management** (`TalentManagementPage.tsx`) — the real static pitch page for RafikiHub's in-house talent agency, not a talent-browsing grid.
- **Dashboard** (`DashboardPage.tsx` + `src/pages/dashboard/*`) — a role-based dashboard (`performer` / `casting` / `crew` / `pet` / `rooms`, see `DashboardRole` in `data.ts`). The Performer role is built out in full depth: real hardcoded HOME stats, Opportunities/My Agents/My Media/Rooms & Studio/Resource Hub tabs, an Invoice generator, a Calendar tab (which intentionally reuses My Agents' table columns — a genuine quirk in the live production code, kept on purpose), and a full multi-section "Edit CV" builder (personal data, appearance, voice attributes, vocal range, skills-with-proficiency, training, credits) matching the real CV editor field-for-field. Casting/Crew/Pet/Rooms roles are simplified variants — the real site's own treatment of those roles wasn't researched to the same depth.
- **Profile** (`ProfilePage.tsx`) — a tabbed PROFILE / SKILLS / CREDITS / MEDIA & FILES layout matching `profile.php`, with a contact-details card and social links, instead of the old hero + "similar artists" layout.

Some pieces are necessarily **best-effort approximations**, because the real site pulls them from a database with no static fallback anywhere in the PHP: the exact Member Option/Category values, the dashboard's DataTables (agents, applications, invoices, calendar rows), and the Young Performer "Specification" list are all plausible mock data rather than the live values. `fullCountryList`, the CV attribute selects (appearance/eye/hair/voice/etc.), and the 8 membership cards' bullet copy, by contrast, are close-to-verbatim matches to real static HTML/PHP.

Testimonials, team bios, blog posts, FAQ entries, and video listings are still placeholder/mock data — the live site has no static seed data for these either (100% database-driven with no fallback). `src/data.ts` is where all of this lives — swap it for real data once a backend exists.

## No backend yet

This is a frontend-only project — there's no API, no database, and no auth. Forms (register, invoices, CV edits, contact, etc.) update local component state but don't persist or send anywhere, and file uploads just record the chosen filename. The real site's invoice tool generates an actual PDF server-side (via mPDF); that's out of scope here since there's no server. Hooking this up to a real backend is the next piece of work.
