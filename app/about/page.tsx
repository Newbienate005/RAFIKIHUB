import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { Photo } from "@/components/Photo";
import { images } from "@/lib/images";
import { timeline, timelineClosing } from "@/lib/data";
import { getContent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About RafikiHub, Kenya's casting platform",
  description:
    "RafikiHub connects performers with roles in theatre, TV and film, and boosts the showcase of Kenyan, East African and African talent. Founded in Nairobi by actress Kate Snow.",
  path: "/about",
});

export default async function AboutPage() {
  const team = await getContent("team");
  return (
    <>
      <PageHeader image={images.headers.about}
        kicker="About us"
        title={<>Bringing the industry <em>together</em></>}
        lead="Our mission is to create easy links between artists and industry professionals, while boosting the showcase of Kenyan, East African and African talent."
        crumbs={[{ name: "About", path: "/about" }]}
      />
      <section className="section">
        <div className="wrap split">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>What we do</h2>
            <p>
              RafikiHub serves as a central platform for the performing arts, focused on fostering talent by providing
              educational and career development tools, while linking performers with opportunities in theatre,
              television and film. We empower performers to showcase their abilities through dynamic profiles, reaching
              a global network of casting directors and project creators. Our goal is to support talent discovery and
              contribute to the ongoing vitality of stages and screens around Africa and beyond.
            </p>
            <h2>Who we are</h2>
            <p>
              "RafikiHubbers" are a diverse and passionate community, all united by a love for the creative arts.
              There's nothing more rewarding than watching one of our members land their first job, seeing our youngest
              members secure their first audition, or celebrating a long-time member receiving an award. These moments
              are what drive us.
            </p>
            <p>
              With a deep understanding of the industry, we use our expertise to support and guide our members. We're
              fuelled by the desire to bring people together, and we're always looking for new ways to help our community
              connect and thrive. RafikiHub was founded by actress <Link href="/team">Kate Snow</Link> after she returned
              to Kenya from London in 2017.
            </p>
            <h2>Who we collaborate with</h2>
            <p>
              We partner with organisations that are truly making an impact in the performing arts. Some have been part of
              the industry as long as we have, while others are newer to the scene. Whatever their journey, we take pride
              in working with all of them to help shape and grow the industry. <Link href="/#partners">See who we've worked with</Link>.
            </p>
            <h2>What can I expect when I join?</h2>
            <p>
              We're always here to help. Find out <Link href="/membership">what's included in your membership</Link>, or if
              you have any questions, call <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a> or email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
          <div className="path__media" style={{ aspectRatio: "4 / 5" }}>
            <Photo src={images.sections.workshop} alt="A RafikiHub acting workshop in Nairobi" label="Workshop" />
          </div>
        </div>
      </section>
      <section className="section section--white" aria-labelledby="journey-title" id="journey">
        <div className="wrap timeline-wrap">
          <p className="kicker">Our story</p>
          <h2 id="journey-title">RafikiHub: our journey</h2>
          <ol className="timeline">
            {timeline.map((t) => (
              <li key={t.title}>
                <span className="timeline__year">{t.year}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p className="timeline__tagline">{t.tagline}</p>
                  {t.body.map((b) => <p key={b.slice(0, 24)}>{b}</p>)}
                </div>
              </li>
            ))}
          </ol>
          <p className="timeline__closing">{timelineClosing}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="leaders">
        <div className="wrap">
          <div className="section-head">
            <div><p className="kicker">Leadership</p><h2 id="leaders">Meet the team</h2></div>
            <Link href="/team" className="link-strong">View full team →</Link>
          </div>
          <ul className="team-strip">
            {team.map((m) => (
              <li key={m.name}>
                <span className="team-strip__photo"><Photo src={m.image ?? undefined} alt={m.name} label={m.name} sizes="96px" /></span>
                <strong>{m.name}</strong>
                <span className="small">{m.position}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Come build it with us." primary={{ href: "/join", label: "Join the Hub" }} secondary={{ href: "/contact", label: "Talk to us" }} />
    </>
  );
}
