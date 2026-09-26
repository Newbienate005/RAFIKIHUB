import { boolean, index, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
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
