import type { Faq } from "@/lib/data";

/** Native <details> so answers are in the HTML for search engines and AI crawlers, and work without JS. */
export function FaqList({ items, headingLevel = 3 }: { items: Pick<Faq, "q" | "a">[]; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary><H>{f.q}</H></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
