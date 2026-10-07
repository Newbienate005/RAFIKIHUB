import Link from "next/link";
import { and, count, desc, eq, gte, ilike, or, type SQL } from "drizzle-orm";
import { ActionButton } from "@/components/admin/AdminForm";
import { AdminHeader, NoDatabase, Notice, Pager, Tabs } from "@/components/admin/ui";
import { profileCategories } from "@/lib/data";
import { getDb } from "@/lib/db";
import { talentProfiles } from "@/lib/db/schema";
import { setProfileFlag } from "./actions";

const SIZE = 30;
type Props = { searchParams: Promise<{ q?: string; show?: string; category?: string; page?: string; deleted?: string }> };

const filters = {
  all: { label: "All", where: undefined },
  published: { label: "Published", where: eq(talentProfiles.published, true) },
  hidden: { label: "Not published", where: eq(talentProfiles.published, false) },
  complete: { label: "100% complete", where: gte(talentProfiles.completeness, 100) },
  represented: { label: "Represented", where: eq(talentProfiles.represented, true) },
} as const;

export default async function ProfilesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const header = (
    <AdminHeader
      title="Talent profiles"
      description="Public profiles at rafikihub.com/profile/name. Completeness shows how much of a profile is filled in."
      actions={<Link href="/admin/profiles/new" className="btn btn--sun btn--sm">Add profile</Link>}
    />
  );
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;

  const show = (sp.show && sp.show in filters ? sp.show : "all") as keyof typeof filters;
  const q = (sp.q ?? "").trim();
  const category = profileCategories.includes(sp.category as never) ? sp.category : undefined;
  const conds: (SQL | undefined)[] = [
    filters[show].where,
    q ? or(ilike(talentProfiles.fullName, `%${q}%`), ilike(talentProfiles.profileUrl, `%${q}%`)) : undefined,
    category ? eq(talentProfiles.category, category) : undefined,
  ];
  const where = and(...conds.filter(Boolean));
  const page = Math.max(1, Number(sp.page) || 1);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({ url: talentProfiles.profileUrl, name: talentProfiles.fullName, category: talentProfiles.category, published: talentProfiles.published, represented: talentProfiles.represented, completeness: talentProfiles.completeness, source: talentProfiles.source, updatedAt: talentProfiles.updatedAt })
      .from(talentProfiles)
      .where(where)
      .orderBy(desc(talentProfiles.updatedAt))
      .limit(SIZE)
      .offset((page - 1) * SIZE),
    db.select({ total: count() }).from(talentProfiles).where(where),
  ]);
  const href = (o: { show?: string; page?: number }) => {
    const u = new URLSearchParams();
    const s = o.show ?? show;
    if (s !== "all") u.set("show", s);
    if (q) u.set("q", q);
    if (category) u.set("category", category);
    if (o.page && o.page > 1) u.set("page", String(o.page));
    const qs = u.toString();
    return `/admin/profiles${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      {header}
      {sp.deleted ? <Notice>Profile deleted.</Notice> : null}
      <form className="admin-search" role="search">
        {show !== "all" ? <input type="hidden" name="show" value={show} /> : null}
        <label htmlFor="q" className="sr-only">Search by name</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search by name or link" />
        <label htmlFor="category" className="sr-only">Category</label>
        <select id="category" name="category" defaultValue={category ?? ""}>
          <option value="">All categories</option>
          {profileCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="btn btn--ink btn--sm">Search</button>
      </form>
      <Tabs label="Filter profiles" current={show} items={Object.entries(filters).map(([k, f]) => ({ key: k, label: f.label, href: href({ show: k }) }))} />
      {rows.length ? (
        <ul className="admin-list">
          {rows.map((r) => (
            <li key={r.url} className={r.published ? undefined : "is-hidden"}>
              <div className="admin-list__main">
                <Link href={`/admin/profiles/${r.url}`} className="admin-list__title">{r.name}</Link>
                <span className="admin-list__sub">{r.category} · /profile/{r.url}{r.source === "legacy" ? " · from old site" : ""}</span>
              </div>
              <span className="complete" title={`${r.completeness}% complete`}>
                <span className="meter"><span style={{ width: `${r.completeness}%` }} /></span>
                <span className="small">{r.completeness}%</span>
              </span>
              {r.represented ? <span className="status status--shortlisted">Represented</span> : null}
              <div className="admin-list__tools">
                <ActionButton action={setProfileFlag.bind(null, r.url, "published", !r.published)} className="btn btn--ghost btn--sm">{r.published ? "Unpublish" : "Publish"}</ActionButton>
                <Link href={`/admin/profiles/${r.url}`} className="btn btn--ink btn--sm">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>{q || show !== "all" || category ? "No profiles match" : "No profiles yet"}</h2>
          <p>{q || show !== "all" || category ? "Try another search or filter." : "Import the old site's members, or add a profile by hand."}</p>
          <div className="btn-row">
            <Link href="/admin/import" className="btn btn--ink">Import old database</Link>
            <Link href="/admin/profiles/new" className="btn btn--sun">Add profile</Link>
          </div>
        </div>
      )}
      <Pager page={page} total={total} size={SIZE} href={(p) => href({ page: p })} />
    </>
  );
}
