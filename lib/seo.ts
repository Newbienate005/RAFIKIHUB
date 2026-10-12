import type { Metadata } from "next";
import { site } from "./site";

/** The branded share card (app/opengraph-image.tsx), for pages without a photo of their own. */
export const defaultShareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "RafikiHub: get seen, get cast. Casting platform for performers in Kenya and Africa." };

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards.
 * The layout's title template doesn't reach Open Graph, so social titles carry the brand here.
 * A page's own openGraph replaces the layout's, image included, so every page names its share image:
 * `image` if it has one (an article's cover), otherwise the branded card. Without it, links shared on
 * WhatsApp, LinkedIn or X show no picture.
 * Pass `noindex` for thin or draft pages that should stay out of search results.
 */
export function pageMeta({ title, description, path, noindex, image }: { title: string; description: string; path: string; noindex?: boolean; image?: string | null }): Metadata {
  const social = `${title} | ${site.name}`;
  const images = image ? [{ url: image, alt: title }] : [defaultShareImage];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: social, description, url: `${site.url}${path}`, siteName: site.name, locale: "en_KE", type: "website", images },
    twitter: { card: "summary_large_image", title: social, description, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
