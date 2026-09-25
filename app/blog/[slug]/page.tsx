import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { articles } from "@/lib/data";
import { articleSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

const find = (slug: string) => articles.find((a) => a.url === slug);

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.url }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = find(slug);
  if (!article) return {};
  const meta = pageMeta({ title: article.title, description: article.excerpt, path: `/blog/${article.url}` });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: article.publishedAt } };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = find(slug);
  if (!article) notFound();
  return (
    <>
      <JsonLd data={articleSchema(article)} />
      <PageHeader
        title={article.title}
        lead={article.excerpt}
        crumbs={[{ name: "Advice", path: "/blog" }, { name: article.title, path: `/blog/${article.url}` }]}
      />
      <article className="section">
        <div className="wrap prose">
          <p className="small">
            By {article.author},{" "}
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </p>
          {article.content.map((b, i) => (
            <div key={i}>
              {b.heading ? <h2>{b.heading}</h2> : null}
              <p>{b.text}</p>
            </div>
          ))}
          <p style={{ marginTop: "3rem" }}><Link href="/blog">More advice</Link></p>
        </div>
      </article>
    </>
  );
}
