import type { MetadataRoute } from "next";
import { settings } from "@/lib/data/settings";

/** Served at /manifest.webmanifest (installable PWA basics). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${settings.brand.name} — ${settings.brand.tagline.fr}`,
    short_name: "ISLEM Immobilier",
    description: settings.seo.defaultDescription.fr,
    start_url: "/fr",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4ed",
    theme_color: "#14432f",
    lang: "fr-DZ",
    dir: "ltr",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
