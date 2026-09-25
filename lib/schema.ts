import { site } from "./site";
import type { Article, Faq, TeamMember } from "./data";

const orgId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": orgId,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    founder: { "@type": "Person", name: site.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: [
      { "@type": "Country", name: "Kenya" },
      { "@type": "Place", name: "East Africa" },
      { "@type": "Continent", name: "Africa" },
    ],
    knowsAbout: ["Casting", "Talent management", "Acting", "Performing arts", "Film and television casting in Kenya"],
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

export function faqSchema(items: Faq[]) {
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    ...(post.image ? { image: `${site.url}${post.image}` } : {}),
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: { "@id": orgId },
    mainEntityOfPage: `${site.url}/blog/${post.url}`,
    inLanguage: "en-KE",
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
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.position,
    ...(p.image ? { image: `${site.url}${p.image}` } : {}),
    description: p.bio[0],
    worksFor: { "@id": orgId },
    alumniOf: [
      { "@type": "EducationalOrganization", name: "Lewisham College" },
      { "@type": "EducationalOrganization", name: "Arts Educational Schools, London" },
    ],
  };
}
