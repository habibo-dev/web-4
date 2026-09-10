import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import { fr } from "./messages/fr";
import { ar } from "./messages/ar";
import type { Messages } from "./messages/fr";

/**
 * Message access for server AND client components.
 * The dictionaries are small typed objects, safe to bundle.
 */
const dictionaries: Record<Locale, Messages> = { fr, ar };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

/** Validate + return a layout segment's locale (throws notFound otherwise). */
export function parseLocale(raw: string | undefined): Locale {
  if (!isLocale(raw)) notFound();
  return raw;
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
