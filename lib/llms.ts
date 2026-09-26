import { articles, castingSteps, faqs, memberTypes, membershipIncludes, pageFaqs, perMonth, plans, services, videos } from "./data";
import { site } from "./site";

const u = (p: string) => `${site.url}${p}`;
const ksh = (n: number) => `Ksh ${n.toLocaleString("en-KE")}`;

/** Summary block shared by llms.txt and llms-full.txt (llmstxt.org format: H1, blockquote, plain facts, then link lists). */
function header() {
  const a = site.address;
  return `# RafikiHub

> ${site.description}

RafikiHub (${site.legalName}) was founded by actress ${site.founder} and has ${site.memberCount} members, including agents and casting professionals. "Rafiki" is Swahili for "friend".

- Office: ${a.building}, ${a.street}, ${a.area}, ${a.city}, ${a.countryName}. Serves Kenya, East Africa, the rest of Africa and international productions.
- Membership: ${plans.map((p) => `${p.name} ${ksh(p.priceKsh)} ${p.label}`).join("; ")}. Every plan includes the same full membership.
- Who can join: actors and performers, young performers aged 4 to 18 (registered by a parent or guardian), agents, casting directors, brands and event organisers, and crew.
- Contact: ${site.email}, ${site.phoneDisplay}. Agent representation: ${site.talentEmail}.
`;
}

export function llmsTxt() {
  return `${header()}
## For performers
- [Join as talent](${u("/join")}): apply for membership and build a profile with headshots, credits, showreels and skills
- [Membership options](${u("/membership")}): plans and prices in Kenyan shillings, compared side by side
- [Sio Bahati Services](${u("/services")}): headshots, showreels and audition preparation in Nairobi
- [Talent management](${u("/talent-management")}): RafikiHub's agency for a select group of actors in Kenya

## For casting professionals
- [Post a casting](${u("/casting")}): send a breakdown to registered agents and talent across Kenya and Africa
- [Contact listings](${u("/contact-listings")}): directory of agents, casting directors and industry services

## Help
- [FAQ](${u("/faq")}): how casting works, applying for roles, headshots, membership and confidentiality
- [How casting works on RafikiHub](${u("/blog/how-casting-works-on-rafikihub")}): step-by-step guide from breakdown to audition
- [Contact](${u("/contact")}): email, phone, office address and contact form

## Blog
${articles.map((x) => `- [${x.title}](${u(`/blog/${x.url}`)}): ${x.excerpt}`).join("\n")}

## Optional
- [About](${u("/about")}): mission, history and timeline
- [Team](${u("/team")}): founder and CEO ${site.founder}
- [Locations](${u("/locations")}): Nairobi headquarters and where RafikiHub works
- [Resources](${u("/resources")}): Resource Hub and free stage name checker
${videos.length ? `- [Video Library](${u("/videos")}): free workshops and masterclasses\n` : ""}- [Full text for LLMs](${u("/llms-full.txt")}): all FAQs, plans, services and articles in one file
`;
}

export function llmsFullTxt() {
  const qa = [...faqs, ...Object.values(pageFaqs).flat()];
  const seen = new Set<string>();
  const uniqueQa = qa.filter((f) => (seen.has(f.q) ? false : (seen.add(f.q), true)));
  return `${header()}
## FAQ

${uniqueQa.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Membership plans

${plans.map((p) => `- ${p.name}: ${ksh(p.priceKsh)} ${p.label} (about ${ksh(perMonth(p))} a month)`).join("\n")}

Every plan includes:
${membershipIncludes.map((m) => `- ${m}`).join("\n")}

## Who can join

${memberTypes.map((m) => `### ${m.name}\n\n${m.tagline}`).join("\n\n")}

## Sio Bahati Services (Swahili for "it's not luck")

${services.map((s) => `### ${s.name}\n\n${s.summary}\n\n${s.includes.map((i) => `- ${i}`).join("\n")}`).join("\n\n")}

## How casting works

${castingSteps.map((s, i) => `${i + 1}. ${s.title}. ${s.text}`).join("\n")}

## Talent management

RafikiHub Talent Management represents a select group of actors of all ages in Kenya across film, television, theatre, radio and commercials.
- A formal contract that sets out what each side can expect, including the commission on each job
- Submissions to roles that suit the artist, through RafikiHub and its industry contacts
- Negotiation of fees and terms on the artist's behalf
- Ongoing guidance on headshots, showreels, training and career direction
Apply by emailing ${site.talentEmail} with a headshot, CV and showreel link.

## Articles

${articles
  .map((a) => `### ${a.title}\n\nURL: ${u(`/blog/${a.url}`)}\nPublished: ${a.publishedAt}\nBy: ${a.author}\n\n${a.content.map((b) => (b.heading ? `#### ${b.heading}\n\n${b.text}` : b.text)).join("\n\n")}`)
  .join("\n\n")}
`;
}
