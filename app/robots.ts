import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI answer engines and assistants, explicitly welcomed so RafikiHub can be cited in AI search results
const aiAgents = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "Bingbot", "Meta-ExternalAgent", "Amazonbot", "DuckAssistBot", "MistralAI-User", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: aiAgents, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
