import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { ActionButton } from "@/components/admin/AdminForm";
import { AdminHeader, NoDatabase, Notice } from "@/components/admin/ui";
import { contentKinds, isContentKind, type ContentKind, type ContentTypes } from "@/lib/content-kinds";
import { seededKey } from "@/lib/content";
import { getDb } from "@/lib/db";
import { contentItems, siteSettings } from "@/lib/db/schema";
import { moveContent, seedKindAction, setPublished } from "../actions";

type Props = { params: Promise<{ kind: string }>; searchParams: Promise<{ saved?: string; deleted?: string }> };

export default async function ContentListPage({ params, searchParams }: Props) {
  const { kind } = await params;
  if (!isContentKind(kind)) notFound();
  const sp = await searchParams;
  const cfg = contentKinds[kind];
  const db = getDb();
  const header = (
    <AdminHeader
      title={cfg.label}
      description={cfg.description}
      actions={<>
        <Link href={cfg.path} className="btn btn--ghost btn--sm" target="_blank">View on site</Link>
        <Link href={`/admin/content/${kind}/new`} className="btn btn--sun btn--sm">Add {cfg.singular}</Link>
      </>}
    />
  );
  if (!db) return <>{header}<NoDatabase /></>;

  const [seeded] = await db.select().from(siteSettings).where(eq(siteSettings.key, seededKey(kind))).limit(1);
  if (!seeded) {
    const builtIn = cfg.seed() as ContentTypes[ContentKind][];
    return (
      <>
        {header}
        <div className="admin-card">
          <h2>This section still uses the built-in content</h2>
          <p>The website is showing the {builtIn.length} {builtIn.length === 1 ? cfg.singular : `${cfg.label.toLowerCase()}`} written into the site&apos;s code. Copy them into the database to start editing here. Nothing on the website changes when you do.</p>
          <form action={seedKindAction.bind(null, kind)}>
            <button type="submit" className="btn btn--sun">Copy into the database</button>
          </form>
        </div>
      </>
    );
  }

  const rows = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.kind, kind))
    .orderBy(...(cfg.sortable ? [asc(contentItems.sortOrder), asc(contentItems.id)] : [desc(contentItems.createdAt)]));
  // Blog posts are listed newest first by their publish date
  const items = cfg.sortable ? rows : [...rows].sort((a, b) => String((b.data as { publishedAt?: string }).publishedAt).localeCompare(String((a.data as { publishedAt?: string }).publishedAt)));
  const title = cfg.title as (d: unknown) => string;
  const subtitle = cfg.subtitle as ((d: unknown) => string) | undefined;

  return (
    <>
      {header}
      {sp.saved ? <Notice>Saved. The website is updated.</Notice> : null}
      {sp.deleted ? <Notice>Deleted.</Notice> : null}
      {items.length ? (
        <ul className="admin-list">
          {items.map((r) => (
            <li key={r.id} className={r.published ? undefined : "is-hidden"}>
              <div className="admin-list__main">
                <Link href={`/admin/content/${kind}/${r.id}`} className="admin-list__title">{title(r.data) || "Untitled"}</Link>
                {subtitle ? <span className="admin-list__sub">{subtitle(r.data)}</span> : null}
              </div>
              {!r.published ? <span className="status status--closed">Hidden</span> : null}
              <div className="admin-list__tools">
                {cfg.sortable ? (
                  <>
                    <ActionButton action={moveContent.bind(null, kind, r.id, "up")} className="icon-btn" label="Move up">↑</ActionButton>
                    <ActionButton action={moveContent.bind(null, kind, r.id, "down")} className="icon-btn" label="Move down">↓</ActionButton>
                  </>
                ) : null}
                <ActionButton action={setPublished.bind(null, kind, r.id, !r.published)} className="btn btn--ghost btn--sm">{r.published ? "Hide" : "Show"}</ActionButton>
                <Link href={`/admin/content/${kind}/${r.id}`} className="btn btn--ink btn--sm">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>Nothing here yet</h2>
          <p>Add the first {cfg.singular}. Until you do, this part of the website stays empty.</p>
          <Link href={`/admin/content/${kind}/new`} className="btn btn--sun">Add {cfg.singular}</Link>
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { kind } = await params;
  return { title: isContentKind(kind) ? `${contentKinds[kind].label} | Admin` : "Admin" };
}

