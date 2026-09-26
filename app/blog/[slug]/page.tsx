import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { articles } from "@/lib/data";
import { longDate, readMinutes } from "@/lib/dates";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
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
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: article.publishedAt, section: article.genre },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = find(slug);
  if (!article) notFound();

  const more = articles
    .filter((a) => a.url !== article.url)
    .sort((a, b) => Number(b.genre === article.genre) - Number(a.genre === article.genre) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={[articleSchema(article), breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: article.title, path: `/blog/${article.url}` }])]} />
      <article>
        <header className="post-header">
          <div className="wrap post-header__inner">
            <nav aria-label="Breadcrumb" className="crumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><span aria-current="page">{article.genre}</span></li>
              </ol>
            </nav>
            <h1>{article.title}</h1>
            <p className="post-meta">
              By {article.author} <span aria-hidden="true">|</span> {article.genre} ·{" "}
              <time dateTime={article.publishedAt}>{longDate(article.publishedAt)}</time> · {readMinutes(article.content)} min read
            </p>
          </div>
        </header>
        <div className="wrap post-cover">
          <div className="post-cover__frame">
            <Photo src={article.image ?? undefined} alt={article.title} label={article.title} sizes="(max-width: 900px) 100vw, 900px" priority />
          </div>
        </div>
        <div className="section section--post">
          <div className="wrap post-body">
            <div className="prose">
            <p className="lead">{article.excerpt}</p>
            {article.content.map((b, i) => (
              <div key={i}>
                {b.heading ? <h2>{b.heading}</h2> : null}
                <p>{b.text}</p>
              </div>
            ))}
            <p style={{ marginTop: "3rem" }}><Link href="/blog">← Back to the blog</Link></p>
            </div>
          </div>
        </div>
      </article>
      {more.length ? (
        <section className="section section--white" aria-labelledby="more">
          <div className="wrap">
            <h2 id="more">More from the blog</h2>
            <div className="cards">
              {more.map((a) => <ArticleCard key={a.url} article={a} />)}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
