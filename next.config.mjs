/** @type {import('next').NextConfig} */
const nextConfig = {
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
