import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { PlanCards } from "@/components/PlanCards";
import { membershipIncludes, perMonth, plans, savingVsBasic } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Membership options and prices",
  description: "RafikiHub membership: Basic Ksh 250 per month, Standard Ksh 1,250 for 6 months, Premium Ksh 2,500 for 12 months. Every plan includes a full profile and casting submissions.",
  path: "/membership",
});

const ksh = (n: number) => `Ksh ${n.toLocaleString("en-KE")}`;

export default function MembershipPage() {
  const offers = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RafikiHub membership",
    description: "Membership of RafikiHub, the casting platform for performers in Kenya and Africa.",
    brand: { "@type": "Brand", name: site.name },
    offers: plans.map((p) => ({ "@type": "Offer", name: `${p.name} (${p.label})`, price: p.priceKsh, priceCurrency: "KES", url: `${site.url}/join?plan=${p.id}` })),
  };
  return (
    <>
      <JsonLd data={offers} />
      <PageHeader
        kicker="Account Options"
        title={<>Choose the plan that <em>fits</em>.</>}
        lead="Every plan includes the same full membership. Longer plans cost less per month."
        crumbs={[{ name: "Membership options", path: "/membership" }]}
      />
      <section className="section">
        <div className="wrap"><PlanCards /></div>
      </section>
      <section className="section section--white" aria-labelledby="compare">
        <div className="wrap">
          <h2 id="compare">Compare plans</h2>
          <div className="table-scroll">
            <table className="compare">
              <thead>
                <tr><th scope="col"><span className="sr-only">Feature</span></th>{plans.map((p) => <th key={p.id} scope="col" className={p.highlighted ? "is-best" : undefined}>{p.name}</th>)}</tr>
              </thead>
              <tbody>
                <tr><th scope="row">Price</th>{plans.map((p) => <td key={p.id}>{ksh(p.priceKsh)}</td>)}</tr>
                <tr><th scope="row">Covers</th>{plans.map((p) => <td key={p.id}>{p.months === 1 ? "1 month" : `${p.months} months`}</td>)}</tr>
                <tr><th scope="row">Cost per month</th>{plans.map((p) => <td key={p.id}>{ksh(perMonth(p))}</td>)}</tr>
                <tr><th scope="row">Saving vs Basic</th>{plans.map((p) => <td key={p.id}>{savingVsBasic(p) ? ksh(savingVsBasic(p)) : "—"}</td>)}</tr>
                {membershipIncludes.map((f) => (
                  <tr key={f}><th scope="row">{f}</th>{plans.map((p) => <td key={p.id}><span aria-label="Included">✓</span></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small">Payment details are confirmed when we set up your membership. Questions? Call {site.phoneDisplay}.</p>
        </div>
      </section>
      <CtaBand title="Still deciding?" text="Pay month by month with Basic, or save with a 6 or 12 month plan." primary={{ href: "/join", label: "Join now" }} secondary={{ href: "/faq", label: "Read the FAQ" }} />
    </>
  );
}
