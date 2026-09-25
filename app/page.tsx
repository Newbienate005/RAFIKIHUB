import Link from "next/link";
import { ContactSheet } from "@/components/ContactSheet";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { memberTypes, castingSteps, faqs, testimonials } from "@/lib/data";
import { images } from "@/lib/images";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const homeFaqs = faqs.slice(0, 5);

export default function Home() {
  const featuredIndex = testimonials.findIndex((t) => t.name === "Olivia Makena Makau");
  const [featured, ...rest] = [testimonials[featuredIndex], ...testimonials.filter((t, i) => i !== featuredIndex && t.message.length > 20)];
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      <section className="hero">
        <div className="wrap hero__grid">
          <div>
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

      <section className="section" aria-label="Choose your path">
        <div className="wrap paths">
          <article className="path">
            <div className="path__media">
              <Photo src={images.sections.performers} alt="RafikiHub performers at a workshop" label="Performers" />
            </div>
            <h2>For performers</h2>
            <p>Be seen by the industry and apply for professional work.</p>
            <ul>
              <li>A full profile with headshots, credits, showreels and voice clips</li>
              <li>Castings sent to you when you match a role</li>
              <li>Workshops, mentoring and headshot sessions</li>
              <li>A route to agent representation with RafikiHub Talent Management</li>
            </ul>
            <Link href="/join" className="btn btn--ink">Join as talent</Link>
          </article>
          <article className="path">
            <div className="path__media">
              <Photo src={images.sections.casting} alt="A casting session in Nairobi" label="Casting" />
            </div>
            <h2>For casting professionals</h2>
            <p>Access a large database of performers and cast your projects with ease.</p>
            <ul>
              <li>Post breakdowns straight to registered agents and talent</li>
              <li>Search profiles by look, skills, age and experience</li>
              <li>Review every submission in one place</li>
              <li>Local support from a team that knows the Kenyan industry</li>
            </ul>
            <Link href="/casting" className="btn btn--ink">Post a casting</Link>
          </article>
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

      <section className="section--tight" aria-labelledby="pets">
        <div className="wrap pet">
          <div className="pet__media">
            <Photo src={images.sections.petModel} alt="A trained dog on set as a pet model" label="Pet model" sizes="360px" />
          </div>
          <div className="measure">
            <h2 id="pets">Could your pet be the next star?</h2>
            <p>
              Productions sometimes need animals with a specific breed, look or character for shoots, commercials,
              TV and film. If your pet is well trained, register them as a pet model and submit them for castings.
            </p>
            <Link href="/join" className="btn btn--ink">Register a pet model</Link>
          </div>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="voices">
        <div className="wrap">
          <h2 id="voices" className="sr-only">What members say</h2>
          <figure className="quote quote--big">
            <blockquote>“{featured.message}”</blockquote>
            <figcaption>
              <span className="quote__face"><Photo src={featured.image ?? undefined} alt="" label={featured.name} sizes="44px" /></span>
              <span><cite>{featured.name}</cite><span className="role">{featured.category}</span></span>
            </figcaption>
          </figure>
          <div className="quotes">
            {rest.map((t) => (
              <figure className="quote" key={t.name}>
                <blockquote>“{t.message}”</blockquote>
                <figcaption>
                  <span className="quote__face"><Photo src={t.image ?? undefined} alt="" label={t.name} sizes="44px" /></span>
                  <span><cite>{t.name}</cite><span className="role">{t.category}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq">
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
          <h2>Serious about a career in the arts? Start with a profile.</h2>
          <p>Choose a membership, build your profile and start applying for work.</p>
          <div className="btn-row">
            <Link href="/join" className="btn btn--sun">Join as talent</Link>
            <Link href="/contact" className="btn btn--ghost">Ask us a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
