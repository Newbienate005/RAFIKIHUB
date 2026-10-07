import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { AdminHeader, NoDatabase, Pager, StatusPill, Tabs, fmtDate } from "@/components/admin/ui";
import { getDb } from "@/lib/db";
import { accounts, talentProfiles } from "@/lib/db/schema";
import { setAccountStatus } from "./actions";

const SIZE = 40;
const accountStatuses = ["active", "unverified", "expired", "blocked"] as const;
type Props = { searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }> };

export default async function MembersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const header = <AdminHeader title="Member accounts" description="Everyone with a RafikiHub login, imported from the old site. Performers link to their talent profile." />;
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;

  const q = (sp.q ?? "").trim();
  const role = sp.role === "performer" || sp.role === "casting" ? sp.role : undefined;
  const status = accountStatuses.includes(sp.status as never) ? sp.status : undefined;
  const conds: (SQL | undefined)[] = [
    q ? or(ilike(accounts.name, `%${q}%`), ilike(accounts.email, `%${q}%`), ilike(accounts.phone, `%${q}%`)) : undefined,
    role ? eq(accounts.role, role) : undefined,
    status ? eq(accounts.status, status) : undefined,
  ];
  const where = and(...conds.filter(Boolean));
  const page = Math.max(1, Number(sp.page) || 1);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: accounts.id, name: accounts.name, email: accounts.email, phone: accounts.phone, role: accounts.role, category: accounts.category,
        status: accounts.status, planId: accounts.planId, planExpiresAt: accounts.planExpiresAt, lastLoginAt: accounts.lastLoginAt,
        profileUrl: accounts.profileUrl, completeness: talentProfiles.completeness,
      })
      .from(accounts)
      .leftJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
      .where(where)
      .orderBy(desc(accounts.createdAt))
      .limit(SIZE)
      .offset((page - 1) * SIZE),
    db.select({ total: count() }).from(accounts).where(where),
  ]);
  const href = (o: { role?: string | null; page?: number }) => {
    const u = new URLSearchParams();
    const r = o.role === null ? undefined : o.role ?? role;
    if (q) u.set("q", q);
    if (r) u.set("role", r);
    if (status) u.set("status", status);
    if (o.page && o.page > 1) u.set("page", String(o.page));
    const qs = u.toString();
    return `/admin/members${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {header}
      <form className="admin-search" role="search">
        {role ? <input type="hidden" name="role" value={role} /> : null}
        <label htmlFor="q" className="sr-only">Search</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name, email or phone" />
        <label htmlFor="status" className="sr-only">Status</label>
        <select id="status" name="status" defaultValue={status ?? ""}>
          <option value="">Any status</option>
          {accountStatuses.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button type="submit" className="btn btn--ink btn--sm">Search</button>
      </form>
      <Tabs label="Filter by account type" current={role ?? "all"} items={[
        { key: "all", label: "Everyone", href: href({ role: null }) },
        { key: "performer", label: "Performers and crew", href: href({ role: "performer" }) },
        { key: "casting", label: "Casting and agents", href: href({ role: "casting" }) },
      ]} />
      {rows.length ? (
        <div className="table-scroll">
          <table className="compare admin-table">
            <thead><tr><th scope="col">Member</th><th scope="col">Type</th><th scope="col">Plan</th><th scope="col">Profile</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row">
                    <strong>{r.name}</strong>
                    <span className="admin-table__sub"><a href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}</span>
                  </th>
                  <td>{r.category ?? r.role}</td>
                  <td>{r.planId ? <>{r.planId}{r.planExpiresAt ? <span className="admin-table__sub">until {fmtDate(r.planExpiresAt)}</span> : null}</> : <span className="small">None</span>}</td>
                  <td>{r.profileUrl ? <Link href={`/admin/profiles/${r.profileUrl}`}>{r.completeness ?? 0}% complete</Link> : <span className="small">No profile</span>}</td>
                  <td>
                    <form action={setAccountStatus.bind(null, r.id)} className="admin-status admin-status--inline">
                      <StatusPill status={r.status} />
                      <label htmlFor={`st-${r.id}`} className="sr-only">Change status for {r.name}</label>
                      <select id={`st-${r.id}`} name="status" defaultValue={r.status}>
                        {accountStatuses.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <button type="submit" className="btn btn--ink btn--sm">Set</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card admin-empty">
          <h2>{q || role || status ? "No members match" : "No member accounts yet"}</h2>
          <p>{q || role || status ? "Try another search." : "Members come across from the old rafikihub.com when you import its database."}</p>
          <Link href="/admin/import" className="btn btn--sun">Import old database</Link>
        </div>
      )}
      <Pager page={page} total={total} size={SIZE} href={(p) => href({ page: p })} />
    </>
  );
}
