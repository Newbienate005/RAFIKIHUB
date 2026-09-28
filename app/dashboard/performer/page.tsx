import Link from "next/link";
import { DashboardShell, SampleTag } from "@/components/DashboardShell";
import { plans } from "@/lib/data";
import { sampleCastings } from "@/lib/dashboard";
import { requireDashboard } from "@/lib/session";

type Props = { searchParams: Promise<{ welcome?: string }> };

export default async function PerformerDashboard({ searchParams }: Props) {
  const session = await requireDashboard("performer");
  const { welcome } = await searchParams;
  const member = session.kind === "member" ? session : null;

  // The master login previews the dashboard with sample details
  const details = member ?? { name: "Sample Performer", email: "performer@example.com", category: "Actor or performer", plan: "premium", location: "Nairobi" };
  const plan = plans.find((p) => p.id === details.plan);

  const checklist = [
    { label: "Basic details", done: true, href: null },
    { label: "Headshots", done: false, href: "/services#headshots" },
    { label: "Credits and training", done: Boolean(member), href: null },
    { label: "Showreel", done: false, href: "/services#showreels" },
    { label: "Skills, languages and accents", done: false, href: null },
  ];
  const progress = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <DashboardShell session={session} role="performer" welcome={welcome === "1"}>
      <section className="section">
        <div className="wrap dash">
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
              <p className="small">Complete profiles are the ones casting directors find first.</p>
              <ul className="checklist">
                {checklist.map((c) => (
                  <li key={c.label} className={c.done ? "is-done" : undefined}>
                    <span className="checklist__mark" aria-hidden="true">{c.done ? "✓" : ""}</span>
                    <span className="checklist__label">{c.label}<span className="sr-only">{c.done ? " (done)" : " (to do)"}</span></span>
                    {!c.done && c.href ? <Link href={c.href} className="checklist__action">Book</Link> : null}
                  </li>
                ))}
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
              <p className="small" style={{ marginTop: "1rem" }}>Something wrong? Email <a href="mailto:info@rafikihub.com">info@rafikihub.com</a>.</p>
            </section>
          </div>

          <section aria-labelledby="opps">
            <div className="section-head">
              <h2 id="opps">Castings for you <SampleTag /></h2>
              <Link href="/faq" className="link-strong">How applying works →</Link>
            </div>
            <p className="small">Live castings that match your profile appear here once your membership is active.</p>
            <ul className="opps">
              {sampleCastings.map((c) => (
                <li key={c.title} className="opp">
                  <p className="card__genre">{c.type} · {c.location}</p>
                  <h3>{c.title}</h3>
                  <p className="small">{c.roles}</p>
                  <button type="button" className="btn btn--ink btn--sm" disabled>Apply with my profile</button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="next">
            <h2 id="next">Next steps</h2>
            <ul className="next-steps">
              <li><Link href="/services#headshots"><strong>Book headshots</strong><span>Sio Bahati sessions in Nairobi</span></Link></li>
              <li><Link href="/services#audition-preps"><strong>Prepare for auditions</strong><span>One-to-one audition and self-tape prep</span></Link></li>
              <li><Link href="/resources"><strong>Check your stage name</strong><span>Free stage name checker</span></Link></li>
              <li><Link href="/talent-management"><strong>Talent management</strong><span>Apply for representation</span></Link></li>
            </ul>
          </section>
        </div>
      </section>
    </DashboardShell>
  );
}
