import Link from "next/link";
import { site } from "@/lib/site";
import { LeadForm } from "./LeadForm";
import { SocialIcons } from "./SocialIcons";

// Columns mirror the old rafikihub.com footer, as rebuilt in the Figma design.
const sioBahati = [
  { href: "/services#headshots", label: "Headshots" },
  { href: "/services#showreels", label: "Showreels" },
  { href: "/services#audition-preps", label: "Audition Preps" },
];
const smallPrint = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "RafikiHub Privacy Policy" },
  { href: "/faq", label: "RafikiHub Help & FAQ" },
  { href: "/blog/how-casting-works-on-rafikihub", label: "How RafikiHub Works" },
];

export function Footer() {
  const a = site.address;
  return (
    <footer className="site-footer">
      <div className="beadband beadband--thick" aria-hidden="true" />
      <div className="wrap site-footer__grid">
        <div>
          <h2>About RafikiHub</h2>
          <p>RafikiHub connects cast and crew to industry professionals with roles in theatre, television and film productions across Africa. <em>Rafiki</em> is Swahili for “friend”.</p>
          <SocialIcons />
        </div>
        <nav aria-label="Sio Bahati Services">
          <h2>Sio Bahati Services</h2>
          <ul>{sioBahati.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label="The small print">
          <h2>The Small Print</h2>
          <ul>{smallPrint.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h2>Get In Touch</h2>
          <address>
            {a.building}<br />
            {a.street}<br />
            {a.area}, {a.city}, {a.countryName}<br />
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </div>
      </div>
      <div className="wrap site-footer__news">
        <div>
          <h2>Casting news by email</h2>
          <p className="small">Workshops, open castings and advice. One email a month.</p>
        </div>
        <LeadForm
          endpoint="/api/newsletter"
          compact
          submitLabel="Subscribe"
          successMessage="You're subscribed. Look out for our next email."
          fields={[{ name: "email", label: "Email address", type: "email", required: true, autoComplete: "email" }]}
        />
      </div>
      <div className="wrap site-footer__base">
        <p>Copyright © {new Date().getFullYear()} {site.legalName}</p>
        <p><Link href="/contact">Contact us</Link> · <Link href="/team">Our team</Link></p>
      </div>
    </footer>
  );
}
