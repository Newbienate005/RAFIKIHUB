import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { NameChecker } from "@/components/NameChecker";
import { PageHeader } from "@/components/PageHeader";
import { images } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "RafikiHub Resources: tools and guides for performers",
  description: "RafikiHub Resources: RafikiHub Connect contact listings, career guides, the RafikiHub Online video library, Sio Bahati Services and a free stage name checker.",
  path: "/resources",
});

const cards = [
  { tag: "RafikiHub Connect", title: "Contact listings", text: "Find agents, casting directors and the services performers rely on.", href: "/contact-listings", cta: "Browse contacts" },
  { tag: "Guides", title: "Career and industry guides", text: "Headshots, auditions, how casting works, and building a career in the arts.", href: "/blog", cta: "Read the guides" },
  { tag: "RafikiHub Online", title: "Video library: workshops and masterclasses", text: "Learn from working actors, directors and crew.", href: "/videos", cta: "Watch now" },
  { tag: "Sio Bahati", title: "Headshots, showreels, audition prep", text: "Book the services that get you seen.", href: "/services", cta: "See services" },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader image={images.headers.resources}
        kicker="RafikiHub Resources"
        title={<>Tools built for <em>working creatives</em>.</>}
        lead="Everything a RafikiHub member reaches for, in one place."
        crumbs={[{ name: "RafikiHub Resources", path: "/resources" }]}
      />
      <section className="section">
        <div className="wrap resource-grid">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="resource">
              <span className="card__genre">{c.tag}</span>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              <span className="card__more">{c.cta} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
          <div className="resource resource--wide">
            <span className="card__genre">Free tool</span>
            <h2>Stage Name Checker</h2>
            <p>Every performer profile on RafikiHub needs a unique name. Check yours before you register.</p>
            <NameChecker />
          </div>
        </div>
      </section>
      <CtaBand title="Ready to put these to work?" primary={{ href: "/join", label: "Join RafikiHub" }} />
    </>
  );
}
