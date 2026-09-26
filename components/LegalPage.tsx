import Link from "next/link";
import { PageHeader } from "./PageHeader";

export type LegalSection = { title: string; body: string[] };

export function LegalPage({ title, path, updated, intro, sections, other }: { title: string; path: string; updated: string; intro: string; sections: LegalSection[]; other: { href: string; label: string } }) {
  return (
    <>
      <PageHeader kicker="Legal" title={title} lead={intro} crumbs={[{ name: title, path }]} />
      <section className="section">
        <div className="wrap prose">
          <p className="small">Last updated {updated}</p>
          {sections.map((s) => (
            <div key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((b, i) => <p key={i}>{b}</p>)}
            </div>
          ))}
          <p style={{ marginTop: "3rem" }}><Link href={other.href}>{other.label} →</Link></p>
        </div>
      </section>
    </>
  );
}
