import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.shortName,
    description: site.description,
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    orientation: "portrait",
    categories: ["security", "productivity", "utilities"],
    icons: [
      { src: "/icon",        sizes: "any",   type: "image/png", purpose: "any" },
      { src: "/apple-icon",  sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
