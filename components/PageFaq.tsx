import { FaqList } from "./FaqList";
import { JsonLd } from "./JsonLd";
import { faqSchema } from "@/lib/schema";

/** A page's common questions, visible on the page and mirrored as FAQPage schema. */
export function PageFaq({ title = "Common questions", items }: { title?: string; items: { q: string; a: string }[] }) {
  return (
    <section className="section section--white" aria-labelledby="page-faq">
      <JsonLd data={faqSchema(items)} />
      <div className="wrap split">
        <div>
          <p className="kicker">Maswali · Questions</p>
          <h2 id="page-faq">{title}</h2>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}
