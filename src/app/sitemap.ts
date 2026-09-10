import type { MetadataRoute } from "next";

/** Metadata route — generated at build time (required for `output: "export"`). */
export const dynamic = "force-static";
import { LOCALES, pathWithLocale } from "@/lib/i18n/config";
import { properties } from "@/lib/data/properties";
import { settings } from "@/lib/data/settings";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? settings.site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/properties",
    "/sale",
    "/rent",
    "/services",
    "/about",
    "/contact",
    "/submit-property",
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const p of staticPaths) {
      entries.push({
        url: `${SITE}${pathWithLocale(locale, p)}`,
        changeFrequency: p === "/" || p === "/properties" ? "daily" : "weekly",
        priority: p === "/" ? 1 : p === "/properties" || p === "/sale" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l === "fr" ? "fr-DZ" : "ar-DZ", `${SITE}${pathWithLocale(l, p)}`])),
        },
      });
    }
  }

  for (const locale of LOCALES) {
    for (const p of properties) {
      entries.push({
        url: `${SITE}${pathWithLocale(locale, `/property/${p.slug}`)}`,
        lastModified: p.publishedAt,
        changeFrequency: "weekly",
        priority: p.featured ? 0.8 : 0.6,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l === "fr" ? "fr-DZ" : "ar-DZ", `${SITE}${pathWithLocale(l, `/property/${p.slug}`)}`])),
        },
      });
    }
  }
  return entries;
}
