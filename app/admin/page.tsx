import { requireMaster } from "@/lib/session";
import Link from "next/link";
import { and, count, desc, eq, gte, like, sql } from "drizzle-orm";
import { AdminHeader, NoDatabase } from "@/components/admin/ui";
import { inboxCounts, inboxKeys, inboxTypes, listInbox } from "@/lib/admin/inbox";
import { emailConfigured } from "@/lib/email";
import { setInboxStatus } from "./inbox/actions";
import { setAccountStatus } from "./members/actions";
import { setProfileFlag } from "./profiles/actions";
import { contentKindList, contentKinds } from "@/lib/content-kinds";
import { getDb } from "@/lib/db";
import { accounts, auditions, contentItems, siteSettings, talentProfiles } from "@/lib/db/schema";

export default async function AdminHome() {
  await requireMaster(); // the layout checks too, but a request can skip the layout
  const db = getDb();
  const header = <AdminHeader title="Admin" description="Manage the website's content, the inbox, members, profiles and castings." />;
  if (!db) return <>{header}<NoDatabase /></>;

  let stats;
  let queue: { key: string; kind: string; title: string; when: Date; href: string; act: { label: string; action: (form: FormData) => Promise<void>; status: string } }[] = [];
  let importedAt: Date | null = null;
  try {
    const [inbox, [profiles], [members], [open], content, seeded] = await Promise.all([
      inboxCounts(),
      db.select({ total: count(), published: sql<number>`count(*) filter (where ${talentProfiles.published})::int`, complete: sql<number>`count(*) filter (where ${talentProfiles.completeness} >= 100)::int` }).from(talentProfiles),
      db.select({ total: count() }).from(accounts),
      db.select({ total: count() }).from(auditions).where(eq(auditions.status, "published")),
      db.select({ kind: contentItems.kind, n: count() }).from(contentItems).groupBy(contentItems.kind),
      db.select({ key: siteSettings.key }).from(siteSettings).where(like(siteSettings.key, "seeded:%")),
    ]);
    stats = { inbox, profiles, members: members.total, open: open.total, content, seeded: new Set(seeded.map((s) => s.key)) };
    // What needs a decision today: new form submissions, members to verify, profiles ready to go public
    const [inboxNew, unverified, ready, [lastImport]] = await Promise.all([
      Promise.all(inboxKeys.filter((k) => inboxTypes[k].statuses && k !== "applications").map(async (k) => ({ k, rows: (await listInbox(k, { status: "new" }))?.rows.slice(0, 4) ?? [] }))),
      db.select({ id: accounts.id, name: accounts.name, category: accounts.category, createdAt: accounts.createdAt }).from(accounts).where(eq(accounts.status, "unverified")).orderBy(desc(accounts.createdAt)).limit(5),
      db.select({ url: talentProfiles.profileUrl, name: talentProfiles.fullName, completeness: talentProfiles.completeness, updatedAt: talentProfiles.updatedAt }).from(talentProfiles).where(and(eq(talentProfiles.published, false), gte(talentProfiles.completeness, 75))).orderBy(desc(talentProfiles.updatedAt)).limit(5),
      db.select({ updatedAt: siteSettings.updatedAt }).from(siteSettings).where(eq(siteSettings.key, "import:last")).limit(1),
    ]);
    queue = [
      ...inboxNew.flatMap(({ k, rows }) => rows.map((r) => ({
        key: `${k}-${r.id}`, kind: inboxTypes[k].singular, title: String(r[inboxTypes[k].title] ?? inboxTypes[k].label), when: r.createdAt as Date,
        href: `/admin/inbox/${k}/${r.id}`, act: { label: "Mark done", action: setInboxStatus.bind(null, k, Number(r.id)), status: inboxTypes[k].statuses![1] },
      }))),
      ...unverified.map((a) => ({ key: `m-${a.id}`, kind: "new member", title: `${a.name} joined${a.category ? ` as ${a.category}` : ""}`, when: a.createdAt, href: `/admin/members?status=unverified`, act: { label: "Verify", action: setAccountStatus.bind(null, a.id), status: "active" } })),
      ...ready.map((p) => ({ key: `p-${p.url}`, kind: "profile", title: `${p.name}'s profile is ${p.completeness}% complete`, when: p.updatedAt, href: `/admin/profiles/${p.url}`, act: { label: "Publish", action: setProfileFlag.bind(null, p.url, "published", true), status: "" } })),
    ].sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
    importedAt = lastImport?.updatedAt ?? null;
  } catch (e) {
    // Usually: the tables haven't been created yet
    console.error("[admin] overview failed", e);
    return (
      <>
        {header}
        <div className="admin-card admin-setup">
          <h2>The database is connected, but its tables aren&apos;t set up</h2>
          <p>Run <code>npm run db:push</code> once (with <code>DATABASE_URL</code> set) to create or update the tables, then reload this page.</p>
        </div>
      </>
    );
  }

  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const newTotal = inboxKeys.reduce((a, k) => a + (stats.inbox?.[k].new ?? 0), 0);
  const health = [
    { label: "Emails (Elastic Email)", ok: emailConfigured(), on: "Set up", off: "Not set up" },
    { label: "Database", ok: true, on: "Connected", off: "" },
    { label: "Photo uploads", ok: blob, on: "On", off: "Off" },
    { label: "M-Pesa payments", ok: Boolean(process.env.PESAWISE_API_KEY), on: "Set up", off: "Not set up yet" },
  ];
  return (
    <>
      {header}
      <section className="admin-today" aria-labelledby="today">
        <h2 id="today">{queue.length ? <>{queue.length} {queue.length === 1 ? "thing needs" : "things need"} <em>you</em></> : <>All clear <em>today</em></>}</h2>
        {queue.length ? (
          <ul className="admin-queue">
            {queue.slice(0, 12).map((q) => (
              <li key={q.key}>
                <div className="admin-queue__main">
                  <Link href={q.href} className="admin-queue__title">{q.title}</Link>
                  <span className="small">{new Date(q.when).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</span>
                </div>
                <span className="admin-queue__kind">{q.kind}</span>
                <form action={q.act.action}>
                  {q.act.status ? <input type="hidden" name="status" value={q.act.status} /> : null}
                  <button type="submit" className="admin-queue__act">{q.act.label}</button>
                </form>
              </li>
            ))}
          </ul>
        ) : <p className="small">No new form submissions, members to verify or profiles waiting. Nice work.</p>}
      </section>
      <ul className="stat-grid">
        <li className="stat"><span className="stat__label">New in the inbox</span><span className="stat__value">{newTotal}</span><span className="stat__note">Across every form on the site</span></li>
        <li className="stat"><span className="stat__label">Published profiles</span><span className="stat__value">{stats.profiles.published}</span><span className="stat__note">{stats.profiles.complete} are 100% complete · {stats.profiles.total} in all</span></li>
        <li className="stat"><span className="stat__label">Open castings</span><span className="stat__value">{stats.open}</span><span className="stat__note">{stats.members} member accounts</span></li>
      </ul>

      {!blob ? (
        <p className="admin-info">Image uploads aren&apos;t switched on yet. Add <code>BLOB_READ_WRITE_TOKEN</code> (Vercel → Storage → Blob) to upload photos; until then, paste image links.</p>
      ) : null}
      {stats.members === 0 ? (
        <p className="admin-info">No members yet. <Link href="/admin/import">Import the old rafikihub.com database</Link> to bring them across.</p>
      ) : null}

      <section className="admin-card admin-health" aria-labelledby="health">
        <h2 id="health" className="admin-card__title">Site health</h2>
        <ul>
          {health.map((h) => <li key={h.label}><span>{h.label}</span><span className={h.ok ? "is-ok" : "is-off"}>● {h.ok ? h.on : h.off}</span></li>)}
          <li><span>Last old-site import</span><span>{importedAt ? new Date(importedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "Never"}</span></li>
        </ul>
      </section>

      <div className="admin-grid admin-grid--2">
        <section className="admin-card">
          <h2 className="admin-card__title">Inbox</h2>
          <ul className="admin-list admin-list--compact">
            {inboxKeys.map((k) => (
              <li key={k}>
                <div className="admin-list__main"><Link href={`/admin/inbox/${k}`} className="admin-list__title">{inboxTypes[k].label}</Link></div>
                {stats.inbox?.[k].new ? <span className="admin-nav__badge">{stats.inbox[k].new} new</span> : null}
                <span className="small">{stats.inbox?.[k].total ?? 0}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="admin-card">
          <h2 className="admin-card__title">Website content</h2>
          <ul className="admin-list admin-list--compact">
            {contentKindList.map((k) => {
              const n = stats.content.find((c) => c.kind === k)?.n ?? 0;
              const live = stats.seeded.has(`seeded:${k}`);
              return (
                <li key={k}>
                  <div className="admin-list__main"><Link href={`/admin/content/${k}`} className="admin-list__title">{contentKinds[k].label}</Link></div>
                  <span className="small">{live ? `${n} in the database` : "Built-in content"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
