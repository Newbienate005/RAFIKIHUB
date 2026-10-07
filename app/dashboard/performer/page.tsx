import Link from "next/link";
import { DashboardShell, SampleTag, pickTab } from "@/components/DashboardShell";
import { plans } from "@/lib/data";
import { castingStatus, completenessItems, cvSections, performerTabs, sampleAgents, sampleCastings } from "@/lib/dashboard";
import { getOpenBreakdowns } from "@/lib/admin/castings";
import { requireDashboard } from "@/lib/session";
import { site } from "@/lib/site";

type Props = { searchParams: Promise<{ welcome?: string; tab?: string }> };

export default async function PerformerDashboard({ searchParams }: Props) {
  const session = await requireDashboard("performer");
  const { welcome, tab: requested } = await searchParams;
  const tab = pickTab(performerTabs, requested);
  const member = session.kind === "member" ? session : null;

  // The master login previews the dashboard with sample details
  const details = member ?? { name: "Sample Performer", email: "performer@example.com", category: "Actor or performer", plan: "premium", location: "Nairobi" };
  const plan = plans.find((p) => p.id === details.plan);
  // New members haven't added photos, date of birth, skills or credits yet; the master preview shows a part-built profile
  const done = new Set<string>(member ? [] : ["photos", "dob"]);
  const progress = Math.round((done.size / completenessItems.length) * 100);
  // Breakdowns published in the admin; the sample list only shows until the first one goes live
  const live = tab === "opportunities" ? await getOpenBreakdowns() : [];
  const closes = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <DashboardShell session={session} role="performer" welcome={welcome === "1"} tabs={performerTabs} tab={tab}>
      <section className="section">
        <div className="wrap dash">
          {tab === "home" ? (
            <>
              <ul className="stat-grid">
                <li className="stat">
                  <span className="stat__label">Membership</span>
                  <span className="stat__value">{plan ? plan.name : "Not chosen yet"}</span>
                  <span className="stat__note">{plan ? `Ksh ${plan.priceKsh.toLocaleString("en-KE")} ${plan.label}` : <Link href="/membership">Compare plans</Link>}</span>
                </li>
                <li className="stat">
                  <span className="stat__label">Status</span>
                  <span className="stat__value">{member ? "Application received" : "Active"}</span>
                  <span className="stat__note">{member ? "We'll email you within two working days" : "Master preview"}</span>
                </li>
                <li className="stat">
                  <span className="stat__label">Profile</span>
                  <span className="stat__value">{progress}% complete</span>
                  <span className="meter" aria-hidden="true"><span style={{ width: `${progress}%` }} /></span>
                </li>
              </ul>

              <div className="dash-grid">
                <section className="panel" aria-labelledby="checklist">
                  <h2 id="checklist">Finish your profile</h2>
                  <p className="small">Photos, date of birth, skills and credits each make up a quarter of a complete profile. Complete profiles are the ones casting directors find first.</p>
                  <ul className="checklist">
                    {completenessItems.map((c) => {
                      const isDone = done.has(c.key);
                      return (
                        <li key={c.key} className={isDone ? "is-done" : undefined}>
                          <span className="checklist__mark" aria-hidden="true">{isDone ? "✓" : ""}</span>
                          <span className="checklist__label">{c.label}<span className="sr-only">{isDone ? " (done)" : " (to do)"}</span></span>
                          {!isDone ? (
                            "href" in c ? <Link href={c.href} className="checklist__action">Book a shoot</Link> : <Link href="?tab=cv" className="checklist__action">Add</Link>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="panel" aria-labelledby="details">
                  <h2 id="details">Your details {member ? null : <SampleTag />}</h2>
                  <dl className="facts">
                    <dt>Name</dt><dd>{details.name}</dd>
                    <dt>Email</dt><dd>{details.email}</dd>
                    <dt>Joining as</dt><dd>{details.category ?? "Not given"}</dd>
                    <dt>Location</dt><dd>{details.location ?? "Not given"}</dd>
                  </dl>
                  <p className="small" style={{ marginTop: "1rem" }}>Something wrong? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
                </section>
              </div>

              <section aria-labelledby="next">
                <h2 id="next">Next steps</h2>
                <ul className="next-steps">
                  <li><Link href="/services#headshots"><strong>Book headshots</strong><span>Sio Bahati sessions in Nairobi</span></Link></li>
                  <li><Link href="/services#audition-preps"><strong>Prepare for auditions</strong><span>One-to-one audition and self-tape prep</span></Link></li>
                  <li><Link href="/resources"><strong>Check your stage name</strong><span>Free stage name checker</span></Link></li>
                  <li><Link href="/blog"><strong>Resource hub</strong><span>Advice, reviews and member stories</span></Link></li>
                </ul>
              </section>
            </>
          ) : null}

          {tab === "opportunities" ? (
            <>
              <section aria-labelledby="postings">
                <h2 id="postings">Talent postings {live.length ? null : <SampleTag />}</h2>
                <p className="small">Live castings appear here once your membership is active. You can apply when the casting is open and you match its categories, countries and gender.</p>
                <div className="table-scroll">
                  <table className="credits subs">
                    <thead><tr><th scope="col">Casting</th><th scope="col">Type</th><th scope="col">Gender</th><th scope="col">Closes</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
                    <tbody>
                      {live.map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.title}</strong><br /><span className="small">{[c.ref, c.location, c.categories.length ? c.categories.join(", ") : "All categories"].filter(Boolean).join(" · ")}</span></td>
                          <td>{c.type}</td>
                          <td>{c.gender}</td>
                          <td>{closes(c.closesOn)}</td>
                          <td><span className={`status status--${c.filled ? "filled" : "open"}`}>{c.filled ? "Filled" : "Open"}</span></td>
                          <td><button type="button" className="btn btn--ink btn--sm" disabled title="Applying opens with member logins">Apply</button></td>
                        </tr>
                      ))}
                      {live.length ? null : sampleCastings.map((c) => {
                        const status = castingStatus(c);
                        return (
                          <tr key={c.id}>
                            <td><strong>{c.title}</strong><br /><span className="small">{c.id} · {c.location} · {c.roles}</span></td>
                            <td>{c.type}</td>
                            <td>{c.gender}</td>
                            <td>{c.closes}</td>
                            <td><span className={`status status--${status.toLowerCase()}`}>{status}</span></td>
                            <td><button type="button" className="btn btn--ink btn--sm" disabled>Apply</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="panel" aria-labelledby="applied">
                <h2 id="applied">My applications</h2>
                <p className="small">You haven't applied for any castings yet. Castings you apply for are listed here, and you can withdraw an application while the casting is open.</p>
              </section>
            </>
          ) : null}

          {tab === "media" ? (
            <section aria-labelledby="media">
              <h2 id="media">My media</h2>
              <p className="small">Uploads open once your membership is active. Until then, <Link href="/services">Sio Bahati Services</Link> can shoot your headshots and cut your showreel.</p>
              <ul className="opps">
                <li className="opp">
                  <p className="card__genre">Photos · 0 of 12</p>
                  <h3>Headshots and gallery</h3>
                  <p className="small">Up to 12 photos. Credit the photographer on each, and choose one as your main headshot.</p>
                  <button type="button" className="btn btn--ink btn--sm" disabled>Upload photos</button>
                </li>
                <li className="opp">
                  <p className="card__genre">Video · MP4, WebM or MOV, up to 150MB</p>
                  <h3>Showreel</h3>
                  <p className="small">A short, well-cut reel of your best screen work, with a title.</p>
                  <button type="button" className="btn btn--ink btn--sm" disabled>Upload showreel</button>
                </li>
                <li className="opp">
                  <p className="card__genre">Audio · MP3 or WAV, up to 100MB</p>
                  <h3>Voice clips</h3>
                  <p className="small">Voice-over reels and clips that show your range.</p>
                  <button type="button" className="btn btn--ink btn--sm" disabled>Upload voice clip</button>
                </li>
              </ul>
            </section>
          ) : null}

          {tab === "cv" ? (
            <section aria-labelledby="cv">
              <div className="section-head">
                <h2 id="cv">Edit CV</h2>
                <Link href="/profile/katesnow" className="link-strong">See an example profile →</Link>
              </div>
              <p className="small">Your CV is your public RafikiHub profile. Editing opens once your membership is active; this is everything you'll be able to add.</p>
              <ul className="cv-groups">
                {cvSections.map((g) => (
                  <li key={g.title} className="panel">
                    <h3>{g.title}</h3>
                    <ul className="plain">{g.fields.map((f) => <li key={f}>{f}</li>)}</ul>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === "agents" ? (
            <>
              <section aria-labelledby="agents">
                <h2 id="agents">My agents <SampleTag /></h2>
                <p className="small">Link your RafikiHub profile to your agent so they can submit you for roles. The agent approves the link from their dashboard.</p>
                <div className="table-scroll">
                  <table className="credits subs">
                    <thead><tr><th scope="col">Agent</th><th scope="col">City</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {sampleAgents.map((a) => (
                        <tr key={a.name}><td><strong>{a.name}</strong></td><td>{a.city}</td><td><span className={`status status--${a.status.toLowerCase()}`}>{a.status}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="panel" aria-labelledby="representation">
                <h2 id="representation">Looking for representation?</h2>
                <p className="small">RafikiHub Talent Management represents a small roster of actors in Kenya. Only performers without an agency or representation can apply.</p>
                <Link href="/talent-management" className="btn btn--sun btn--sm" style={{ marginTop: "0.75rem" }}>About Talent Management</Link>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
