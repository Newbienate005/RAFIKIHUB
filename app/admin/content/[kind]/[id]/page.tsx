import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { AdminForm, ConfirmButton } from "@/components/admin/AdminForm";
import { FieldInput } from "@/components/admin/Fields";
import { AdminHeader, NoDatabase } from "@/components/admin/ui";
import { contentKinds, isContentKind } from "@/lib/content-kinds";
import { getDb } from "@/lib/db";
import { contentItems } from "@/lib/db/schema";
import { deleteContent, saveContent } from "../../actions";

type Props = { params: Promise<{ kind: string; id: string }> };

export default async function ContentEditPage({ params }: Props) {
  const { kind, id } = await params;
  if (!isContentKind(kind) || (id !== "new" && !/^\d+$/.test(id))) notFound();
  const cfg = contentKinds[kind];
  const db = getDb();
  const isNew = id === "new";
  const back = { href: `/admin/content/${kind}`, label: cfg.label };
  if (!db) return <><AdminHeader title={isNew ? `New ${cfg.singular}` : `Edit ${cfg.singular}`} back={back} /><NoDatabase /></>;

  let data: Record<string, unknown> = (cfg.defaults?.() as Record<string, unknown>) ?? {};
  let published = true;
  if (!isNew) {
    const [row] = await db.select().from(contentItems).where(and(eq(contentItems.id, Number(id)), eq(contentItems.kind, kind))).limit(1);
    if (!row) notFound();
    data = row.data;
    published = row.published;
  }
  const title = isNew ? `New ${cfg.singular}` : (cfg.title as (d: unknown) => string)(data) || `Edit ${cfg.singular}`;
  const viewHref = kind === "articles" && !isNew ? `/blog/${data.url}` : cfg.path;
  const labels = Object.fromEntries(cfg.fields.map((f) => [f.name, f.label]));

  return (
    <>
      <AdminHeader
        title={title}
        back={back}
        actions={!isNew ? <Link href={viewHref} className="btn btn--ghost btn--sm" target="_blank">View on site</Link> : null}
      />
      <AdminForm action={saveContent.bind(null, kind, id)} labels={labels} submitLabel={isNew ? `Add ${cfg.singular}` : "Save changes"}>
        <div className="admin-card form">
          {cfg.fields.map((f) => <FieldInput key={f.name} field={f} value={data[f.name]} folder={kind} />)}
          <div className="field field--check">
            <label><input type="checkbox" name="_published" defaultChecked={published} /> Visible on the website</label>
          </div>
        </div>
      </AdminForm>
      {!isNew ? (
        <div className="admin-danger">
          <p>Deleting removes this {cfg.singular} from the website for good. To take it down for now, untick “Visible on the website” instead.</p>
          <ConfirmButton action={deleteContent.bind(null, kind, Number(id))} message={`Delete this ${cfg.singular}? This can't be undone.`}>Delete {cfg.singular}</ConfirmButton>
        </div>
      ) : null}
    </>
  );
}
