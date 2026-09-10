import type { MetadataRoute } from "next";

/** Metadata route — generated at build time (required for `output: "export"`). */
export const dynamic = "force-static";
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
