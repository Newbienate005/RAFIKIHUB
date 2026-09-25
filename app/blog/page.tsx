import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { articles } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "News and advice for performers",
  description: "Practical advice for actors and performers in Kenya: headshots, auditions, how casting works and member stories from RafikiHub.",
  path: "/blog",
});

const fmt = (d: string) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <PageHeader title="News and advice" lead="Practical help for building a career in the performing arts." crumbs={[{ name: "Advice", path: "/blog" }]} />
      <section className="section">
        <div className="wrap">
          <ul className="posts">
            {sorted.map((a) => (
              <li key={a.url}>
                <time dateTime={a.publishedAt}>{fmt(a.publishedAt)}</time>
                <div>
                  <h2><Link href={`/blog/${a.url}`}>{a.title}</Link></h2>
                  <p>{a.excerpt}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
