import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProfileCard } from "@/components/ProfileCard";
import { Photo } from "@/components/Photo";
import { ageFrom, exampleProfile, formatHeight, formatPlayingAge, show, type TalentProfile } from "@/lib/data";
import { getProfile, getSimilarProfiles } from "@/lib/profiles";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const revalidate = 3600; // refresh profile pages hourly

type Params = { params: Promise<{ url: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { url } = await params;
  const p = await getProfile(url);
  if (!p) return { title: "Profile not found", robots: { index: false } };
  const where = p.cities[0] ?? p.personalData.country;
  const description = `${p.fullName}, ${p.category.toLowerCase()} based in ${where}. ${p.bio ?? "View headshots, credits, skills and showreel on RafikiHub."}`.slice(0, 160);
  return {
    title: `${p.fullName}, ${p.category}`,
    description,
    alternates: { canonical: `/profile/${p.profileUrl}` },
    openGraph: { title: `${p.fullName} | RafikiHub`, description, type: "profile", url: `${site.url}/profile/${p.profileUrl}`, images: p.media.headshots[0] ? [p.media.headshots[0]] : undefined },
    robots: p.profileUrl === exampleProfile.profileUrl ? { index: false } : undefined,
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (<><dt>{label}</dt><dd>{value}</dd></>);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section className="profile-block"><h2>{title}</h2>{children}</section>);
}

export default async function ProfilePage({ params }: Params) {
  const { url } = await params;
  const p = await getProfile(url);
  if (!p) notFound();
  const similar = await getSimilarProfiles(p);
  const m = p.furtherMeasurements;
  const age = ageFrom(p.personalData.dateOfBirth);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.fullName,
    jobTitle: p.category,
    description: p.bio ?? undefined,
    url: `${site.url}/profile/${p.profileUrl}`,
    image: p.media.headshots[0] ? `${site.url}${p.media.headshots[0]}` : undefined,
    nationality: p.nationalities.map((n) => ({ "@type": "Country", name: n })),
    homeLocation: p.cities[0] ? { "@type": "Place", name: p.cities[0] } : undefined,
    knowsLanguage: p.languages,
    ...(p.representedByRafikiHub ? { memberOf: { "@type": "Organization", name: "RafikiHub Talent Management", url: `${site.url}/talent-management` } } : {}),
  };

  return (
    <>
      <JsonLd data={[person, breadcrumbSchema([{ name: "Talent", path: "/talent-management" }, { name: p.fullName, path: `/profile/${p.profileUrl}` }])]} />
      <section className="profile-hero pattern">
        <div className="wrap profile-hero__grid">
          <div className="profile-hero__photo">
            <Photo src={p.media.headshots[0]} alt={`Headshot of ${p.fullName}`} label={p.fullName} sizes="(max-width: 760px) 100vw, 340px" priority />
          </div>
          <div>
            <nav aria-label="Breadcrumb" className="crumbs"><ol><li><Link href="/">Home</Link></li><li><Link href="/talent-management">Talent</Link></li><li><span aria-current="page">{p.fullName}</span></li></ol></nav>
            <p className="kicker">{p.category}{p.representedByRafikiHub ? " · RafikiHub Talent Management" : ""}</p>
            <h1>{p.fullName}</h1>
            <p className="lead">{[p.cities[0], p.personalData.country].filter(Boolean).join(" · ")}</p>
            {p.bio ? <p>{p.bio}</p> : null}
            {p.skills.length ? <ul className="tags">{p.skills.map((s) => <li key={s}>{s}</li>)}</ul> : null}
            <div className="btn-row">
              {p.media.showreelUrl ? <a className="btn btn--sun" href={p.media.showreelUrl} target="_blank" rel="noopener">Watch showreel</a> : null}
              <Link className="btn btn--ink" href={p.representedByRafikiHub ? "/talent-management" : "/contact"}>{p.representedByRafikiHub ? "Contact the agent" : "Get in touch"}</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section">
        <div className="wrap profile-grid">
          <Section title="Personal data">
            <dl className="facts">
              <Row label="Playing age" value={formatPlayingAge(p.personalData.playingAge)} />
              <Row label="Age" value={age ? `${age} years` : "Not available"} />
              <Row label="Height" value={formatHeight(p.personalData.height)} />
              <Row label="Country" value={p.personalData.country} />
              <Row label="Cities" value={show(p.cities.join(", "))} />
              <Row label="Nationalities" value={show(p.nationalities.join(", "))} />
            </dl>
          </Section>
          <Section title="Appearance">
            <dl className="facts">
              <Row label="Appearance" value={show(p.appearance.appearance)} />
              <Row label="Eye colour" value={show(p.appearance.eyeColor)} />
              <Row label="Hair colour" value={show(p.appearance.hairColor)} />
              <Row label="Hair length" value={show(p.appearance.hairLength)} />
              <Row label="Facial hair" value={show(p.appearance.facialHair)} />
              {p.appearanceTraits.map((t) => <Row key={t.trait + t.location} label={t.trait} value={t.location} />)}
            </dl>
          </Section>
          <Section title="Voice">
            <dl className="facts">
              <Row label="Quality" value={show(p.voiceAttributes.voiceQuality)} />
              <Row label="Character" value={show(p.voiceAttributes.voiceCharacter)} />
              <Row label="Low" value={show(p.voiceRange.lowVoice)} />
              <Row label="Medium" value={show(p.voiceRange.mediumVoice)} />
              <Row label="High" value={show(p.voiceRange.highVoice)} />
              <Row label="Languages" value={show(p.languages.join(", "))} />
              <Row label="Accents" value={show(p.accents.join(", "))} />
            </dl>
          </Section>
          <Section title="Measurements">
            <dl className="facts">
              <Row label="Bust / chest" value={show(m.bustChest)} />
              <Row label="Waist" value={show(m.waist)} />
              <Row label="Hips" value={show(m.hips)} />
              <Row label="Inside leg" value={show(m.insideLeg)} />
              <Row label="Weight" value={m.weightKg ? `${m.weightKg} kg` : "Not available"} />
              <Row label="Shoe size" value={show(m.shoeSize)} />
              <Row label="Dress size" value={show(m.dressSize)} />
            </dl>
          </Section>
          {p.credits.length ? (
            <Section title="Credits">
              <table className="credits">
                <thead><tr><th scope="col">Year</th><th scope="col">Production</th><th scope="col">Role</th><th scope="col">Type</th></tr></thead>
                <tbody>{p.credits.map((c) => <tr key={c.year + c.production}><td>{c.year}</td><td>{c.production}{c.director ? <span className="small"> · dir. {c.director}</span> : null}</td><td>{c.role}</td><td>{c.type}</td></tr>)}</tbody>
              </table>
            </Section>
          ) : null}
          {p.training.length ? (
            <Section title="Training">
              <ul className="plain">{p.training.map((t) => <li key={t.institution + t.course}><strong>{t.course}</strong>, {t.institution}{t.year ? ` (${t.year})` : ""}</li>)}</ul>
            </Section>
          ) : null}
          {p.media.headshots.length > 1 ? (
            <Section title="Headshots">
              <ul className="gallery">{p.media.headshots.slice(1).map((h, i) => <li key={h}><Photo src={h} alt={`${p.fullName} headshot ${i + 2}`} label={p.fullName} sizes="200px" /></li>)}</ul>
            </Section>
          ) : null}
          {p.media.voiceoverReelUrl || p.media.documents.length ? (
            <Section title="Voiceover reel and documents">
              <ul className="plain">
                {p.media.voiceoverReelUrl ? <li><a href={p.media.voiceoverReelUrl} target="_blank" rel="noopener">Listen to voiceover reel</a></li> : null}
                {p.media.documents.map((d) => <li key={d.url}><a href={d.url} target="_blank" rel="noopener">{d.name}</a></li>)}
              </ul>
            </Section>
          ) : null}
        </div>
      </div>

      {similar.length ? (
        <section className="section section--white">
          <div className="wrap">
            <h2>More {p.category.toLowerCase()}s</h2>
            <div className="cards">{similar.map((s: TalentProfile) => <ProfileCard key={s.profileUrl} p={s} />)}</div>
          </div>
        </section>
      ) : null}
    </>
  );
}
