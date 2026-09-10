import type { MetadataRoute } from "next";
import { settings } from "@/lib/data/settings";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? settings.site.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
