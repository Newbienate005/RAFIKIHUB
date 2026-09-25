import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

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
  alternates: { canonical: "/" },
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2B1F5C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />
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
