import { CtaBand } from "@/components/CtaBand";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageFaq } from "@/components/PageFaq";
import { PageHeader } from "@/components/PageHeader";
import { localBusinessSchema } from "@/lib/schema";
import { Photo } from "@/components/Photo";
import { locations, pageFaqs } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "RafikiHub Locations: Nairobi HQ and across Africa",
  description: `RafikiHub is based at ${site.address.building}, ${site.address.area}, Nairobi, and works with performers and productions across East Africa, Africa and internationally.`,
  path: "/locations",
});

export default function LocationsPage() {
  const a = site.address;
  const mapQuery = encodeURIComponent(`${a.building}, ${a.area}, ${a.city}, ${a.countryName}`);
  const [hq, ...rest] = locations;
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <PageHeader
        kicker="RafikiHub Locations"
        title={<>Rooted in Nairobi, <em>working across Africa</em>.</>}
        lead="Our home is in Parklands, Nairobi. Our members and productions reach across the continent and beyond."
        crumbs={[{ name: "Resource Hub", path: "/resources" }, { name: "Locations", path: "/locations" }]}
      />
      <section className="section">
        <div className="wrap hq">
          <div className="hq__media">
            <Photo src={hq.image ?? undefined} alt="Nairobi, home of RafikiHub" label="Nairobi" sizes="(max-width: 860px) 100vw, 560px" />
          </div>
          <div>
            <p className="kicker">Headquarters</p>
            <h2>{hq.city}, {hq.country}</h2>
            <p>{hq.note}</p>
            <address className="hq__address">
              {a.building}<br />{a.street}<br />{a.area}, {a.city}<br />{a.countryName}
            </address>
            <p>
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <div className="btn-row">
              <a className="btn btn--ink" href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener">Open in Google Maps</a>
              <Link className="btn btn--ghost" href="/contact">Send us a message</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <h2>Where we work</h2>
          <ul className="regions">
            {rest.map((l) => (
              <li key={l.city}>
                <h3>{l.city}</h3>
                <p className="card__genre">{l.country}</p>
                <p>{l.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PageFaq title="Visiting and working with us" items={pageFaqs.locations} />
      <CtaBand title="Wherever you are, you can join." text="RafikiHub profiles and castings are online, so you can be seen from anywhere." primary={{ href: "/join", label: "Join the Hub" }} />
    </>
  );
}
