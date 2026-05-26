import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Public sitemap. Only includes routes safe to index — private pages
 * under (app), admin and api are excluded via robots.ts disallow as well.
 *
 * As tools/, guides/ and glossary/ pages are added later, list them here
 * with their own priorities.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url.replace(/\/$/, "");

  return [
    { url: `${base}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/login`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/faq`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
