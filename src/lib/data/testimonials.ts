import type { Testimonial } from "./types";

/**
 * ⚖️  Intentionally empty.
 *
 * Testimonials are only ever displayed when the agency adds real,
 * client-approved feedback (approved: true). The UI hides the entire
 * section while this array holds no approved entry — so the site never
 * ships with fake reviews.
 *
 * To add one (CMS-ready shape):
 *
 * {
 *   id: "client-001",
 *   author: "Prénom N.",                       // initials preferred
 *   context: { fr: "Achat d'un F4 à Hydra", ar: "شراء شقة F4 بحيدرة" },
 *   quote: { fr: "…real quote…", ar: "…النص الحرفي…" },
 *   date: "2026-01-15",
 *   source: "google",
 *   approved: true,                            // client gave written consent
 * }
 */
export const testimonials: Testimonial[] = [];

/** Only approved entries ever render. */
export function publishedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.approved);
}
