import { boolean, date, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import type { TalentProfile } from "../data";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  plan: varchar("plan", { length: 20 }),
  location: varchar("location", { length: 120 }),
  message: text("message"),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const castingCalls = pgTable("casting_calls", {
  id: serial("id").primaryKey(),
  company: varchar("company", { length: 200 }).notNull(),
  contactName: varchar("contact_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  projectTitle: varchar("project_title", { length: 200 }).notNull(),
  projectType: varchar("project_type", { length: 80 }).notNull(),
  shootDates: varchar("shoot_dates", { length: 120 }),
  location: varchar("location", { length: 120 }),
  details: text("details").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  topic: varchar("topic", { length: 80 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Sio Bahati Services bookings (headshots, showreels, audition preps) */
export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  legacyId: integer("legacy_id").unique(), // old services.id, set by the importer
  service: varchar("service", { length: 40 }).notNull(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  preferredDate: varchar("preferred_date", { length: 60 }),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Location scouting requests from productions filming in Kenya (/locations) */
export const locationRequests = pgTable("location_requests", {
  id: serial("id").primaryKey(),
  legacyId: integer("legacy_id").unique(), // old locations.id, set by the importer
  organization: varchar("organization", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  country: varchar("country", { length: 80 }),
  phone: varchar("phone", { length: 40 }),
  nature: varchar("nature", { length: 200 }).notNull(),
  crew: varchar("crew", { length: 40 }),
  fromDate: varchar("from_date", { length: 40 }),
  toDate: varchar("to_date", { length: 40 }),
  locationType: varchar("location_type", { length: 80 }).notNull(),
  services: varchar("services", { length: 300 }),
  details: text("details"),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Public talent profiles at /profile/<profile_url>.
 * `data` holds the full TalentProfile (same shape as the old site's profile pages),
 * so importing an export from the old site is one row per member.
 */
export const talentProfiles = pgTable(
  "talent_profiles",
  {
    profileUrl: varchar("profile_url", { length: 120 }).primaryKey(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    category: varchar("category", { length: 60 }).notNull(),
    published: boolean("published").notNull().default(false),
    represented: boolean("represented").notNull().default(false),
    data: jsonb("data").$type<TalentProfile>().notNull(),
    // "legacy" rows came from the old-site import and may be refreshed by re-running it; "admin" rows were edited here
    source: varchar("source", { length: 20 }).notNull().default("admin"),
    completeness: integer("completeness").notNull().default(0), // 0–100, see lib/profile-completeness.ts
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("talent_profiles_name_idx").on(t.fullName), index("talent_profiles_category_idx").on(t.category), index("talent_profiles_complete_idx").on(t.completeness)],
);

/* ─────────────────────────────────────────────────────────────────────────────
 * Tables for real member accounts, ported from the old rafikihub.com MySQL database.
 * Not used by the site yet: they're the target for the migration in docs/MIGRATION.md
 * and for the dashboards once members can save their own data.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Login accounts (the old `users` table's account columns). One per person. */
export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    legacyId: integer("legacy_id"), // old users.id, so imported links can be remapped
    email: varchar("email", { length: 200 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    // "performer" | "casting" dashboards; old roles_id 3/4/5 → performer, 2 → casting
    role: varchar("role", { length: 20 }).notNull(),
    category: varchar("category", { length: 80 }), // old membership_category, e.g. Actress, Agent
    passwordHash: varchar("password_hash", { length: 200 }),
    // "md5" for imported accounts (the old site used unsalted MD5): re-hash with a modern algorithm at first login
    hashAlgo: varchar("hash_algo", { length: 20 }),
    status: varchar("status", { length: 20 }).notNull().default("unverified"), // active, unverified, blocked, expired
    isAdmin: boolean("is_admin").notNull().default(false),
    phone: varchar("phone", { length: 40 }),
    country: varchar("country", { length: 80 }),
    profileUrl: varchar("profile_url", { length: 120 }), // → talent_profiles.profile_url for performers
    planId: varchar("plan_id", { length: 20 }),
    planExpiresAt: timestamp("plan_expires_at", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    // Wrong-password lockout: after 8 failures in a row the account is locked for 15 minutes
    failedLogins: integer("failed_logins").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("accounts_email_idx").on(t.email), uniqueIndex("accounts_legacy_idx").on(t.legacyId)],
);

/** Castings posted by casting professionals (old `auditions`, plus its talent_categories and talent_countries lists). */
export const auditions = pgTable("auditions", {
  id: serial("id").primaryKey(),
  legacyId: integer("legacy_id").unique(),
  ref: varchar("ref", { length: 20 }).notNull(), // old random_id, shown to members
  // The casting professional's account. Empty for breakdowns the RafikiHub team posts for a client.
  ownerId: integer("owner_id").references(() => accounts.id),
  castingCallId: integer("casting_call_id").references(() => castingCalls.id), // the "Post a casting" request it came from
  company: varchar("company", { length: 200 }),
  contactName: varchar("contact_name", { length: 160 }),
  contactEmail: varchar("contact_email", { length: 200 }),
  location: varchar("location", { length: 120 }),
  shootDates: varchar("shoot_dates", { length: 120 }),
  // draft → published (members can see it) → closed
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  title: varchar("title", { length: 200 }).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull().default("Everybody"),
  categories: jsonb("categories").$type<string[]>().notNull().default([]), // empty = all categories
  countries: jsonb("countries").$type<string[]>().notNull().default([]), // empty = all countries
  body: text("body").notNull(),
  closesOn: date("closes_on").notNull(),
  filled: boolean("filled").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Applications to castings (old `auditions_applications`), with the shortlist status the old site lacked. */
export const auditionApplications = pgTable(
  "audition_applications",
  {
    id: serial("id").primaryKey(),
    auditionId: integer("audition_id").notNull().references(() => auditions.id, { onDelete: "cascade" }),
    applicantId: integer("applicant_id").notNull().references(() => accounts.id),
    submittedByAgentId: integer("submitted_by_agent_id").references(() => accounts.id),
    status: varchar("status", { length: 30 }).notNull().default("new"), // new, shortlisted, audition-booked, declined, withdrawn
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("applications_once_idx").on(t.auditionId, t.applicantId)],
);

/** Performer ↔ agent links (old `agents`): the performer requests, the agent approves. */
export const agentClients = pgTable(
  "agent_clients",
  {
    id: serial("id").primaryKey(),
    agentId: integer("agent_id").notNull().references(() => accounts.id),
    performerId: integer("performer_id").notNull().references(() => accounts.id),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("agent_clients_pair_idx").on(t.agentId, t.performerId)],
);

/** M-Pesa payments (old `billing` and `payment_history`). */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  legacyKey: varchar("legacy_key", { length: 60 }).unique(), // "billing:<id>" or "history:<id>", set by the importer
  accountId: integer("account_id").notNull().references(() => accounts.id),
  planId: varchar("plan_id", { length: 20 }),
  amountKsh: integer("amount_ksh").notNull(),
  phone: varchar("phone", { length: 20 }),
  provider: varchar("provider", { length: 30 }).notNull().default("mpesa"),
  reference: varchar("reference", { length: 80 }),
  status: varchar("status", { length: 20 }).notNull(), // success, rejected, pending
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ─────────────────────────────────────────────────────────────────────────────
 * Admin CMS
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Website content edited in /admin: blog posts, videos, team, partners, testimonials, FAQs, contact listings.
 * `data` has the same shape as the matching type in lib/data.ts (Article, Video, TeamMember…), so pages
 * render database rows and the built-in content the same way. `slug` is only used by blog posts.
 */
export const contentItems = pgTable(
  "content_items",
  {
    id: serial("id").primaryKey(),
    kind: varchar("kind", { length: 40 }).notNull(),
    slug: varchar("slug", { length: 200 }),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("content_kind_idx").on(t.kind, t.sortOrder), uniqueIndex("content_kind_slug_idx").on(t.kind, t.slug)],
);

/** Small key/value settings, e.g. "seeded:faqs" once a section's built-in content is copied in, or the last import report. */
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One-time password reset links. Only the SHA-256 of the token is stored; links expire after an hour. */
export const passwordResets = pgTable(
  "password_resets",
  {
    id: serial("id").primaryKey(),
    accountId: integer("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("password_resets_account_idx").on(t.accountId, t.createdAt)],
);
