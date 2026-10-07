import Link from "next/link";
import { count, eq, like, sql } from "drizzle-orm";
import { AdminHeader, NoDatabase } from "@/components/admin/ui";
import { inboxCounts, inboxKeys, inboxTypes } from "@/lib/admin/inbox";
import { contentKindList, contentKinds } from "@/lib/content-kinds";
import { getDb } from "@/lib/db";
import { accounts, auditions, contentItems, siteSettings, talentProfiles } from "@/lib/db/schema";

export default async function AdminHome() {
  const db = getDb();
  const header = <AdminHeader title="Admin" description="Manage the website's content, the inbox, members, profiles and castings." />;
  if (!db) return <>{header}<NoDatabase /></>;

  let stats;
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
  return (
    <>
      {header}
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
