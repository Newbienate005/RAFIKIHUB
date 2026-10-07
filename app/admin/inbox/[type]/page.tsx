import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, NoDatabase, Pager, StatusPill, Tabs, fmtDate } from "@/components/admin/ui";
import { PAGE_SIZE, inboxTypes, isInboxKey, listInbox, statusLabel } from "@/lib/admin/inbox";

type Props = { params: Promise<{ type: string }>; searchParams: Promise<{ status?: string; page?: string }> };

export default async function InboxPage({ params, searchParams }: Props) {
  const { type } = await params;
  if (!isInboxKey(type)) notFound();
  const sp = await searchParams;
  const cfg = inboxTypes[type];
  const statuses = cfg.statuses as readonly string[] | null;
  const status = statuses?.includes(sp.status ?? "") ? sp.status : undefined;
  const page = Number(sp.page) || 1;
  const result = await listInbox(type, { status, page });
  const header = (
    <AdminHeader
      title={cfg.label}
      description={cfg.description}
      actions={<a href={`/admin/inbox/${type}/export`} className="btn btn--ghost btn--sm">Download CSV</a>}
    />
  );
  if (!result) return <>{header}<NoDatabase /></>;

  const q = (s?: string, p?: number) => {
    const u = new URLSearchParams();
    if (s) u.set("status", s);
    if (p && p > 1) u.set("page", String(p));
    const qs = u.toString();
    return `/admin/inbox/${type}${qs ? `?${qs}` : ""}`;
  };
  const summary = cfg.summary as string[];
  return (
    <>
      {header}
      {statuses ? (
        <Tabs label="Filter by status" current={status ?? "all"} items={[{ key: "all", label: "All", href: q() }, ...statuses.map((s) => ({ key: s, label: statusLabel(s), href: q(s) }))]} />
      ) : null}
      {result.rows.length ? (
        <ul className="admin-list admin-list--inbox">
          {result.rows.map((r) => (
            <li key={String(r.id)}>
              <div className="admin-list__main">
                {statuses ? (
                  <Link href={`/admin/inbox/${type}/${r.id}`} className="admin-list__title">{String(r[cfg.title] ?? "(no name)")}</Link>
                ) : (
                  <span className="admin-list__title">{String(r[cfg.title])}</span>
                )}
                <span className="admin-list__sub">{summary.map((k) => r[k]).filter(Boolean).map(String).join(" · ")}</span>
              </div>
              <time className="admin-list__date" dateTime={new Date(r.createdAt as string).toISOString()}>{fmtDate(r.createdAt)}</time>
              {statuses ? <StatusPill status={String(r.status)} /> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>{status ? `Nothing marked “${statusLabel(status)}”` : "Nothing here yet"}</h2>
          <p>New {cfg.singular}s from the website appear here as soon as they&apos;re sent.</p>
        </div>
      )}
      <Pager page={result.page} total={result.total} size={PAGE_SIZE} href={(p) => q(status, p)} />
    </>
  );
}
