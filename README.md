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

Some pages now carry real, verbatim content pulled from the actual rafikihub.com codebase (a snapshot the client shared): the Terms & Conditions and Privacy Policy pages (`src/pages/TermsPage.tsx`, `src/pages/PrivacyPage.tsx`, sourced from `src/termsData.ts` / `src/privacyData.ts`), the About page's four core sections, the Homepage's "Kick-off your career" copy, and the Services page's quote/essay.

Other pages are still built on placeholder/mock data because no real static content exists for them in the codebase we had access to (testimonials, team bios, blog posts, FAQ entries, and video listings are all database-driven on the live site with no seed data available). `src/data.ts` is where all of that mock content lives — swap it for real data (or wire up an actual backend) as that becomes available.

Three pages are worth a second look before shipping, because they currently model a different concept than what the real site actually does:

- **Options / Join** (`OptionsPage.tsx`, `JoinPage.tsx`) — shows a 4-tier price table with specific dollar figures. The real site has no stored pricing anywhere; it's a category picker (Performers/Agents/Casting Professionals/Crew/etc.) with per-category info, and real prices would need to come from wherever the business actually manages pricing.
- **Locations** (`LocationsPage.tsx`) — shows a "member cities" directory. The real site's Locations page is about film-location scouting services in Kenya, a different feature entirely.
- **Contacts** (`ContactsPage.tsx`) — shows a contact-us message form. The real site's "Contacts Listing" page is a searchable directory of agents/corporates/casting professionals.

## No backend yet

This is a frontend-only project right now — there's no API, no database, and no auth. Forms (register, contact, etc.) update local component state but don't persist or send anywhere. Hooking this up to a real backend (and deciding on a stack for it) is the next piece of work.
