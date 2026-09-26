import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { team } from "@/lib/data";
import { personSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Our team",
  description: "Meet the team behind RafikiHub, led by founder and CEO Kate Snow, a London-trained actress working in Kenya.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <JsonLd data={team.map(personSchema)} />
      <PageHeader kicker="Our team" title={<>The team behind <em>RafikiHub</em></>} lead="Performers and industry people who know what it takes to build a career in the arts." crumbs={[{ name: "Team", path: "/team" }]} />
      <section className="section">
        <div className="wrap">
          {team.map((p) => (
            <article className="person" key={p.name}>
              <div className="person__photo">
                <Photo src={p.image ?? undefined} alt={`${p.name}, ${p.position} of RafikiHub`} label={p.name} sizes="320px" />
              </div>
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>{p.name}</h2>
                <p className="person__role">{p.position}</p>
                {p.bio.map((b) => <p key={b.slice(0, 20)}>{b}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand kicker="We're hiring" title="Want to help us build?" text="We're always looking for people who understand the performing arts in Africa. Tell us what you'd bring." primary={{ href: "/contact", label: "Get in touch" }} />
    </>
  );
}
