/**
 * Lightweight i18n layer for ISLEM Immobilier.
 *
 * Locales are mirrored in the URL (/fr/…, /ar/…) with full RTL support for
 * Arabic. Route prefixes are handled by `src/middleware.ts`.
 */
export const LOCALES = ["fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const RTL_LOCALES: Locale[] = ["ar"];

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

/** `/fr`, `/ar` — used as `hrefLang` value for Arabic (Algeria). */
export function localeHtmlLang(locale: Locale): string {
  return locale === "ar" ? "ar-DZ" : "fr-DZ";
}

/** Prepend locale to an app path: pathWithLocale("ar", "/properties") → "/ar/properties" */
export function pathWithLocale(locale: Locale, path = ""): string {
  const clean = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Remove the leading locale segment, returning a locale-neutral path. */
export function stripLocale(pathname: string): { path: string; locale: Locale | null } {
  const [, maybeLocale, ...rest] = pathname.split("/");
  if (isLocale(maybeLocale)) {
    return { path: `/${rest.join("/")}` === "/" ? "/" : `/${rest.join("/")}`, locale: maybeLocale };
  }
  return { path: pathname, locale: null };
}

/** Swap the locale segment — used by the language switcher. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const { path } = stripLocale(pathname);
  return pathWithLocale(to, path);
}

/** Locale detection order: explicit cookie → Accept-Language → default. */
export function detectLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(",")) {
      const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
      if (tag.startsWith("ar")) return "ar";
      if (tag.startsWith("fr")) return "fr";
    }
  }
  return DEFAULT_LOCALE;
}
