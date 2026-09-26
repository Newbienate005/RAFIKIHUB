import { site } from "./site";
import manifest from "./image-manifest.json";
import type { Article, Faq, TalentProfile, TeamMember } from "./data";

export const orgId = `${site.url}/#organization`;
const available = new Set<string>(manifest as string[]);

/** Absolute URL for an image, but only if the local file exists (or it's already absolute). */
export function absImage(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return available.has(src) ? `${site.url}${src}` : undefined;
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    founder: { "@type": "Person", "@id": `${site.url}/team#${slugify(site.founder)}`, name: site.founder },
    slogan: "Get seen. Get cast.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.building}, ${site.address.street}, ${site.address.area}`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    legalName: site.legalName,
    areaServed: [
      { "@type": "Country", name: "Kenya" },
      { "@type": "Place", name: "East Africa" },
      { "@type": "Continent", name: "Africa" },
    ],
    knowsAbout: ["Casting", "Talent management", "Acting", "Performing arts", "Film and television casting in Kenya", "Auditions in Nairobi", "African film and theatre"],
    sameAs: Object.values(site.social),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer support", email: site.email, telephone: site.phone, areaServed: "KE", availableLanguage: ["English", "Swahili"] },
      { "@type": "ContactPoint", contactType: "talent representation", email: site.talentEmail },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.tagline,
    publisher: { "@id": orgId },
    inLanguage: "en-KE",
  };
}

export function faqSchema(items: Pick<Faq, "q" | "a">[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path}`,
    })),
  };
}

export function articleSchema(post: Article) {
  const url = `${site.url}/blog/${post.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${site.url}/blog#blog` },
    articleSection: post.genre,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: [absImage(post.image) ?? `${site.url}/opengraph-image`],
    author: post.author === site.name
      ? { "@type": "Organization", "@id": orgId, name: site.name, url: site.url }
      : { "@type": "Person", name: post.author },
    publisher: { "@id": orgId },
    wordCount: post.content.reduce((n, b) => n + b.text.split(/\s+/).length, 0),
    inLanguage: "en-KE",
  };
}

export function blogSchema(items: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/blog#blog`,
    name: "RafikiHub Blog",
    url: `${site.url}/blog`,
    publisher: { "@id": orgId },
    inLanguage: "en-KE",
    blogPost: items.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.publishedAt,
      url: `${site.url}/blog/${a.url}`,
      articleSection: a.genre,
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site.url}${path}`,
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "Kenya" },
  };
}

export function personSchema(p: TeamMember) {
  const image = absImage(p.image);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/team#${slugify(p.name)}`,
    name: p.name,
    jobTitle: p.position,
    url: `${site.url}/team`,
    ...(image ? { image } : {}),
    description: p.bio[0],
    worksFor: { "@id": orgId },
    ...(p.alumniOf?.length ? { alumniOf: p.alumniOf.map((name) => ({ "@type": "EducationalOrganization", name })) } : {}),
    ...(p.profileUrl ? { sameAs: [`${site.url}/profile/${p.profileUrl}`] } : {}),
  };
}

/** The Nairobi office, for /locations and /contact. Add geo and opening hours once confirmed; don't guess them. */
export function localBusinessSchema() {
  const a = site.address;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#nairobi-office`,
    name: `${site.name} Nairobi`,
    parentOrganization: { "@id": orgId },
    url: `${site.url}/locations`,
    image: `${site.url}/opengraph-image`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.building}, ${a.street}`,
      addressLocality: `${a.area}, ${a.city}`,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.building}, ${a.area}, ${a.city}, ${a.countryName}`)}`,
    areaServed: [{ "@type": "City", name: "Nairobi" }, { "@type": "Country", name: "Kenya" }, { "@type": "Continent", name: "Africa" }],
    priceRange: "KES 250–2,500",
  };
}

export function profilePageSchema(p: TalentProfile, updatedAt?: Date) {
  const url = `${site.url}/profile/${p.profileUrl}`;
  const image = absImage(p.media.headshots[0]);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": url,
    url,
    name: `${p.fullName}, ${p.category}`,
    inLanguage: "en-KE",
    isPartOf: { "@id": `${site.url}/#website` },
    ...(updatedAt ? { dateModified: updatedAt.toISOString() } : {}),
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: p.fullName,
      jobTitle: p.category,
      url,
      ...(p.bio ? { description: p.bio } : {}),
      ...(image ? { image } : {}),
      ...(p.cities[0] ? { homeLocation: { "@type": "Place", name: `${p.cities[0]}, ${p.personalData.country}` } } : {}),
      nationality: p.nationalities.map((n) => ({ "@type": "Country", name: n })),
      knowsLanguage: p.languages,
      ...(p.representedByRafikiHub
        ? { memberOf: { "@type": "Organization", name: "RafikiHub Talent Management", url: `${site.url}/talent-management`, parentOrganization: { "@id": orgId } } }
        : {}),
    },
  };
}
