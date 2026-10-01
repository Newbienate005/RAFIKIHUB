import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RafikiHub",
    short_name: "RafikiHub",
    description: "Casting platform for actors and performers in Kenya and Africa",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F9FA",
    theme_color: "#211F1C",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
