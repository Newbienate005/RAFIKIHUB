import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { getContent } from "@/lib/content";
import { personSchema, slugify } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Our team",
  description: "Meet the team behind RafikiHub: founder and CEO Kate Snow, director and talent manager Michael Scott and website consultant Nathan Obwaka.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getContent("team");
  return (
    <>
      <JsonLd data={team.map(personSchema)} />
      <PageHeader kicker="Our team" title={<>The team behind <em>RafikiHub</em></>} lead="Performers and industry people who know what it takes to build a career in the arts." crumbs={[{ name: "Team", path: "/team" }]} />
      <section className="section">
        <div className="wrap team-list">
          {team.map((p, i) => (
            <article className="person" key={p.name} id={slugify(p.name)}>
              <div className="person__photo">
                <Photo src={p.image ?? undefined} alt={`${p.name}, ${p.position} of RafikiHub`} label={p.name} sizes="(max-width: 760px) 80vw, 360px" />
              </div>
              <div className="prose person__body">
                <span className="person__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <p className="person__role">{p.position}</p>
                <h2>{p.name}</h2>
                {p.bio.map((b) => <p key={b.slice(0, 20)}>{b}</p>)}
                {p.linkedin ? <p><a className="link-strong" href={p.linkedin} target="_blank" rel="noopener">{p.name.split(" ")[0]} on LinkedIn →</a></p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand kicker="We're hiring" title="Want to help us build?" text="We're always looking for people who understand the performing arts in Africa. Tell us what you'd bring." primary={{ href: "/contact", label: "Get in touch" }} />
    </>
  );
}
