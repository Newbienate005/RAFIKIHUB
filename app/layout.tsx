import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

// Free geometric sans standing in for the proprietary type in DESIGN.md
const figtree = Figtree({ subsets: ["latin", "latin-ext"], style: ["normal", "italic"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RafikiHub | Casting platform for actors and performers in Kenya",
    template: "%s | RafikiHub",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "casting Kenya", "auditions Nairobi", "acting jobs Kenya", "casting directors Kenya",
    "talent agency Nairobi", "actors Kenya", "models Kenya", "East Africa casting", "African talent",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: site.url,
    siteName: site.name,
    title: "RafikiHub | Casting platform for actors and performers in Kenya",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "RafikiHub | Casting platform for actors and performers in Kenya",
    description: site.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: true, email: true },
  category: "entertainment",
  // Nairobi City County (ISO 3166-2:KE-30)
  other: { "geo.region": "KE-30", "geo.placename": "Nairobi", "geo.position": "-1.2921;36.8219", ICBM: "-1.2921, 36.8219" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121212",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={figtree.variable}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />
        <link rel="alternate" type="application/rss+xml" href="/blog/rss.xml" title="RafikiHub Blog" />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
