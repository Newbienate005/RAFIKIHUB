import { CtaBand } from "@/components/CtaBand";
import { LeadForm } from "@/components/LeadForm";
import { locationTypes } from "@/lib/validation";
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
      <section className="section" id="scouting" aria-labelledby="scouting-title">
        <div className="wrap form-wrap">
          <div className="prose">
            <p className="kicker">For productions</p>
            <h2 id="scouting-title" style={{ marginTop: 0 }}>Filming in Kenya? We'll find your location.</h2>
            <p>
              RafikiHub and its partners share one vision: discovering Kenya's vast, untouched landscapes, unique properties
              and distinctive culture, and bringing them to life through film, art and storytelling that's authentic to the
              heritage and history of this spirited country and its people.
            </p>
            <p>
              We want your location scouting to be smooth and stress free. RafikiHub can connect your production with venues,
              lodges, restaurants, landscapes and traditional customs, and through our close relationship with a leading East
              African travel partner, we can support the operations and logistics of filming in Kenya's most remarkable
              destinations.
            </p>
            <p>Tell us what your project needs and we'll get to work for you.</p>
          </div>
          <div className="panel">
            <LeadForm
              endpoint="/api/location-request"
              submitLabel="Send location request"
              successMessage="Request received. We'll be in touch within two working days about locations for your production."
              fields={[
                { name: "organization", label: "Organisation", required: true, autoComplete: "organization" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: true },
                { name: "country", label: "Country", autoComplete: "country-name", half: true },
                { name: "crew", label: "People on set (cast and crew)", half: true },
                { name: "nature", label: "Type of project or production", required: true, hint: "e.g. feature film, commercial, documentary" },
                { name: "fromDate", label: "Dates from", half: true },
                { name: "toDate", label: "Dates to", half: true },
                { name: "locationType", label: "Kind of location", type: "select", required: true, options: [...locationTypes] },
                { name: "services", label: "Services needed", hint: "e.g. transport, catering, accommodation" },
                { name: "details", label: "Anything else we should know?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
      <PageFaq title="Visiting and working with us" items={pageFaqs.locations} />
      <CtaBand title="Wherever you are, you can join." text="RafikiHub profiles and castings are online, so you can be seen from anywhere." primary={{ href: "/join", label: "Join the Hub" }} />
    </>
  );
}
