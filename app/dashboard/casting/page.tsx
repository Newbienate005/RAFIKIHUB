import Link from "next/link";
import { DashboardShell, SampleTag } from "@/components/DashboardShell";
import { Photo } from "@/components/Photo";
import { memberTypes } from "@/lib/data";
import { sampleSubmissions } from "@/lib/dashboard";
import { requireDashboard } from "@/lib/session";
import { site } from "@/lib/site";

type Props = { searchParams: Promise<{ welcome?: string }> };

export default async function CastingDashboard({ searchParams }: Props) {
  const session = await requireDashboard("casting");
  const { welcome } = await searchParams;
  const member = session.kind === "member" ? session : null;
  const shortlisted = sampleSubmissions.filter((s) => s.status !== "New").length;

  return (
    <DashboardShell session={session} role="casting" welcome={welcome === "1"}>
      <section className="section">
        <div className="wrap dash">
          <ul className="stat-grid">
            <li className="stat">
              <span className="stat__label">Breakdowns</span>
              <span className="stat__value">{member?.project ? 1 : 0}</span>
              <span className="stat__note">{member?.project ? "Being reviewed by RafikiHub" : <Link href="/casting">Post your first</Link>}</span>
            </li>
            <li className="stat">
              <span className="stat__label">Submissions <SampleTag /></span>
              <span className="stat__value">{sampleSubmissions.length}</span>
              <span className="stat__note">From agents and performers</span>
            </li>
            <li className="stat">
              <span className="stat__label">Shortlisted <SampleTag /></span>
              <span className="stat__value">{shortlisted}</span>
              <span className="stat__note">Ready to invite to audition</span>
            </li>
          </ul>

          <div className="dash-grid">
            <section className="panel" aria-labelledby="breakdowns">
              <h2 id="breakdowns">Your breakdowns</h2>
              {member?.project ? (
                <ul className="plain">
                  <li>
                    <strong>{member.project}</strong><br />
                    <span className="small">{member.company}{member.location ? ` · ${member.location}` : ""} · We'll confirm the details with you before it goes out</span>
                  </li>
                </ul>
              ) : (
                <p className="small">{member ? "You haven't posted a breakdown yet." : "Master preview: breakdowns posted through /casting appear here for the casting professional who sent them."}</p>
              )}
              <Link href="/casting" className="btn btn--sun btn--sm" style={{ marginTop: "1.25rem" }}>Post a new breakdown</Link>
            </section>

            <section className="panel" aria-labelledby="account">
              <h2 id="account">Your details {member ? null : <SampleTag />}</h2>
              <dl className="facts">
                <dt>Name</dt><dd>{member?.name ?? "Sample Casting Director"}</dd>
                <dt>Email</dt><dd>{member?.email ?? "casting@example.com"}</dd>
                <dt>Company</dt><dd>{member?.company ?? member?.category ?? "Sample Productions"}</dd>
              </dl>
              <p className="small" style={{ marginTop: "1rem" }}>Questions about a casting? Call {site.phoneDisplay}.</p>
            </section>
          </div>

          <section aria-labelledby="subs">
            <h2 id="subs">Latest submissions <SampleTag /></h2>
            <p className="small">Submissions for your roles arrive here, from agents and from performers themselves.</p>
            <div className="table-scroll">
              <table className="credits subs">
                <thead><tr><th scope="col">Performer</th><th scope="col">Playing age</th><th scope="col">Submitted</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  {sampleSubmissions.map((s) => (
                    <tr key={s.name}>
                      <td>
                        <span className="subs__who">
                          <span className="subs__face"><Photo alt="" label={s.name} sizes="40px" /></span>
                          <span><strong>{s.name}</strong><br /><span className="small">{s.category}</span></span>
                        </span>
                      </td>
                      <td>{s.age}</td>
                      <td>{s.via}</td>
                      <td><span className={`status status--${s.status.toLowerCase().replace(/\s+/g, "-")}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel" aria-labelledby="search">
            <h2 id="search">Search talent</h2>
            <p className="small">Search RafikiHub profiles by playing age, look, skills, languages and accents. Coming soon to this dashboard.</p>
            <div className="filter" aria-label="Talent categories">
              {memberTypes.filter((m) => ["talent", "young-performer", "crew"].includes(m.key)).map((m) => (
                <span key={m.key} className="chip" aria-disabled="true">{m.name}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </DashboardShell>
  );
}
