import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { images } from "@/lib/images";
import { serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "RafikiHub Talent Management represents a select group of actors in Kenya across film, television, theatre, radio and commercials, with formal contracts, fair pay and career support.";

export const metadata = pageMeta({ title: "Talent management and agent representation in Kenya", description, path: "/talent-management" });

export default function TalentManagementPage() {
  return (
    <>
      <JsonLd data={serviceSchema("RafikiHub Talent Management", description, "/talent-management")} />
      <PageHeader
        title="Looking for an agent? RafikiHub Talent Management"
        lead="We represent a select group of actors of all ages across radio, theatre, commercials, film and television."
        crumbs={[{ name: "Talent management", path: "/talent-management" }]}
      />
      <section className="section">
        <div className="wrap split">
          <div className="path__media" style={{ aspectRatio: "4 / 5" }}>
            <Photo src={images.sections.talentManagement} alt="RafikiHub Talent Management actors" label="Talent management" />
          </div>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>How we work with our artists</h2>
            <p>
              Because we keep our roster small, we know each artist's strengths and work closely with them to help
              them reach their full potential. We protect our artists' rights and make sure they're paid fairly and
              treated with respect.
            </p>
            <h3>What representation means</h3>
            <ul>
              <li>A formal contract that sets out what each side can expect, including the commission on each job</li>
              <li>Submissions to roles that suit you, through RafikiHub and our industry contacts</li>
              <li>Negotiation of fees and terms on your behalf</li>
              <li>Ongoing guidance on headshots, showreels, training and career direction</li>
            </ul>
            <h3>Book a meeting</h3>
            <p>
              We'd like to understand how we can serve you. Email{" "}
              <a href={`mailto:${site.talentEmail}`}>{site.talentEmail}</a> with your headshot, CV and showreel link.
            </p>
            <div className="btn-row">
              <a className="btn btn--ink" href={`mailto:${site.talentEmail}?subject=Representation%20enquiry`}>Email the talent team</a>
              <Link className="btn btn--ghost" href="/join">Join RafikiHub first</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
