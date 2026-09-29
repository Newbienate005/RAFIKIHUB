import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the project root (a stray package-lock.json higher up the folder tree otherwise confuses Next.js)
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    // Keep old rafikihub.com URLs working so Google rankings carry over.
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/join-now", destination: "/join", permanent: true },
      { source: "/our-team", destination: "/team", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
      // Old profile links: /profile?url=<name>  →  /profile/<name>
      { source: "/profile", has: [{ type: "query", key: "url", value: "(?<name>.+)" }], destination: "/profile/:name", permanent: true },
      { source: "/options", destination: "/membership", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      // Old article links: /article?url=<slug>  →  /blog/<slug>
      { source: "/article", has: [{ type: "query", key: "url", value: "(?<slug>.+)" }], destination: "/blog/:slug", permanent: true },

      // Every other old URL, taken from the old PHP site's source (its .htaccess served /x as x.php)
      { source: "/index", destination: "/", permanent: true },
      { source: "/contacts", destination: "/contact-listings", permanent: true }, // the old /contacts was the industry directory
      { source: "/rooms-and-studio", destination: "/resources", permanent: true },
      { source: "/room", destination: "/resources", permanent: true },
      { source: "/studio", destination: "/resources", permanent: true },
      { source: "/video", destination: "/videos", permanent: true },
      { source: "/voice", destination: "/videos", permanent: true },
      { source: "/register", destination: "/join", permanent: true },
      { source: "/pricing", destination: "/membership", permanent: true },
      { source: "/what-we-do", destination: "/about", permanent: true },
      // Fallbacks when the old query parameter is missing (after the `has` versions above)
      { source: "/profile", destination: "/", permanent: true },
      { source: "/article", destination: "/blog", permanent: true },
      // Old dashboard and logout paths
      { source: "/dashboard/:page(index|upload)(\\.php)?", destination: "/dashboard", permanent: true },
      { source: "/data/files/logout", destination: "/login", permanent: true },
      // .php forms of the old pages
      { source: "/article.php", has: [{ type: "query", key: "url", value: "(?<slug>.+)" }], destination: "/blog/:slug", permanent: true },
      { source: "/profile.php", has: [{ type: "query", key: "url", value: "(?<name>.+)" }], destination: "/profile/:name", permanent: true },
      ...Object.entries({
        index: "/", "about-us": "/about", team: "/team", "talent-management": "/talent-management", blog: "/blog",
        article: "/blog", profile: "/", videos: "/videos", video: "/videos", voice: "/videos", contacts: "/contact-listings",
        "rooms-and-studio": "/resources", room: "/resources", studio: "/resources", services: "/services",
        locations: "/locations", faq: "/faq", "privacy-policy": "/privacy", "terms-and-conditions": "/terms",
        "join-now": "/join", register: "/join", options: "/membership",
      }).map(([page, destination]) => ({ source: `/${page}.php`, destination, permanent: true })),
      // Old activation and password-reset email links: the tokens no longer work, so send people to log in
      { source: "/", has: [{ type: "query", key: "activate" }], destination: "/login", permanent: false },
      { source: "/", has: [{ type: "query", key: "reset" }], destination: "/login", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};
export default nextConfig;
