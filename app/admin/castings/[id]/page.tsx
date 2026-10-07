import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ActionButton, AdminForm } from "@/components/admin/AdminForm";
import { AdminHeader, NoDatabase, Notice, StatusPill, fmtDate } from "@/components/admin/ui";
import { applicationStatuses, breakdownGenders, breakdownTypes } from "@/lib/admin/castings";
import { statusLabel } from "@/lib/admin/inbox";
import { profileCategories } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, auditionApplications, auditions, castingCalls, talentProfiles } from "@/lib/db/schema";
import { saveBreakdown, setApplicationStatus, setBreakdownStatus } from "../actions";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string; saved?: string }> };

const labels: Record<string, string> = { title: "Title", type: "Type", gender: "Who it's for", body: "Breakdown", closesOn: "Closing date", contactEmail: "Contact email" };

export default async function BreakdownPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === "new";
  if (!isNew && !/^\d+$/.test(id)) notFound();
  const back = { href: "/admin/castings", label: "Casting breakdowns" };
  const db = getDb();
  if (!db) return <><AdminHeader title="Breakdown" back={back} /><NoDatabase /></>;

  type Values = Partial<typeof auditions.$inferSelect>;
  let b: Values = { gender: "Everybody", categories: [], countries: [], status: "draft" };
  let castingCallId: number | null = null;
  if (isNew && sp.from && /^\d+$/.test(sp.from)) {
    // Start from a "Post a casting" request
    const [r] = await db.select().from(castingCalls).where(eq(castingCalls.id, Number(sp.from))).limit(1);
    if (r) {
      castingCallId = r.id;
      const type = breakdownTypes.find((t) => t.toLowerCase() === r.projectType.toLowerCase()) ?? "Other";
      b = { ...b, title: r.projectTitle, type, company: r.company, contactName: r.contactName, contactEmail: r.email, location: r.location, shootDates: r.shootDates, body: r.details };
    }
  } else if (!isNew) {
    const [row] = await db.select().from(auditions).where(eq(auditions.id, Number(id))).limit(1);
    if (!row) notFound();
    b = row;
  }

  const apps = isNew
    ? []
    : await db
        .select({ id: auditionApplications.id, status: auditionApplications.status, note: auditionApplications.note, createdAt: auditionApplications.createdAt, name: accounts.name, email: accounts.email, profileUrl: accounts.profileUrl, completeness: talentProfiles.completeness })
        .from(auditionApplications)
        .innerJoin(accounts, eq(accounts.id, auditionApplications.applicantId))
        .leftJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
        .where(eq(auditionApplications.auditionId, Number(id)))
        .orderBy(desc(auditionApplications.createdAt));

  const nid = Number(id);
  const statusActions = !isNew ? (
    <>
      {b.status === "draft" ? <ActionButton action={setBreakdownStatus.bind(null, nid, "published")} className="btn btn--sun btn--sm">Approve and publish</ActionButton> : null}
      {b.status === "published" ? <ActionButton action={setBreakdownStatus.bind(null, nid, "closed")} className="btn btn--ink btn--sm">Close</ActionButton> : null}
      {b.status === "published" ? <ActionButton action={setBreakdownStatus.bind(null, nid, "draft")} className="btn btn--ghost btn--sm">Unpublish</ActionButton> : null}
      {b.status === "closed" ? <ActionButton action={setBreakdownStatus.bind(null, nid, "published")} className="btn btn--ghost btn--sm">Reopen</ActionButton> : null}
    </>
  ) : null;

  return (
    <>
      <AdminHeader title={isNew ? "New breakdown" : b.title} back={back} description={!isNew ? <>{b.ref} · <StatusPill status={b.status ?? "draft"} />{b.publishedAt ? ` · published ${fmtDate(b.publishedAt)}` : ""}</> : castingCallId ? "Filled in from the casting request. Check it, then save it as a draft." : undefined} actions={statusActions} />
      {sp.saved ? <Notice>Saved.{b.status === "draft" ? " It's a draft: members can't see it until you publish it." : ""}</Notice> : null}

      <AdminForm action={saveBreakdown.bind(null, id)} labels={labels} submitLabel={isNew ? "Save as draft" : "Save changes"}>
        {castingCallId ? <input type="hidden" name="castingCallId" value={castingCallId} /> : null}
        <section className="admin-card form" aria-labelledby="b-roles">
          <h2 id="b-roles" className="admin-card__title">The casting</h2>
          <div className="field"><label htmlFor="title">Title</label><input id="title" name="title" defaultValue={b.title ?? ""} placeholder="e.g. Lead roles for a feature film shooting in Nairobi" /></div>
          <div className="field field--half"><label htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue={b.type ?? ""}><option value="">Choose one</option>{breakdownTypes.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="field field--half"><label htmlFor="closesOn">Closing date</label><input id="closesOn" name="closesOn" type="date" defaultValue={b.closesOn ?? ""} /></div>
          <div className="field"><label htmlFor="body">Breakdown</label>
            <textarea id="body" name="body" rows={12} defaultValue={b.body ?? ""} />
            <p className="hint">Each role, with age range, look, skills and pay, plus how to apply. Leave out anything confidential.</p></div>
          <div className="field field--check"><label><input type="checkbox" name="filled" defaultChecked={Boolean(b.filled)} /> All roles are filled</label></div>
        </section>

        <section className="admin-card form" aria-labelledby="b-who">
          <h2 id="b-who" className="admin-card__title">Who sees it</h2>
          <div className="field field--half"><label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" defaultValue={b.gender ?? "Everybody"}>{breakdownGenders.map((g) => <option key={g}>{g}</option>)}</select></div>
          <fieldset className="field checks">
            <legend>Categories <span className="optional">(none ticked = everyone)</span></legend>
            {profileCategories.map((c) => (
              <label key={c}><input type="checkbox" name="categories" value={c} defaultChecked={(b.categories ?? []).includes(c)} /> {c}</label>
            ))}
          </fieldset>
          <div className="field"><label htmlFor="countries">Countries <span className="optional">(optional)</span></label>
            <textarea id="countries" name="countries" rows={2} defaultValue={(b.countries ?? []).join("\n")} />
            <p className="hint">One per line. Leave empty to show it to members in every country.</p></div>
        </section>

        <section className="admin-card form" aria-labelledby="b-prod">
          <h2 id="b-prod" className="admin-card__title">Production details</h2>
          <p className="hint">For the RafikiHub team. Members only see the company if you write it into the breakdown.</p>
          <div className="field field--half"><label htmlFor="company">Company</label><input id="company" name="company" defaultValue={b.company ?? ""} /></div>
          <div className="field field--half"><label htmlFor="contactName">Contact name</label><input id="contactName" name="contactName" defaultValue={b.contactName ?? ""} /></div>
          <div className="field field--half"><label htmlFor="contactEmail">Contact email</label><input id="contactEmail" name="contactEmail" type="email" defaultValue={b.contactEmail ?? ""} /></div>
          <div className="field field--half"><label htmlFor="location">Location</label><input id="location" name="location" defaultValue={b.location ?? ""} /></div>
          <div className="field field--half"><label htmlFor="shootDates">Shoot dates</label><input id="shootDates" name="shootDates" defaultValue={b.shootDates ?? ""} /></div>
        </section>
      </AdminForm>

      {!isNew ? (
        <section className="admin-card" aria-labelledby="b-apps">
          <h2 id="b-apps" className="admin-card__title">Applications ({apps.length})</h2>
          {apps.length ? (
            <ul className="admin-list admin-list--compact">
              {apps.map((a) => (
                <li key={a.id}>
                  <div className="admin-list__main">
                    {a.profileUrl ? <Link href={`/profile/${a.profileUrl}`} target="_blank" className="admin-list__title">{a.name}</Link> : <span className="admin-list__title">{a.name}</span>}
                    <span className="admin-list__sub">{a.email} · {fmtDate(a.createdAt)}{a.completeness !== null ? ` · profile ${a.completeness}% complete` : ""}</span>
                  </div>
                  <form action={setApplicationStatus.bind(null, a.id)} className="admin-status admin-status--inline">
                    <label htmlFor={`app-${a.id}`} className="sr-only">Status for {a.name}</label>
                    <select id={`app-${a.id}`} name="status" defaultValue={a.status}>{applicationStatuses.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select>
                    <button type="submit" className="btn btn--ink btn--sm">Set</button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small">No applications yet. Members will apply from their dashboard once member logins are switched on; applications from the old site appear here after the import.</p>
          )}
        </section>
      ) : null}
    </>
  );
}
