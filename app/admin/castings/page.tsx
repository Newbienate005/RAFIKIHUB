import Link from "next/link";
import { count, desc, eq, sql } from "drizzle-orm";
import { AdminHeader, NoDatabase, StatusPill, Tabs, fmtDate } from "@/components/admin/ui";
import { breakdownStatuses } from "@/lib/admin/castings";
import { getDb } from "@/lib/db";
import { auditionApplications, auditions, castingCalls } from "@/lib/db/schema";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function CastingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const header = (
    <AdminHeader
      title="Casting breakdowns"
      description="Breakdowns go from draft to published (members see them on their dashboard) to closed."
      actions={<Link href="/admin/castings/new" className="btn btn--sun btn--sm">New breakdown</Link>}
    />
  );
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;

  const status = (breakdownStatuses as readonly string[]).includes(sp.status ?? "") ? sp.status! : "published";
  const [rows, requests, counts] = await Promise.all([
    db
      .select({
        id: auditions.id, ref: auditions.ref, title: auditions.title, type: auditions.type, company: auditions.company,
        closesOn: auditions.closesOn, status: auditions.status, filled: auditions.filled,
        applications: sql<number>`(select count(*)::int from ${auditionApplications} where ${auditionApplications.auditionId} = ${auditions.id})`,
      })
      .from(auditions)
      .where(eq(auditions.status, status))
      .orderBy(desc(auditions.updatedAt))
      .limit(100),
    db.select({ id: castingCalls.id, title: castingCalls.projectTitle, company: castingCalls.company, createdAt: castingCalls.createdAt }).from(castingCalls).where(eq(castingCalls.status, "new")).orderBy(desc(castingCalls.createdAt)).limit(5),
    db.select({ status: auditions.status, n: count() }).from(auditions).groupBy(auditions.status),
  ]);
  const n = (s: string) => counts.find((c) => c.status === s)?.n ?? 0;
  const labels: Record<string, string> = { draft: "Drafts", published: "Published", closed: "Closed" };

  return (
    <>
      {header}
      {requests.length ? (
        <div className="admin-card">
          <h2 className="admin-card__title">New casting requests</h2>
          <p className="small">Sent through “Post a casting”. Turn one into a breakdown to review and publish it.</p>
          <ul className="admin-list admin-list--compact">
            {requests.map((r) => (
              <li key={r.id}>
                <div className="admin-list__main">
                  <Link href={`/admin/inbox/castings/${r.id}`} className="admin-list__title">{r.title}</Link>
                  <span className="admin-list__sub">{r.company} · {fmtDate(r.createdAt)}</span>
                </div>
                <div className="admin-list__tools"><Link href={`/admin/castings/new?from=${r.id}`} className="btn btn--ink btn--sm">Create breakdown</Link></div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Tabs label="Filter breakdowns" current={status} items={breakdownStatuses.map((s) => ({ key: s, label: labels[s], href: `/admin/castings?status=${s}`, count: n(s) }))} />
      {rows.length ? (
        <ul className="admin-list">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="admin-list__main">
                <Link href={`/admin/castings/${r.id}`} className="admin-list__title">{r.title}</Link>
                <span className="admin-list__sub">{r.ref} · {r.type}{r.company ? ` · ${r.company}` : ""} · closes {fmtDate(r.closesOn)}</span>
              </div>
              <span className="small">{r.applications} {r.applications === 1 ? "application" : "applications"}</span>
              {r.filled ? <span className="status status--filled">Filled</span> : <StatusPill status={r.status} />}
              <div className="admin-list__tools"><Link href={`/admin/castings/${r.id}`} className="btn btn--ink btn--sm">Open</Link></div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>No {labels[status].toLowerCase()} breakdowns</h2>
          <p>{status === "published" ? "Publish a draft and it appears here, and on members' dashboards." : "Nothing in this list right now."}</p>
        </div>
      )}
    </>
  );
}
