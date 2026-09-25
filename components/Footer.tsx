import Link from "next/link";
import { site } from "@/lib/site";
import { LeadForm } from "./LeadForm";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__about">
          <Logo />
          <p>A casting platform in Nairobi linking performers across Kenya and Africa with the people who cast them.</p>
          <address>
            <a href={`mailto:${site.email}`}>{site.email}</a><br />
            <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><br />
            {site.city}, Kenya
          </address>
        </div>
        <nav aria-label="Performers">
          <h2>Performers</h2>
          <ul>
            <li><Link href="/join">Join as talent</Link></li>
            <li><Link href="/talent-management">Agent representation</Link></li>
            <li><Link href="/blog/how-to-get-a-great-acting-headshot">Headshot advice</Link></li>
            <li><Link href="/faq">Help and FAQ</Link></li>
          </ul>
        </nav>
        <nav aria-label="Casting professionals">
          <h2>Casting</h2>
          <ul>
            <li><Link href="/casting">Post a casting</Link></li>
            <li><Link href="/blog/how-casting-works-on-rafikihub">How casting works</Link></li>
            <li><Link href="/about">About RafikiHub</Link></li>
            <li><Link href="/team">Our team</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Casting news by email</h2>
          <p className="small">Workshops, open castings and advice. One email a month.</p>
          <LeadForm
            endpoint="/api/newsletter"
            compact
            submitLabel="Subscribe"
            successMessage="You're subscribed. Look out for our next email."
            fields={[{ name: "email", label: "Email address", type: "email", required: true, autoComplete: "email" }]}
          />
        </div>
      </div>
      <div className="wrap site-footer__base">
        <p>© {year} {site.name}. All rights reserved.</p>
        <a href={site.social.facebook} rel="me noopener" target="_blank">Facebook</a>
      </div>
    </footer>
  );
}
