import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
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
