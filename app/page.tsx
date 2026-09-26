import Link from "next/link";
import { ContactSheet } from "@/components/ContactSheet";
import { ArticleCard } from "@/components/ArticleCard";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/Testimonials";
import { Photo } from "@/components/Photo";
import { articles, castingSteps, faqs, homePaths, memberTypes, partners, testimonials, timeline } from "@/lib/data";
import { images } from "@/lib/images";
import { shortDate } from "@/lib/dates";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const homeFaqs = faqs.slice(0, 5);
const latestArticles = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);

export default function Home() {
  const quotes = testimonials.filter((t) => t.message.length > 20);
  const [lead, ...briefs] = latestArticles;
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="hero">
        <div className="wrap hero__grid">
          <div>
            <p className="kicker">Africa's performing arts community</p>
            <h1>
              <span className="line">Get seen.</span>
              <span className="line line--sun">Get cast.</span>
            </h1>
            <p className="lead">
              RafikiHub connects actors, models and performers across Kenya and Africa with the casting
              directors, agents and producers looking for them.
            </p>
            <div className="btn-row">
              <Link href="/join" className="btn btn--sun">Join as talent</Link>
              <Link href="/casting" className="btn btn--ghost">Post a casting</Link>
            </div>
            <p className="hero__proof">
              <strong>{site.memberCount} members</strong>, including agents and casting professionals across
              the continent. Based in Nairobi.
            </p>
          </div>
          <ContactSheet />
        </div>
      </section>

      <section className="section--tight section--white" aria-labelledby="what">
        <div className="wrap answer">
          <h2 id="what">What is RafikiHub?</h2>
          <p>
            RafikiHub is a casting platform in Nairobi, Kenya. Performers build a profile with headshots, credits,
            showreels and skills, then apply for film, TV, theatre and commercial roles. Casting directors post
            breakdowns, search the talent database and shortlist people for audition, all in one place.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="services">
        <div className="wrap split">
          <div>
            <p className="kicker">What we offer</p>
            <h2 id="services">Our services</h2>
            <p className="lead">Three ways in, whichever seat you sit in at the table.</p>
          </div>
          <ol className="numbered">
            {homePaths.map((p, i) => (
              <li key={p.title}>
                <Link href={p.href}>
                  <span className="numbered__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="numbered__body">
                    <span className="numbered__title">{p.title}</span>
                    <span className="numbered__text">{p.text}</span>
                  </span>
                  <span className="numbered__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--paper-2" aria-labelledby="journey">
        <div className="wrap">
          <p className="kicker">Our story</p>
          <h2 id="journey">RafikiHub: our journey</h2>
          <ol className="journey">
            {timeline.map((t, i) => (
              <li key={t.title} className={i === timeline.length - 1 ? "is-now" : undefined}>
                <span className="journey__year">{t.year}</span>
                <span className="journey__title">{t.title}</span>
              </li>
            ))}
          </ol>
          <Link href="/about#journey" className="link-strong">Read our full story →</Link>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="how">
        <div className="wrap">
          <h2 id="how">How casting works on RafikiHub</h2>
          <p className="lead">From breakdown to audition in four steps.</p>
          <ol className="steps">
            {castingSteps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="who">
        <div className="wrap">
          <h2 id="who">Who can join</h2>
          <p className="lead">Anyone working in, or ready to work in, the performing arts and production.</p>
          <dl className="cats">
            {memberTypes.map((c) => (
              <div key={c.key}>
                <dt>{c.name}</dt>
                <dd>{c.tagline}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>


      <section className="section section--white" aria-labelledby="voices">
        <div className="wrap">
          <p className="kicker" id="voices">Happy members</p>
          <Testimonials items={quotes} />
        </div>
      </section>

      <section className="kickoff" aria-labelledby="kickoff">
        <div className="kickoff__media">
          <Photo src={images.sections.workshop} alt="Performers at a RafikiHub workshop in Nairobi" label="Workshop" sizes="(max-width: 860px) 100vw, 50vw" />
        </div>
        <div className="kickoff__body">
          <p className="kicker">Get noticed</p>
          <h2 id="kickoff">Kick-off your career in performing arts</h2>
          <p>RafikiHub is a casting platform built to bring the industry together: a straightforward way for artists and industry professionals to connect, while putting African performing talent in front of the people casting for it.</p>
          <p>If you're serious about a career in the arts, choose a membership option and take the next step.</p>
          <div className="btn-row">
            <Link href="/membership" className="btn btn--sun">See membership options</Link>
            <Link href="/join" className="btn btn--ink">Join now</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="blog">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">News</p>
              <h2 id="blog">Latest news</h2>
            </div>
            <Link href="/blog" className="link-strong">View all posts →</Link>
          </div>
          <div className="news">
            <ArticleCard article={lead} featured />
            <ul className="news__briefs">
              {briefs.map((a) => (
                <li key={a.url}>
                  <Link href={`/blog/${a.url}`} className="brief">
                    <span className="brief__media"><Photo src={a.image ?? undefined} alt="" label={a.title} sizes="96px" /></span>
                    <span>
                      <span className="card__meta">{shortDate(a.publishedAt)} · {a.genre}</span>
                      <span className="brief__title">{a.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {partners.length ? (
        <section className="section--tight partners" aria-labelledby="partners">
          <div className="wrap">
            <h2 id="partners" className="partners__title">Who we've worked with</h2>
            <ul className="partners__list">
              {partners.map((p) => (
                <li key={p.name}>
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.name} height={40} />
                  ) : (
                    <span className="partners__name">{p.name}{p.description ? <span className="small">{p.description}</span> : null}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section section--white" aria-labelledby="faq">
        <div className="wrap split">
          <div>
            <h2 id="faq">Questions performers ask us</h2>
            <p className="lead">Short answers to the most common ones.</p>
            <Link href="/faq">See all questions</Link>
          </div>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <h2>Ready to join RafikiHub?</h2>
          <p>Choose a membership option and become part of Africa's centre of excellence for the performing arts.</p>
          <div className="btn-row">
            <Link href="/join" className="btn btn--sun">Join as talent</Link>
            <Link href="/contact" className="btn btn--ghost">Ask us a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
