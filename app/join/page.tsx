import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { memberTypes, faqs } from "@/lib/data";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Join RafikiHub as an actor, model or performer",
  description:
    "Create your RafikiHub profile and apply for film, TV, theatre and commercial castings in Kenya and Africa. Open to actors, young performers, models, make-up artists, stylists, pet models and agents.",
  path: "/join",
});

const joinFaqs = faqs.filter((f) =>
  ["Who can join RafikiHub?", "What goes on a RafikiHub profile?", "What makes a good acting headshot?", "Can my pet be cast in a commercial or film?", "How should I apply for a role?"].includes(f.q),
);

export default function JoinPage() {
  return (
    <>
      <JsonLd data={faqSchema(joinFaqs)} />
      <PageHeader
        title="Join RafikiHub"
        lead="Tell us about yourself and we'll set up your membership. You'll get a full profile and start receiving castings that match you."
        crumbs={[{ name: "Join", path: "/join" }]}
      />
      <section className="section">
        <div className="wrap form-wrap">
          <div>
            <h2>What you get</h2>
            <ul className="prose">
              <li>A profile with headshots, credits, showreels, voice clips and skills</li>
              <li>Castings from directors across Kenya and Africa</li>
              <li>Invitations to workshops, mentoring and headshot sessions</li>
              <li>The chance to be considered for RafikiHub Talent Management</li>
            </ul>
            <h2 style={{ marginTop: "2.5rem" }}>Membership types</h2>
            <dl className="cats cats--detail">
              {memberTypes.map((m) => (
                <div key={m.key}>
                  <dt>{m.name}</dt>
                  <dd>
                    <ul>{m.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="panel" id="join-form">
            <h2>Apply for membership</h2>
            <p className="small">We'll reply by email within two working days with membership options.</p>
            <LeadForm
              endpoint="/api/join"
              submitLabel="Send my application"
              successMessage="Application sent. We'll email you within two working days with your membership options."
              fields={[
                { name: "fullName", label: "Full name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", half: true, hint: "Include the country code, e.g. +254" },
                { name: "category", label: "I'm joining as", type: "select", required: true, options: memberTypes.map((m) => m.formLabel) },
                { name: "location", label: "Town or city", autoComplete: "address-level2" },
                { name: "message", label: "Experience and training", type: "textarea", hint: "A few lines on your credits, training or what you're looking for." },
              ]}
            />
            <p className="small" style={{ marginTop: "1rem" }}>Registering a performer under 18? A parent or guardian must complete this form.</p>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap split">
          <h2>Before you join</h2>
          <FaqList items={joinFaqs} />
        </div>
      </section>
    </>
  );
}
