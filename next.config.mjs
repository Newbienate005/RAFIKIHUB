/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    // Keep old rafikihub.com URLs working so Google rankings carry over.
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/join-now", destination: "/join", permanent: true },
      { source: "/services", destination: "/talent-management", permanent: true },
      { source: "/our-team", destination: "/team", permanent: true },
      { source: "/blogs", destination: "/blog", permanent: true },
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
