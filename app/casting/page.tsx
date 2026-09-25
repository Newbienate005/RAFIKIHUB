import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { castingSteps } from "@/lib/data";
import { serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

const description =
  "Post a casting breakdown on RafikiHub and reach actors, models, performers and agents across Kenya and Africa. Review every submission in one place and invite your shortlist to audition.";

export const metadata = pageMeta({ title: "Post a casting call in Kenya", description, path: "/casting" });

export default function CastingPage() {
  return (
    <>
      <JsonLd data={serviceSchema("Casting breakdown distribution", description, "/casting")} />
      <PageHeader
        title="Cast your next project"
        lead="Send your breakdown to registered agents and talent across Kenya and Africa, then review every submission in one place."
        crumbs={[{ name: "Cast a project", path: "/casting" }]}
      />
      <section className="section">
        <div className="wrap form-wrap">
          <div>
            <h2>How it works</h2>
            <ol className="steps" style={{ gridTemplateColumns: "1fr", marginTop: "1.5rem" }}>
              {castingSteps.map((s) => (
                <li key={s.title}><h3>{s.title}</h3><p>{s.text}</p></li>
              ))}
            </ol>
            <p style={{ marginTop: "2rem" }}>
              Every performer has a searchable profile with headshots, credits, showreels, voice clips and skills.
              Casting information stays private to RafikiHub members.
            </p>
          </div>
          <div className="panel">
            <h2>Send us your breakdown</h2>
            <p className="small">We'll confirm the details with you before it goes out to talent.</p>
            <LeadForm
              endpoint="/api/casting"
              submitLabel="Send breakdown"
              successMessage="Breakdown received. We'll be in touch shortly to confirm the details before it goes out."
              fields={[
                { name: "company", label: "Production company", required: true, autoComplete: "organization" },
                { name: "contactName", label: "Your name", required: true, autoComplete: "name", half: true },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", half: true },
                { name: "projectType", label: "Project type", type: "select", required: true, half: true, options: ["Feature film", "TV series", "Short film", "Commercial", "Theatre", "Music video", "Photo shoot", "Voice-over", "Other"] },
                { name: "projectTitle", label: "Project title", required: true, hint: "A working title is fine." },
                { name: "shootDates", label: "Audition and shoot dates", half: true },
                { name: "location", label: "Location", half: true },
                { name: "details", label: "Roles and requirements", type: "textarea", required: true, hint: "Character names, age ranges, looks, skills, pay and any usage terms." },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
