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
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("talent_profiles_name_idx").on(t.fullName), index("talent_profiles_category_idx").on(t.category)],
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("accounts_email_idx").on(t.email), index("accounts_legacy_idx").on(t.legacyId)],
);

/** Castings posted by casting professionals (old `auditions`, plus its talent_categories and talent_countries lists). */
export const auditions = pgTable("auditions", {
  id: serial("id").primaryKey(),
  legacyId: integer("legacy_id"),
  ref: varchar("ref", { length: 20 }).notNull(), // old random_id, shown to members
  ownerId: integer("owner_id").notNull().references(() => accounts.id),
  title: varchar("title", { length: 200 }).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull().default("Everybody"),
  categories: jsonb("categories").$type<string[]>().notNull().default([]), // empty = all categories
  countries: jsonb("countries").$type<string[]>().notNull().default([]), // empty = all countries
  body: text("body").notNull(),
  closesOn: date("closes_on").notNull(),
  filled: boolean("filled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
