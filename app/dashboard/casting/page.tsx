import Link from "next/link";
import { DashboardShell, SampleTag, pickTab } from "@/components/DashboardShell";
import { Photo } from "@/components/Photo";
import { castingStatus, castingTabs, isAgent, sampleCastings, sampleRoster, sampleSubmissions, sampleTalent } from "@/lib/dashboard";
import { requireDashboard } from "@/lib/session";
import { site } from "@/lib/site";

type Search = { welcome?: string; tab?: string; q?: string; category?: string; gender?: string; city?: string; language?: string };
type Props = { searchParams: Promise<Search> };

const unique = (xs: string[]) => [...new Set(xs)].sort();
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default async function CastingDashboard({ searchParams }: Props) {
  const session = await requireDashboard("casting");
  const params = await searchParams;
  const member = session.kind === "member" ? session : null;
  // "My talents" is for agents (and the master preview), as on the old site
  const tabs = castingTabs.filter((t) => !("agentsOnly" in t) || !member || isAgent(member.category));
  const tab = pickTab(tabs, params.tab);
  const shortlisted = sampleSubmissions.filter((s) => s.status !== "New").length;

  // Talent search: every filter is applied (the old site posted its filters but ignored them)
  const q = (params.q ?? "").trim().toLowerCase();
  const results = sampleTalent.filter((t) =>
    (!q || t.name.toLowerCase().includes(q)) &&
    (!params.category || t.category === params.category) &&
    (!params.gender || t.gender === params.gender) &&
    (!params.city || t.city === params.city) &&
    (!params.language || t.languages.includes(params.language)),
  );

  return (
    <DashboardShell session={session} role="casting" welcome={params.welcome === "1"} tabs={tabs} tab={tab}>
      <section className="section">
        <div className="wrap dash">
          {tab === "home" ? (
            <>
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
            </>
          ) : null}

          {tab === "castings" ? (
            <>
              <section aria-labelledby="posted">
                <div className="section-head">
                  <h2 id="posted">All my castings <SampleTag /></h2>
                  <Link href="/casting" className="btn btn--sun btn--sm">New casting</Link>
                </div>
                <p className="small">Each casting sets who can apply (gender, talent categories and countries) and a closing date. Close it early once it's filled, or reopen it with a new date.</p>
                <div className="table-scroll">
                  <table className="credits subs">
                    <thead><tr><th scope="col">Casting</th><th scope="col">Open to</th><th scope="col">Closes</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {sampleCastings.map((c) => {
                        const status = castingStatus(c);
                        return (
                          <tr key={c.id}>
                            <td><strong>{c.title}</strong><br /><span className="small">{c.id} · {c.type} · {c.location}</span></td>
                            <td>{c.gender}</td>
                            <td>{c.closes}</td>
                            <td><span className={`status status--${status.toLowerCase()}`}>{status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section aria-labelledby="subs">
                <h2 id="subs">Received applications <SampleTag /></h2>
                <p className="small">Applications arrive from agents and from performers themselves. Shortlist people, then invite them to audition.</p>
                <div className="table-scroll">
                  <table className="credits subs">
                    <thead><tr><th scope="col">Performer</th><th scope="col">Casting</th><th scope="col">Playing age</th><th scope="col">Submitted</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {sampleSubmissions.map((s) => (
                        <tr key={s.name}>
                          <td>
                            <span className="subs__who">
                              <span className="subs__face"><Photo alt="" label={s.name} sizes="40px" /></span>
                              <span><strong>{s.name}</strong><br /><span className="small">{s.category}</span></span>
                            </span>
                          </td>
                          <td>{s.casting}</td>
                          <td>{s.age}</td>
                          <td>{s.via}</td>
                          <td><span className={`status status--${slug(s.status)}`}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : null}

          {tab === "talent" ? (
            <section aria-labelledby="search">
              <h2 id="search">Find talent <SampleTag /></h2>
              <p className="small">Search RafikiHub profiles. Only visible, active members appear in results.</p>
              <form className="talent-filters" method="get">
                <input type="hidden" name="tab" value="talent" />
                <div className="field"><label htmlFor="f-q">Name</label><input id="f-q" name="q" defaultValue={params.q ?? ""} placeholder="Search by name" /></div>
                {([
                  ["category", "Category", unique(sampleTalent.map((t) => t.category))],
                  ["gender", "Gender", ["Female", "Male"]],
                  ["city", "City", unique(sampleTalent.map((t) => t.city))],
                  ["language", "Language", unique(sampleTalent.flatMap((t) => t.languages))],
                ] as const).map(([name, label, options]) => (
                  <div className="field" key={name}>
                    <label htmlFor={`f-${name}`}>{label}</label>
                    <select id={`f-${name}`} name={name} defaultValue={params[name] ?? ""}>
                      <option value="">Any</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="talent-filters__actions">
                  <button type="submit" className="btn btn--ink btn--sm">Search</button>
                  <Link href="?tab=talent" className="link-strong">Clear</Link>
                </div>
              </form>
              <p className="small" role="status">{results.length} {results.length === 1 ? "performer" : "performers"} found</p>
              <ul className="cards cards--talent">
                {results.map((t) => (
                  <li key={t.name} className="talent-card">
                    <span className="talent-card__photo"><Photo alt="" label={t.name} sizes="200px" /></span>
                    <span className="talent-card__name">{t.name}</span>
                    <span className="talent-card__meta">{t.category} · {t.city} · {t.age}</span>
                    <span className="talent-card__meta">{t.languages.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === "roster" ? (
            <section aria-labelledby="roster">
              <h2 id="roster">My talents <SampleTag /></h2>
              <p className="small">Performers who link their profile to your agency appear here. Approve them to submit them for roles, or remove the link.</p>
              <div className="table-scroll">
                <table className="credits subs">
                  <thead><tr><th scope="col">Performer</th><th scope="col">Category</th><th scope="col">Status</th></tr></thead>
                  <tbody>
                    {sampleRoster.map((r) => (
                      <tr key={r.name}><td><strong>{r.name}</strong></td><td>{r.category}</td><td><span className={`status status--${r.status.toLowerCase()}`}>{r.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
