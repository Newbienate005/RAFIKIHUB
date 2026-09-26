import Link from "next/link";
import type { Article } from "@/lib/data";
import { badgeDate, readMinutes, shortDate } from "@/lib/dates";
import { Photo } from "./Photo";

/** Blog card modelled on the old site: image with date badge, title, "issued by" line, read more. */
export function ArticleCard({ article, featured = false, headingLevel = 3 }: { article: Article; featured?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const badge = badgeDate(article.publishedAt);
  return (
    <article className={featured ? "card card--featured" : "card"}>
      <Link href={`/blog/${article.url}`} className="card__media" tabIndex={-1} aria-hidden="true">
        <Photo
          src={article.image ?? undefined}
          alt=""
          label={article.title}
          sizes={featured ? "(max-width: 860px) 100vw, 640px" : "(max-width: 640px) 100vw, 380px"}
        />
        <span className="card__badge">
          <span className="card__day">{badge.day}</span>
          <span className="card__month">{badge.month}</span>
        </span>
      </Link>
      <div className="card__body">
        <p className="card__genre">{article.genre}</p>
        <H className="card__title">
          <Link href={`/blog/${article.url}`}>{article.title}</Link>
        </H>
        <p className="card__excerpt">{article.excerpt}</p>
        <p className="card__meta">
          By {article.author} · <time dateTime={article.publishedAt}>{shortDate(article.publishedAt)}</time> · {readMinutes(article.content)} min read
        </p>
        <Link href={`/blog/${article.url}`} className="card__more" aria-label={`Read more: ${article.title}`}>
          Read more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
