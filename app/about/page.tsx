import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { images } from "@/lib/images";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About RafikiHub, Kenya's casting platform",
  description:
    "RafikiHub connects performers with roles in theatre, TV and film, and boosts the showcase of Kenyan, East African and African talent. Founded in Nairobi by actress Kate Snow.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Bringing the industry together"
        lead="Our mission is to create easy links between artists and industry professionals, while boosting the showcase of Kenyan, East African and African talent."
        crumbs={[{ name: "About", path: "/about" }]}
      />
      <section className="section">
        <div className="wrap split">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>What we do</h2>
            <p>
              RafikiHub connects performers with roles in theatre, television and film. Casting professionals use
              RafikiHub because our members are known for being dedicated and committed to their careers.
            </p>
            <p>
              Alongside our partners in Africa, we believe in global casting, a fair chance for everyone, and finding
              the right performer for the job wherever they are. We also run workshops, mentoring, headshot sessions
              and talent management, and have worked with production companies from the UK, the US and South Africa.
            </p>
            <h2>The people behind it</h2>
            <p>
              "RafikiHubbers" are a diverse group, all passionate about television, film, theatre and the arts. Nothing
              beats seeing a member land their first job, a young performer go to their first audition, or a
              long-standing member book the role they've been working towards.
            </p>
            <p>
              RafikiHub was founded by actress <Link href="/team">Kate Snow</Link> after she returned to Kenya from
              London in 2017.
            </p>
            <h2>Talk to us</h2>
            <p>
              Questions about membership? Call <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> or email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
          <div className="path__media" style={{ aspectRatio: "4 / 5" }}>
            <Photo src={images.sections.workshop} alt="A RafikiHub acting workshop in Nairobi" label="Workshop" />
          </div>
        </div>
      </section>
    </>
  );
}
