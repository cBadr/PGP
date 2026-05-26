import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/faq", "/tools/", "/guides/", "/glossary/", "/u/"],
        disallow: [
          "/dashboard",
          "/keys", "/keys/*",
          "/encrypt", "/decrypt", "/sign", "/verify",
          "/admin", "/admin/*",
          "/api/", "/api/*",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
