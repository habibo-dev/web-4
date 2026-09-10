import type { Metadata } from "next";
import { parseLocale } from "@/lib/i18n";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { settings } from "@/lib/data/settings";

/* Shared plumbing for every page: typed async params (Next 15+). */

export type PageParams<T = Record<string, never>> = Promise<
  { locale: string } & T
>;
export type PageSearch = Promise<Record<string, string | string[] | undefined>>;

export async function localeFrom(params: PageParams): Promise<Locale> {
  const { locale } = await params;
  return parseLocale(locale);
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Canonical + hreflang pairs for a path (locale-neutral), plus OG defaults.
 */
export function buildMetadata(
  locale: Locale,
  path: string,
  opts: {
    title?: (l: Locale) => string;
    description?: string;
    noindex?: boolean;
    type?: "website" | "article";
  } = {},
): Metadata {
  const base = path === "/" ? "" : path;
  const urlFor = (l: Locale) => `${SITE_URL}${pathWithLocale(l, base)}`;
  const siteTitle = `${settings.seo.siteName} — ${settings.brand.tagline.fr}`;
  return {
    title: opts.title
      ? { absolute: opts.title(locale) }
      : { template: settings.seo.titleTemplate, default: siteTitle },
    description: opts.description ?? settings.seo.defaultDescription[locale],
    alternates: {
      canonical: urlFor(locale),
      languages: {
        "fr-DZ": urlFor("fr"),
        "ar-DZ": urlFor("ar"),
        "x-default": urlFor("fr"),
      },
    },
    openGraph: {
      type: opts.type ?? "website",
      siteName: settings.seo.siteName,
      locale: locale === "ar" ? "ar_DZ" : "fr_DZ",
      url: urlFor(locale),
      title: opts.title ? opts.title(locale) : siteTitle,
      description: opts.description ?? settings.seo.defaultDescription[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title ? opts.title(locale) : siteTitle,
      description: opts.description ?? settings.seo.defaultDescription[locale],
    },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
  };
}

export { SITE_URL };

/** Next gives searchParams as a record of string|string[]|undefined. */
export function toSearchParams(sp: Record<string, string | string[] | undefined>): URLSearchParams {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") out.set(k, v);
    else if (Array.isArray(v) && v[0]) out.set(k, String(v[0]));
  }
  return out;
}
