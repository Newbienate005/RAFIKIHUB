import { CtaBand } from "@/components/CtaBand";
import { FilterGrid } from "@/components/FilterGrid";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { contactListings } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Talent agents and casting directors in Kenya",
  description: "The Rafiki Data Bank: a directory of talent agents, casting directors, production companies, photographers and training for performers in Kenya and Africa.",
  path: "/contact-listings",
  // Keep the directory out of search results until it has enough listings to be useful
  noindex: contactListings.length <= 3,
});

export default function ContactListingsPage() {
  const sorted = [...contactListings].sort((a, b) => Number(!!b.enhanced) - Number(!!a.enhanced) || a.name.localeCompare(b.name));
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RafikiHub Contact Listings",
    itemListElement: sorted.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Organization", name: c.name, description: c.description, ...(c.website ? { url: c.website } : {}), address: c.location } })),
  };
  return (
    <>
      <JsonLd data={schema} />
      <PageHeader
        kicker="Rafiki Data Bank"
        title={<>Contact <em>Listings</em></>}
        lead="A trusted directory of agents, casting directors and the services performers rely on."
        crumbs={[{ name: "Resource Hub", path: "/resources" }, { name: "Contact Listings", path: "/contact-listings" }]}
      />
      <section className="section">
        <div className="wrap">
          <FilterGrid
            label="Filter listings by type"
            allLabel="All listings"
            items={sorted.map((c) => ({
              key: c.name,
              group: c.type,
              node: (
                <article className={`listing${c.enhanced ? " listing--enhanced" : ""}`}>
                  {c.enhanced ? <span className="listing__badge">Enhanced listing</span> : null}
                  <p className="card__genre">{c.type}</p>
                  <h2 className="card__title">{c.name}</h2>
                  <p className="card__meta">{c.location}</p>
                  <p className="card__excerpt">{c.description}</p>
                  <p className="listing__links">
                    {c.website ? <a href={c.website} target="_blank" rel="noopener">Website</a> : null}
                    {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : null}
                    {c.phone ? <a href={`tel:${c.phone}`}>{c.phone}</a> : null}
                  </p>
                </article>
              ),
            }))}
          />
        </div>
      </section>
      <CtaBand
        kicker="Get listed"
        title="Offer a service to performers?"
        text="Agents, casting directors, photographers and trainers can list here. Enhanced listings appear first and stand out in search."
        primary={{ href: "/contact", label: "Request a listing" }}
      />
    </>
  );
}
