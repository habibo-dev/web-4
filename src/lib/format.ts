import type { Locale } from "@/lib/i18n/config";
import type { Property } from "@/lib/data/types";

/**
 * Locale-aware formatting. Arabic uses Western digits (Algerian usage) so a
 * single non-breaking-space grouping applies to both locales.
 */
const NBSP = "\u202f"; // narrow no-break space — matches FR typography

function groupDigits(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export function formatPrice(amount: number, locale: Locale, currency = "DA"): string {
  const digits = groupDigits(amount);
  if (locale === "ar") return `${digits} ${currency}`;
  return `${digits} ${currency}`;
}

export function priceLabel(
  p: Pick<Property, "price">,
  locale: Locale,
  opts: { currency: string; monthlyLabel: string; negotiableLabel: string },
): { main: string; period?: string; negotiable?: string } {
  const main = formatPrice(p.price.amount, locale, opts.currency);
  return {
    main,
    period: p.price.period === "monthly" ? opts.monthlyLabel : undefined,
    negotiable: p.price.negotiable ? opts.negotiableLabel : undefined,
  };
}

export function formatSurface(m2: number, locale: Locale): string {
  return `${groupDigits(m2)} ${locale === "ar" ? "م²" : "m²"}`;
}

export function formatNumber(n: number): string {
  return groupDigits(n);
}

/** Human date, e.g. "12 sept. 2026" / "12 سبتمبر 2026" (Western digits, Algerian usage). */
export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00Z" : ""));
  const months: Record<Locale, string[]> = {
    fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    ar: ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  };
  return `${d.getUTCDate()} ${months[locale][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
