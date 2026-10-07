import {
  articleGenres, articles, contactListings, faqCategories, faqs, partners, team, testimonials, videos,
  type Article, type ContactListing, type Faq, type Partner, type TeamMember, type Testimonial, type Video,
} from "./data";

/**
 * The sections of the website that can be edited in /admin.
 * Each one lists its form fields once; the admin forms, validation and the conversion between form
 * values and stored data are all driven from here. The built-in content in lib/data.ts is the
 * starting point (the "seed") until a section is copied into the database.
 */

export type FieldType =
  | "text" | "textarea" | "url" | "email" | "date" | "select" | "checkbox" | "image"
  | "slug" // lower-case words joined by hyphens, used in links
  | "youtube" // a YouTube link or id; stored as the id
  | "lines" // string[], one per line
  | "paragraphs" // string[], separated by a blank line
  | "blocks"; // { heading?, text }[]: paragraphs, with "## " starting a new section

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  hint?: string;
};

export type ContentTypes = {
  articles: Article;
  videos: Video;
  team: TeamMember;
  partners: Partner;
  testimonials: Testimonial;
  faqs: Faq;
  contactListings: ContactListing;
};
export type ContentKind = keyof ContentTypes;

type KindConfig<K extends ContentKind> = {
  label: string;
  singular: string;
  description: string;
  /** Where the content appears, for the "View on site" link */
  path: string;
  fields: Field[];
  /** Stored in content_items.slug and must be unique (blog posts) */
  slugField?: string;
  /** false: listed by date instead of a manual order */
  sortable: boolean;
  title: (d: ContentTypes[K]) => string;
  subtitle?: (d: ContentTypes[K]) => string;
  defaults?: () => Partial<ContentTypes[K]>;
  seed: () => ContentTypes[K][];
};

const listingTypes = ["Agent", "Casting director", "Production company", "Photographer", "Training", "Service"] as const;

export const contentKinds: { [K in ContentKind]: KindConfig<K> } = {
  articles: {
    label: "Blog posts",
    singular: "blog post",
    description: "News, advice, reviews and member stories on the blog.",
    path: "/blog",
    slugField: "url",
    sortable: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "url", label: "Link name", type: "slug", required: true, hint: "Used in the address: rafikihub.com/blog/link-name. Changing it breaks links people have already shared." },
      { name: "genre", label: "Type", type: "select", options: articleGenres, required: true },
      { name: "excerpt", label: "Summary", type: "textarea", required: true, hint: "One or two sentences. Shown on the blog page and in Google results." },
      { name: "content", label: "Post", type: "blocks", required: true, hint: "Leave a blank line between paragraphs. Start a line with ## to add a subheading." },
      { name: "image", label: "Cover image", type: "image" },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "publishedAt", label: "Publish date", type: "date", required: true },
      { name: "updatedAt", label: "Last meaningful update", type: "date", hint: "Optional. Set when you change a post substantially." },
    ],
    title: (d) => d.title,
    subtitle: (d) => `${d.genre} · ${d.publishedAt}`,
    defaults: () => ({ author: "RafikiHub", genre: "Article", publishedAt: new Date().toISOString().slice(0, 10) }),
    seed: () => articles,
  },
  videos: {
    label: "RafikiHub Online videos",
    singular: "video",
    description: "Workshops and masterclasses that play on the RafikiHub Online page.",
    path: "/videos",
    sortable: true,
    fields: [
      { name: "youtubeId", label: "YouTube link", type: "youtube", required: true, hint: "Paste the video's YouTube link." },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true, hint: "e.g. Acting, Filmmaking, Workshops. Visitors can filter by it." },
      { name: "instructor", label: "Teacher or guest", type: "text" },
      { name: "duration", label: "Length", type: "text", hint: "e.g. 12 min" },
      { name: "published", label: "Upload date", type: "date", required: true },
    ],
    title: (d) => d.title,
    subtitle: (d) => [d.category, d.instructor].filter(Boolean).join(" · "),
    defaults: () => ({ published: new Date().toISOString().slice(0, 10) }),
    seed: () => videos,
  },
  team: {
    label: "Team",
    singular: "team member",
    description: "The people on the Our Team page, in the order shown.",
    path: "/team",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "position", label: "Role", type: "text", required: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "bio", label: "Biography", type: "paragraphs", required: true, hint: "Leave a blank line between paragraphs." },
      { name: "linkedin", label: "LinkedIn link", type: "url" },
      { name: "alumniOf", label: "Studied at", type: "lines", hint: "One school or university per line." },
      { name: "profileUrl", label: "RafikiHub profile link name", type: "text", hint: "If they have a public profile, e.g. katesnow" },
    ],
    title: (d) => d.name,
    subtitle: (d) => d.position,
    seed: () => team,
  },
  partners: {
    label: "Partners",
    singular: "partner",
    description: "Logos in “Who we've worked with” on the home page.",
    path: "/",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image" },
      { name: "url", label: "Website", type: "url" },
      { name: "description", label: "Short description", type: "text", hint: "Shown only when there's no logo." },
    ],
    title: (d) => d.name,
    subtitle: (d) => d.url ?? "",
    seed: () => partners,
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    description: "Member quotes in “Happy members” on the home page.",
    path: "/",
    sortable: true,
    fields: [
      { name: "name", label: "Member's name", type: "text", required: true },
      { name: "category", label: "What they do", type: "text", required: true, hint: "e.g. Actress, Independent Performer" },
      { name: "message", label: "Quote", type: "textarea", required: true },
      { name: "image", label: "Photo", type: "image" },
    ],
    title: (d) => d.name,
    subtitle: (d) => d.message.slice(0, 90),
    seed: () => testimonials,
  },
  faqs: {
    label: "FAQs",
    singular: "question",
    description: "Questions and answers on the Help & FAQ page. The first five also appear on the home page.",
    path: "/faq",
    sortable: true,
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Section", type: "select", options: faqCategories, required: true },
    ],
    title: (d) => d.q,
    subtitle: (d) => d.category,
    seed: () => faqs,
  },
  contactListings: {
    label: "RafikiHub Connect listings",
    singular: "listing",
    description: "Agents, casting directors and services in the RafikiHub Connect directory.",
    path: "/contact-listings",
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: listingTypes, required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "website", label: "Website", type: "url" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "enhanced", label: "Enhanced listing (highlighted and shown first)", type: "checkbox" },
    ],
    title: (d) => d.name,
    subtitle: (d) => `${d.type} · ${d.location}`,
    seed: () => contactListings,
  },
};

export const contentKindList = Object.keys(contentKinds) as ContentKind[];
export const isContentKind = (k: string): k is ContentKind => k in contentKinds;

/* ─────────────────────── Form values ⇄ stored data ─────────────────────── */

/** Turns stored data into the strings a form shows. */
export function toFormValue(field: Field, value: unknown): string | boolean {
  if (field.type === "checkbox") return Boolean(value);
  if (value === null || value === undefined) return "";
  if (field.type === "lines" && Array.isArray(value)) return value.join("\n");
  if (field.type === "paragraphs" && Array.isArray(value)) return value.join("\n\n");
  if (field.type === "blocks" && Array.isArray(value)) {
    return (value as { heading?: string; text: string }[]).map((b) => (b.heading ? `## ${b.heading}\n${b.text}` : b.text)).join("\n\n");
  }
  return String(value);
}

const youtubeId = (v: string) =>
  v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(v) ? v : null);

export function parseBlocks(text: string) {
  const chunks = text.replace(/\r/g, "").split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
  const blocks: { heading?: string; text: string }[] = [];
  for (const chunk of chunks) {
    if (chunk.startsWith("## ")) {
      const [first, ...rest] = chunk.split("\n");
      blocks.push({ heading: first.slice(3).trim(), text: rest.join("\n").trim() });
    } else {
      const last = blocks[blocks.length - 1];
      // A heading on its own line takes the next paragraph as its text
      if (last?.heading && !last.text) last.text = chunk;
      else blocks.push({ text: chunk });
    }
  }
  return blocks;
}

/**
 * Validates submitted form values and converts them into stored data.
 * Returns field errors keyed by field name, or the data.
 */
export function fromForm(fields: Field[], form: FormData): { data: Record<string, unknown> } | { errors: Record<string, string> } {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const f of fields) {
    if (f.type === "checkbox") {
      data[f.name] = form.get(f.name) === "on";
      continue;
    }
    const raw = String(form.get(f.name) ?? "").trim();
    if (!raw) {
      if (f.required) errors[f.name] = `Add ${f.label.toLowerCase()}.`;
      else if (f.type === "image") data[f.name] = null;
      continue;
    }
    switch (f.type) {
      case "slug": {
        const slug = raw.toLowerCase();
        if (!/^[a-z0-9]+(?:-+[a-z0-9]+)*$/.test(slug)) errors[f.name] = "Use lower-case letters, numbers and hyphens only, e.g. my-first-post.";
        data[f.name] = slug;
        break;
      }
      case "youtube": {
        const id = youtubeId(raw);
        if (!id) errors[f.name] = "That doesn't look like a YouTube link.";
        data[f.name] = id ?? raw;
        break;
      }
      case "url":
      case "image": {
        // Images can be site paths (/images/...) as well as full links
        const ok = /^https?:\/\/\S+$/i.test(raw) || (f.type === "image" && /^\/\S+$/.test(raw));
        if (!ok) errors[f.name] = "Enter a full link starting with https://";
        data[f.name] = raw;
        break;
      }
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) errors[f.name] = "Enter a valid email address.";
        data[f.name] = raw;
        break;
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) errors[f.name] = "Pick a date.";
        data[f.name] = raw;
        break;
      case "select":
        if (f.options && !f.options.includes(raw)) errors[f.name] = "Pick one of the options.";
        data[f.name] = raw;
        break;
      case "lines":
        data[f.name] = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        break;
      case "paragraphs":
        data[f.name] = raw.replace(/\r/g, "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
        break;
      case "blocks":
        data[f.name] = parseBlocks(raw);
        break;
      default:
        data[f.name] = raw;
    }
  }
  return Object.keys(errors).length ? { errors } : { data };
}
