import { ArticleCard } from "@/components/ArticleCard";
import { BlogFilter } from "@/components/BlogFilter";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { articleGenres, articles } from "@/lib/data";
import { blogSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Blog: news, reviews and advice for performers in Kenya",
  description:
    "The RafikiHub blog: theatre and film reviews, member stories, and practical advice on headshots, auditions and casting for actors and performers in Kenya.",
  path: "/blog",
});

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [latest, ...rest] = sorted;
  return (
    <>
      <JsonLd data={blogSchema(sorted)} />
      <PageHeader
        kicker="Our blog"
        title={<>From the <em>community</em></>}
        lead="News, reviews, member stories and advice from Kenya's performing arts scene."
        crumbs={[{ name: "Blog", path: "/blog" }]}
      />
      <section className="section">
        <div className="wrap">
          <h2 className="eyebrow">Latest</h2>
          <ArticleCard article={latest} featured headingLevel={2} />
        </div>
      </section>
      <section className="section section--white" aria-labelledby="recent">
        <div className="wrap">
          <h2 id="recent">Recent articles</h2>
          <BlogFilter articles={rest} genres={[...articleGenres]} />
        </div>
      </section>
    </>
  );
}
