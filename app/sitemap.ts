import type { MetadataRoute } from "next";
import { articles, contactListings, exampleProfile, videos } from "@/lib/data";
import { getPublishedProfileUrls } from "@/lib/profiles";
import { site } from "@/lib/site";

export const revalidate = 3600;

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Bump `updated` when a page's content really changes, so crawlers trust lastModified.
const pages: { path: string; updated: string; priority: number; freq: Freq; include?: boolean }[] = [
  { path: "/join", updated: "2026-09-26", priority: 0.9, freq: "monthly" },
  { path: "/casting", updated: "2026-09-26", priority: 0.9, freq: "monthly" },
  { path: "/membership", updated: "2026-09-26", priority: 0.9, freq: "monthly" },
  { path: "/talent-management", updated: "2026-09-26", priority: 0.8, freq: "monthly" },
  { path: "/services", updated: "2026-09-26", priority: 0.8, freq: "monthly" },
  { path: "/faq", updated: "2026-09-26", priority: 0.8, freq: "monthly" },
  { path: "/about", updated: "2026-09-26", priority: 0.7, freq: "yearly" },
  { path: "/team", updated: "2026-09-26", priority: 0.5, freq: "yearly" },
  { path: "/contact", updated: "2026-09-26", priority: 0.6, freq: "yearly" },
  { path: "/locations", updated: "2026-09-26", priority: 0.6, freq: "yearly" },
  { path: "/resources", updated: "2026-09-26", priority: 0.6, freq: "monthly" },
  // Thin pages stay out until they have content (they're noindexed until then too)
  { path: "/videos", updated: "2026-09-26", priority: 0.6, freq: "weekly", include: videos.length > 0 },
  { path: "/contact-listings", updated: "2026-09-26", priority: 0.6, freq: "monthly", include: contactListings.length > 3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latestPost = articles.map((a) => a.updatedAt ?? a.publishedAt).sort().at(-1) ?? pages[0].updated;
  const profiles = await getPublishedProfileUrls();
  return [
    { url: site.url, lastModified: new Date(latestPost > pages[0].updated ? latestPost : pages[0].updated), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, lastModified: new Date(latestPost), changeFrequency: "weekly", priority: 0.7 },
    ...pages
      .filter((p) => p.include !== false)
      .map((p) => ({ url: `${site.url}${p.path}`, lastModified: new Date(p.updated), changeFrequency: p.freq, priority: p.priority })),
    ...articles.map((a) => ({ url: `${site.url}/blog/${a.url}`, lastModified: new Date(a.updatedAt ?? a.publishedAt), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...profiles
      .filter((p) => p.profileUrl !== exampleProfile.profileUrl)
      .map((p) => ({ url: `${site.url}/profile/${p.profileUrl}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
