import { count, desc, eq, getTableColumns, sql, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { getDb } from "@/lib/db";
import { castingCalls, contactMessages, locationRequests, members, newsletterSubscribers, serviceBookings } from "@/lib/db/schema";

/**
 * Everything people submit through the website's forms, as one inbox in /admin.
 * Each type lists the table, the statuses the team moves an item through, and which fields to show.
 */

type Col = { key: string; label: string; format?: "date" | "email" | "phone" | "long" | "url" };

type InboxType = {
  label: string;
  singular: string;
  description: string;
  table: PgTable;
  /** null: no workflow (newsletter sign-ups) */
  statuses: readonly string[] | null;
  /** Shown as the row's heading */
  title: string;
  /** Shown in the list under the heading */
  summary: string[];
  /** Every field, in the detail view and the CSV */
  fields: Col[];
};

export const inboxTypes = {
  applications: {
    label: "Membership applications",
    singular: "application",
    description: "People who applied through the Join form.",
    table: members,
    statuses: ["new", "contacted", "approved", "declined"],
    title: "fullName",
    summary: ["category", "plan", "location"],
    fields: [
      { key: "fullName", label: "Name" }, { key: "email", label: "Email", format: "email" }, { key: "phone", label: "Phone", format: "phone" },
      { key: "category", label: "Joining as" }, { key: "plan", label: "Plan" }, { key: "location", label: "Location" },
      { key: "message", label: "About them", format: "long" }, { key: "createdAt", label: "Received", format: "date" },
    ],
  },
  castings: {
    label: "Casting requests",
    singular: "casting request",
    description: "Productions that used “Post a casting”. Turn one into a breakdown from its detail view.",
    table: castingCalls,
    statuses: ["new", "in-progress", "published", "declined"],
    title: "projectTitle",
    summary: ["company", "projectType", "shootDates"],
    fields: [
      { key: "projectTitle", label: "Project" }, { key: "projectType", label: "Type" }, { key: "company", label: "Company" },
      { key: "contactName", label: "Contact" }, { key: "email", label: "Email", format: "email" }, { key: "phone", label: "Phone", format: "phone" },
      { key: "shootDates", label: "Shoot dates" }, { key: "location", label: "Location" }, { key: "details", label: "Breakdown", format: "long" },
      { key: "createdAt", label: "Received", format: "date" },
    ],
  },
  bookings: {
    label: "Sio Bahati bookings",
    singular: "booking",
    description: "Headshot, showreel and audition-prep bookings.",
    table: serviceBookings,
    statuses: ["new", "confirmed", "done", "cancelled"],
    title: "fullName",
    summary: ["service", "preferredDate"],
    fields: [
      { key: "service", label: "Service" }, { key: "fullName", label: "Name" }, { key: "email", label: "Email", format: "email" },
      { key: "phone", label: "Phone", format: "phone" }, { key: "preferredDate", label: "Preferred date" }, { key: "notes", label: "Notes", format: "long" },
      { key: "createdAt", label: "Received", format: "date" },
    ],
  },
  locations: {
    label: "Location requests",
    singular: "location request",
    description: "Productions asking RafikiHub Locations to find a filming location.",
    table: locationRequests,
    statuses: ["new", "in-progress", "done", "declined"],
    title: "organization",
    summary: ["locationType", "fromDate", "country"],
    fields: [
      { key: "organization", label: "Organisation" }, { key: "email", label: "Email", format: "email" }, { key: "phone", label: "Phone", format: "phone" },
      { key: "country", label: "Country" }, { key: "nature", label: "Production" }, { key: "crew", label: "Crew size" },
      { key: "fromDate", label: "From" }, { key: "toDate", label: "To" }, { key: "locationType", label: "Location type" },
      { key: "services", label: "Services wanted" }, { key: "details", label: "Details", format: "long" }, { key: "createdAt", label: "Received", format: "date" },
    ],
  },
  messages: {
    label: "Contact messages",
    singular: "message",
    description: "Messages sent through the Contact page.",
    table: contactMessages,
    statuses: ["new", "replied", "closed"],
    title: "fullName",
    summary: ["topic"],
    fields: [
      { key: "fullName", label: "Name" }, { key: "email", label: "Email", format: "email" }, { key: "topic", label: "Topic" },
      { key: "message", label: "Message", format: "long" }, { key: "createdAt", label: "Received", format: "date" },
    ],
  },
  newsletter: {
    label: "Newsletter sign-ups",
    singular: "subscriber",
    description: "Email addresses that signed up for casting news.",
    table: newsletterSubscribers,
    statuses: null,
    title: "email",
    summary: [],
    fields: [{ key: "email", label: "Email", format: "email" }, { key: "createdAt", label: "Signed up", format: "date" }],
  },
} satisfies Record<string, InboxType>;

export type InboxKey = keyof typeof inboxTypes;
export const inboxKeys = Object.keys(inboxTypes) as InboxKey[];
export const isInboxKey = (k: string): k is InboxKey => k in inboxTypes;

const columns = (t: PgTable) => getTableColumns(t) as Record<string, PgColumn>;

export const PAGE_SIZE = 40;

export async function listInbox(key: InboxKey, opts: { status?: string; page?: number }) {
  const db = getDb();
  if (!db) return null;
  const cfg: InboxType = inboxTypes[key];
  const cols = columns(cfg.table);
  const where: SQL | undefined = cfg.statuses && opts.status ? eq(cols.status, opts.status) : undefined;
  const page = Math.max(1, opts.page ?? 1);
  const [rows, [{ total }]] = await Promise.all([
    db.select().from(cfg.table).where(where).orderBy(desc(cols.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(cfg.table).where(where),
  ]);
  return { rows: rows as Record<string, unknown>[], total, page };
}

export async function getInboxItem(key: InboxKey, id: number) {
  const db = getDb();
  if (!db) return null;
  const cfg: InboxType = inboxTypes[key];
  const [row] = await db.select().from(cfg.table).where(eq(columns(cfg.table).id, id)).limit(1);
  return (row as Record<string, unknown> | undefined) ?? null;
}

/** Items per status for each type, for the sidebar badges and the overview. */
export async function inboxCounts() {
  const db = getDb();
  if (!db) return null;
  const entries = await Promise.all(
    inboxKeys.map(async (key) => {
      const cfg: InboxType = inboxTypes[key];
      const cols = columns(cfg.table);
      if (!cfg.statuses) {
        const [{ n }] = await db.select({ n: count() }).from(cfg.table);
        return [key, { total: n, new: 0 }] as const;
      }
      const rows = await db.select({ status: cols.status, n: sql<number>`count(*)::int` }).from(cfg.table).groupBy(cols.status);
      const total = rows.reduce((a, r) => a + r.n, 0);
      return [key, { total, new: rows.find((r) => r.status === "new")?.n ?? 0 }] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<InboxKey, { total: number; new: number }>;
}

/** All rows as CSV, for spreadsheets. */
export async function inboxCsv(key: InboxKey) {
  const db = getDb();
  if (!db) return null;
  const cfg: InboxType = inboxTypes[key];
  const rows = (await db.select().from(cfg.table).orderBy(desc(columns(cfg.table).createdAt))) as Record<string, unknown>[];
  const head = [...cfg.fields.map((f) => f.label), ...(cfg.statuses ? ["Status"] : [])];
  const cell = (v: unknown) => {
    const s = v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
    // Quote everything, and stop spreadsheet apps treating a value as a formula
    return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const lines = rows.map((r) => [...cfg.fields.map((f) => r[f.key]), ...(cfg.statuses ? [r.status] : [])].map(cell).join(","));
  return [head.map(cell).join(","), ...lines].join("\r\n");
}

export const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
