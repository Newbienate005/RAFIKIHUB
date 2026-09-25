import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RafikiHub",
    short_name: "RafikiHub",
    description: "Casting platform for actors and performers in Kenya and Africa",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f3f7",
    theme_color: "#2b1f5c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
