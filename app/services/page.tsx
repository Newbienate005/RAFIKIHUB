import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { services } from "@/lib/data";
import { serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

const description =
  "Sio Bahati Services from RafikiHub: professional acting headshots, showreels and audition preparation for performers in Nairobi, Kenya.";

export const metadata = pageMeta({ title: "Sio Bahati Services: headshots, showreels and audition prep in Nairobi", description, path: "/services" });

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={services.map((s) => serviceSchema(`${s.name} (Sio Bahati Services)`, s.summary, `/services#${s.id}`))} />
      <PageHeader
        kicker="Sio Bahati Services"
        title={<>It's not luck. It's <em>preparation</em>.</>}
        lead="Sio bahati means 'it's not luck' in Swahili. Headshots, showreels and audition prep to give casting directors every reason to call you in."
        crumbs={[{ name: "Sio Bahati Services", path: "/services" }]}
      />

      <section className="section">
        <div className="wrap">
          <ol className="service-list">
            {services.map((s, i) => (
              <li key={s.id} id={s.id} className="service">
                <div className="service__media">
                  <Photo src={s.image ?? undefined} alt={`${s.name} session at RafikiHub`} label={s.name} sizes="(max-width: 860px) 100vw, 480px" />
                </div>
                <div>
                  <span className="service__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h2>{s.name}</h2>
                  <p className="lead">{s.summary}</p>
                  <ul>{s.includes.map((x) => <li key={x}>{x}</li>)}</ul>
                  <a className="btn btn--ink" href={`?service=${s.id}#book`}>Book {s.name.toLowerCase()}</a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--white" id="book" aria-labelledby="book-title">
        <div className="wrap form-wrap">
          <div>
            <p className="kicker">Book a service</p>
            <h2 id="book-title">Book a session</h2>
            <p>Tell us which service you need and when suits you. We'll confirm availability and price by email or phone.</p>
          </div>
          <div className="panel">
            <LeadForm
              endpoint="/api/booking"
              submitLabel="Request booking"
              successMessage="Booking request sent. We'll be in touch within two working days to confirm your session."
              fields={[
                { name: "service", label: "Service", type: "select", required: true, options: services.map((s) => s.id), optionLabels: services.map((s) => s.name), defaultFromQuery: "service" },
                { name: "fullName", label: "Full name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", half: true, hint: "Include the country code, e.g. +254" },
                { name: "preferredDate", label: "Preferred date", hint: "A date or a rough time, e.g. 'any weekday in March'" },
                { name: "notes", label: "Anything we should know?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>

      <CtaBand title="Not a member yet?" text="Your headshots and showreel go straight onto your RafikiHub profile." primary={{ href: "/join", label: "Join RafikiHub" }} secondary={{ href: "/membership", label: "See membership options" }} />
    </>
  );
}
