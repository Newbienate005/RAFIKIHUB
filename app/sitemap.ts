import type { MetadataRoute } from "next";
import { articles } from "@/lib/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/join", 0.9, "monthly"],
    ["/casting", 0.9, "monthly"],
    ["/talent-management", 0.8, "monthly"],
    ["/faq", 0.8, "monthly"],
    ["/about", 0.7, "yearly"],
    ["/team", 0.5, "yearly"],
    ["/blog", 0.7, "weekly"],
    ["/contact", 0.6, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority })),
    ...articles.map((a) => ({ url: `${site.url}/blog/${a.url}`, lastModified: new Date(a.publishedAt), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
