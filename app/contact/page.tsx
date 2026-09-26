import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact RafikiHub",
  description: `Contact RafikiHub in Nairobi. Email ${site.email} or call ${site.phoneDisplay}. For agent representation, email ${site.talentEmail}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader kicker="Get in touch" title={<>Contact <em>us</em></>} lead="We're always here to help with membership, castings and representation." crumbs={[{ name: "Contact", path: "/contact" }]} />
      <section className="section">
        <div className="wrap form-wrap">
          <div>
            <h2>Reach us directly</h2>
            <ul className="contact-list">
              <li><strong>General enquiries</strong><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><strong>Phone</strong><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></li>
              <li><strong>Agent representation</strong><a href={`mailto:${site.talentEmail}`}>{site.talentEmail}</a></li>
              <li><strong>Visit us</strong><span>{site.address.building}, {site.address.street}, {site.address.area}, {site.address.city}</span></li>
            </ul>
          </div>
          <div className="panel">
            <h2>Send a message</h2>
            <LeadForm
              endpoint="/api/contact"
              submitLabel="Send message"
              successMessage="Message sent. We'll reply by email within two working days."
              fields={[
                { name: "fullName", label: "Name", required: true, autoComplete: "name", half: true },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "topic", label: "What's it about?", type: "select", required: true, options: ["Membership", "Posting a casting", "Talent management", "Workshops", "Partnerships", "Something else"] },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
