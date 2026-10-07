import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, NoDatabase, StatusPill, fmtDate } from "@/components/admin/ui";
import { getInboxItem, inboxTypes, isInboxKey, statusLabel } from "@/lib/admin/inbox";
import { setInboxStatus } from "../../actions";

type Props = { params: Promise<{ type: string; id: string }> };

export default async function InboxItemPage({ params }: Props) {
  const { type, id } = await params;
  if (!isInboxKey(type) || !/^\d+$/.test(id)) notFound();
  const cfg = inboxTypes[type];
  const statuses = cfg.statuses as readonly string[] | null;
  if (!statuses) notFound();
  const back = { href: `/admin/inbox/${type}`, label: cfg.label };
  const row = await getInboxItem(type, Number(id));
  if (row === null && !process.env.DATABASE_URL) return <><AdminHeader title={cfg.singular} back={back} /><NoDatabase /></>;
  if (!row) notFound();

  const value = (key: string, format?: string) => {
    const v = row[key];
    if (v === null || v === undefined || v === "") return <span className="small">Not given</span>;
    if (format === "date") return fmtDate(v);
    if (format === "email") return <a href={`mailto:${v}`}>{String(v)}</a>;
    if (format === "phone") return <a href={`tel:${String(v).replace(/[^\d+]/g, "")}`}>{String(v)}</a>;
    if (format === "long") return <p className="admin-long">{String(v)}</p>;
    return String(v);
  };
  const email = typeof row.email === "string" ? row.email : null;

  return (
    <>
      <AdminHeader
        title={String(row[cfg.title] ?? cfg.singular)}
        back={back}
        actions={<>
          {email ? <a className="btn btn--ink btn--sm" href={`mailto:${email}`}>Reply by email</a> : null}
          {type === "castings" ? <Link className="btn btn--sun btn--sm" href={`/admin/castings/new?from=${id}`}>Create breakdown</Link> : null}
        </>}
      />
      <div className="admin-grid">
        <div className="admin-card">
          <dl className="facts">
            {(cfg.fields as { key: string; label: string; format?: string }[]).map((f) => (
              <div key={f.key} className="facts__row"><dt>{f.label}</dt><dd>{value(f.key, f.format)}</dd></div>
            ))}
          </dl>
        </div>
        <aside className="admin-card">
          <h2 className="admin-card__title">Status</h2>
          <p><StatusPill status={String(row.status)} /></p>
          <form action={setInboxStatus.bind(null, type, Number(id))} className="admin-status">
            <label htmlFor="status" className="sr-only">Change status</label>
            <select id="status" name="status" defaultValue={String(row.status)}>
              {statuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
            <button type="submit" className="btn btn--ink btn--sm">Update</button>
          </form>
        </aside>
      </div>
    </>
  );
}
