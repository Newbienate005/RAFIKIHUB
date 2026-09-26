import type { Metadata } from "next";
import { site } from "./site";

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards.
 * The layout's title template doesn't reach Open Graph, so social titles carry the brand here.
 * Pass `noindex` for thin or draft pages that should stay out of search results.
 */
export function pageMeta({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const social = `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: social, description, url: `${site.url}${path}`, siteName: site.name, locale: "en_KE", type: "website" },
    twitter: { card: "summary_large_image", title: social, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
