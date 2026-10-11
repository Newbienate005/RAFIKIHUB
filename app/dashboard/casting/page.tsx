import Link from "next/link";
import { DashboardShell, SampleTag, pickTab } from "@/components/DashboardShell";
import { Photo } from "@/components/Photo";
import { profileCategories } from "@/lib/data";
import { applicationLabel, castingStatus, castingTabs, isAgent, sampleCastings, sampleRoster, sampleSubmissions } from "@/lib/dashboard";
import { agentNames, getApplicationsToMe, getMyCastings, getMyRoster, searchTalent } from "@/lib/dashboard-data";
import { requireDashboard } from "@/lib/session";
import { site } from "@/lib/site";

type Search = { welcome?: string; tab?: string; q?: string; category?: string; city?: string; language?: string };
type Props = { searchParams: Promise<Search> };

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const day = (d: Date | string) => new Date(typeof d === "string" ? `${d}T00:00:00` : d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
const age = (a: { min: number; max: number } | null) => (a ? `${a.min} to ${a.max}` : "Not given");
const castingLabel = (c: { status: string; filled: boolean; closesOn: string }) =>
  c.filled ? "Filled" : c.status === "draft" ? "Draft" : c.status === "closed" || new Date(`${c.closesOn}T23:59:59`) < new Date() ? "Closed" : "Open";

export default async function CastingDashboard({ searchParams }: Props) {
  const session = await requireDashboard("casting");
  const params = await searchParams;
  const member = session.kind === "member" ? session : null;
  // Signed in with email and password: their real castings, applicants and roster. The master login previews samples.
  const accountId = member?.accountId ?? null;
  // "My talents" is for agents (and the master preview), as on the old site
  const tabs = castingTabs.filter((t) => !("agentsOnly" in t) || !member || isAgent(member.category));
  const tab = pickTab(tabs, params.tab);

  const [castings, received] = accountId && (tab === "home" || tab === "castings")
    ? await Promise.all([getMyCastings(accountId), getApplicationsToMe(accountId, tab === "home" ? 200 : 50)])
    : [[], []];
  const roster = accountId && tab === "roster" ? await getMyRoster(accountId) : [];
  const via = await agentNames([...new Set(received.map((r) => r.viaAgent).filter((v): v is number => v !== null))]);
  const shortlisted = accountId ? received.filter((r) => r.status === "shortlisted" || r.status === "audition-booked").length : sampleSubmissions.filter((s) => s.status !== "New").length;

  // Find talent searches real, published profiles for everyone (including the master login)
  const search = tab === "talent" ? await searchTalent(params) : { results: [], total: 0 };
  const searched = Boolean(params.q || params.category || params.city || params.language);

  return (
    <DashboardShell session={session} role="casting" welcome={params.welcome === "1"} tabs={tabs} tab={tab}>
      <section className="section">
        <div className="wrap dash">
          {tab === "home" ? (
            <>
              <ul className="stat-grid">
                <li className="stat">
                  <span className="stat__label">Castings</span>
                  <span className="stat__value">{accountId ? castings.length : member?.project ? 1 : 0}</span>
                  <span className="stat__note">{accountId && castings.length ? <Link href="?tab=castings">See all</Link> : member?.project ? "Being reviewed by RafikiHub" : <Link href="/casting">Post your first</Link>}</span>
                </li>
                <li className="stat">
                  <span className="stat__label">Applications {accountId ? null : <SampleTag />}</span>
                  <span className="stat__value">{accountId ? received.length : sampleSubmissions.length}</span>
                  <span className="stat__note">From agents and performers</span>
                </li>
                <li className="stat">
                  <span className="stat__label">Shortlisted {accountId ? null : <SampleTag />}</span>
                  <span className="stat__value">{shortlisted}</span>
                  <span className="stat__note">Ready to invite to audition</span>
                </li>
              </ul>

              <div className="dash-grid">
                <section className="panel" aria-labelledby="breakdowns">
                  <h2 id="breakdowns">Your castings</h2>
                  {accountId && castings.length ? (
                    <ul className="plain">
                      {castings.slice(0, 4).map((c) => (
                        <li key={c.id}>
                          <strong>{c.title}</strong> <span className={`status status--${slug(castingLabel(c))}`}>{castingLabel(c)}</span><br />
                          <span className="small">{c.ref} · {c.applications} {c.applications === 1 ? "application" : "applications"} · closes {day(c.closesOn)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : member?.project ? (
                    <ul className="plain">
                      <li>
                        <strong>{member.project}</strong><br />
                        <span className="small">{member.company}{member.location ? ` · ${member.location}` : ""} · We&apos;ll confirm the details with you before it goes out</span>
                      </li>
                    </ul>
                  ) : (
                    <p className="small">{member ? "You haven't posted a casting yet." : "Master preview: castings posted through /casting appear here for the casting professional who sent them."}</p>
                  )}
                  <Link href="/casting" className="btn btn--sun btn--sm" style={{ marginTop: "1.25rem" }}>Post a new casting</Link>
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
                  <h2 id="posted">All my castings {accountId ? null : <SampleTag />}</h2>
                  <Link href="/casting" className="btn btn--sun btn--sm">New casting</Link>
                </div>
                <p className="small">Each casting sets who can apply (gender, talent categories and countries) and a closing date. To close one early, reopen it or change it, call {site.phoneDisplay} or email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
                {accountId && !castings.length ? (
                  <p className="small dash-empty">You haven&apos;t posted a casting yet. <Link href="/casting">Post your first casting</Link> and it appears here once the RafikiHub team has checked it.</p>
                ) : (
                  <div className="table-scroll">
                    <table className="credits subs">
                      <thead><tr><th scope="col">Casting</th><th scope="col">Open to</th><th scope="col">Closes</th><th scope="col">Applications</th><th scope="col">Status</th></tr></thead>
                      <tbody>
                        {accountId
                          ? castings.map((c) => (
                              <tr key={c.id}>
                                <td><strong>{c.title}</strong><br /><span className="small">{[c.ref, c.type, c.location].filter(Boolean).join(" · ")}</span></td>
                                <td>{c.gender}</td>
                                <td>{day(c.closesOn)}</td>
                                <td>{c.applications}{c.shortlisted ? <span className="small"> · {c.shortlisted} shortlisted</span> : null}</td>
                                <td><span className={`status status--${slug(castingLabel(c))}`}>{castingLabel(c)}</span></td>
                              </tr>
                            ))
                          : sampleCastings.map((c) => {
                              const status = castingStatus(c);
                              return (
                                <tr key={c.id}>
                                  <td><strong>{c.title}</strong><br /><span className="small">{c.id} · {c.type} · {c.location}</span></td>
                                  <td>{c.gender}</td>
                                  <td>{c.closes}</td>
                                  <td>Sample</td>
                                  <td><span className={`status status--${status.toLowerCase()}`}>{status}</span></td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section aria-labelledby="subs">
                <h2 id="subs">Received applications {accountId ? null : <SampleTag />}</h2>
                <p className="small">Applications arrive from agents and from performers themselves, newest first. Open a profile to see their photos, reels and credits.</p>
                {accountId && !received.length ? (
                  <p className="small dash-empty">No applications yet. They appear here as performers and agents apply to your castings.</p>
                ) : (
                  <div className="table-scroll">
                    <table className="credits subs">
                      <thead><tr><th scope="col">Performer</th><th scope="col">Casting</th><th scope="col">Playing age</th><th scope="col">Via</th><th scope="col">Applied</th><th scope="col">Status</th></tr></thead>
                      <tbody>
                        {accountId
                          ? received.map((r) => (
                              <tr key={r.id}>
                                <td>
                                  <span className="subs__who">
                                    <span className="subs__face"><Photo src={r.headshot ?? undefined} alt="" label={r.name} sizes="40px" /></span>
                                    <span>{r.profileUrl && r.published ? <Link href={`/profile/${r.profileUrl}`} target="_blank"><strong>{r.name}</strong></Link> : <strong>{r.name}</strong>}<br /><span className="small">{r.category ?? "Performer"}</span></span>
                                  </span>
                                </td>
                                <td>{r.castingTitle}<br /><span className="small">{r.castingRef}</span></td>
                                <td>{age(r.playingAge)}</td>
                                <td>{r.viaAgent ? via.get(r.viaAgent) ?? "Agent" : "Self"}</td>
                                <td>{day(r.appliedAt)}</td>
                                <td><span className={`status status--${r.status}`}>{applicationLabel(r.status)}</span></td>
                              </tr>
                            ))
                          : sampleSubmissions.map((s) => (
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
                                <td>Sample</td>
                                <td><span className={`status status--${slug(s.status)}`}>{s.status}</span></td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : null}

          {tab === "talent" ? (
            <section aria-labelledby="search">
              <h2 id="search">Find talent</h2>
              <p className="small">Search every public RafikiHub profile. Profiles with photos come first.</p>
              <form className="talent-filters" method="get">
                <input type="hidden" name="tab" value="talent" />
                <div className="field"><label htmlFor="f-q">Name</label><input id="f-q" name="q" defaultValue={params.q ?? ""} placeholder="Search by name" /></div>
                <div className="field">
                  <label htmlFor="f-category">Category</label>
                  <select id="f-category" name="category" defaultValue={params.category ?? ""}>
                    <option value="">Any</option>
                    {profileCategories.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="field"><label htmlFor="f-city">City</label><input id="f-city" name="city" defaultValue={params.city ?? ""} placeholder="e.g. Nairobi" /></div>
                <div className="field"><label htmlFor="f-language">Language or accent</label><input id="f-language" name="language" defaultValue={params.language ?? ""} placeholder="e.g. Swahili" /></div>
                <div className="talent-filters__actions">
                  <button type="submit" className="btn btn--ink btn--sm">Search</button>
                  {searched ? <Link href="?tab=talent" className="link-strong">Clear</Link> : null}
                </div>
              </form>
              <p className="small" role="status">
                {search.total.toLocaleString("en-KE")} {search.total === 1 ? "performer" : "performers"} {searched ? "found" : "on RafikiHub"}
                {search.total > search.results.length ? `, showing the first ${search.results.length}. Narrow the search to see more.` : ""}
              </p>
              {search.results.length ? (
                <ul className="cards cards--talent">
                  {search.results.map((t) => (
                    <li key={t.profileUrl} className="talent-card">
                      <Link href={`/profile/${t.profileUrl}`} target="_blank" className="talent-card__link">
                        <span className="talent-card__photo"><Photo src={t.headshot ?? undefined} alt="" label={t.fullName} sizes="200px" /></span>
                        <span className="talent-card__name">{t.fullName}</span>
                        <span className="talent-card__meta">{[t.category, t.cities[0], t.playingAge ? `plays ${t.playingAge.min} to ${t.playingAge.max}` : null].filter(Boolean).join(" · ")}</span>
                        {t.languages.length ? <span className="talent-card__meta">{t.languages.slice(0, 4).join(", ")}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="small dash-empty">No profiles match that search. Try fewer filters, or a shorter city or language.</p>
              )}
            </section>
          ) : null}

          {tab === "roster" ? (
            <section aria-labelledby="roster">
              <h2 id="roster">My talents {accountId ? null : <SampleTag />}</h2>
              <p className="small">Performers who link their profile to your agency appear here. To approve or remove a link, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
              {accountId && !roster.length ? (
                <p className="small dash-empty">No performers have linked their profile to you yet.</p>
              ) : (
                <div className="table-scroll">
                  <table className="credits subs">
                    <thead><tr><th scope="col">Performer</th><th scope="col">Category</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {accountId
                        ? roster.map((r) => (
                            <tr key={r.id}>
                              <td>{r.profileUrl && r.published ? <Link href={`/profile/${r.profileUrl}`} target="_blank"><strong>{r.name}</strong></Link> : <strong>{r.name}</strong>}</td>
                              <td>{r.category ?? "Performer"}</td>
                              <td><span className={`status status--${r.status}`}>{r.status === "approved" ? "Approved" : "Waiting for you"}</span></td>
                            </tr>
                          ))
                        : sampleRoster.map((r) => (
                            <tr key={r.name}><td><strong>{r.name}</strong></td><td>{r.category}</td><td><span className={`status status--${r.status.toLowerCase()}`}>{r.status}</span></td></tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
