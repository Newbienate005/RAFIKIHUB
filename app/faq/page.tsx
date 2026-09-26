import { PageHeader } from "@/components/PageHeader";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { faqCategories, faqs } from "@/lib/data";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Help and FAQs: casting, auditions and headshots",
  description:
    "Answers to common questions about RafikiHub, casting in Kenya, how to apply for roles, acting headshots and keeping casting information confidential.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHeader kicker="Help & FAQs" title={<>Frequently asked <em>questions</em></>} lead="Straight answers about casting, auditions, headshots and your membership." crumbs={[{ name: "FAQ", path: "/faq" }]} />
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Still need help?</h2>
            <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.</p>
          </div>
          <div className="faq-groups">
            {faqCategories.map((c) => {
              const items = faqs.filter((f) => f.category === c);
              return items.length ? (
                <section key={c} aria-label={c}>
                  <p className="kicker">{c}</p>
                  <FaqList items={items} headingLevel={2} />
                </section>
              ) : null;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
