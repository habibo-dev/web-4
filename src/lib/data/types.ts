import { z } from "zod";

/* ──────────────────────────────────────────────────────────────────────
   Content model for ISLEM Immobilier.

   These schemas are the single source of truth for every content entity.
   They intentionally mirror what a headless CMS (Payload, Directus,
   Sanity, Strapi…) would store, so the JSON modules in `src/lib/data/`
   can be swapped for CMS collections without touching the UI.
   See /docs/CMS.md.
   ────────────────────────────────────────────────────────────────────── */

export const localeSchema = z.enum(["fr", "ar"]);
export type Locale = z.infer<typeof localeSchema>;

/** Bilingual string (all editorial content is FR + AR). */
export const l10nSchema = z.object({ fr: z.string(), ar: z.string() });
export type L10n = z.infer<typeof l10nSchema>;

export const transactionSchema = z.enum(["sale", "rent"]);
export type Transaction = z.infer<typeof transactionSchema>;

export const propertyTypeSchema = z.enum(["apartment", "villa", "land", "commercial", "office"]);
export type PropertyType = z.infer<typeof propertyTypeSchema>;

export const propertyStatusSchema = z.enum(["available", "reserved", "sold"]);
export type PropertyStatus = z.infer<typeof propertyStatusSchema>;

export const featureKeySchema = z.enum([
  "sea-view",
  "city-view",
  "terrace",
  "balcony",
  "garden",
  "pool",
  "parking",
  "garage",
  "elevator",
  "security",
  "furnished",
  "air-conditioning",
  "fitted-kitchen",
  "storage",
  "fiber",
  "generator",
  "double-glazing",
  "natural-light",
  "close-to-schools",
  "close-to-transport",
]);
export type FeatureKey = z.infer<typeof featureKeySchema>;

export const propertyLabelSchema = z.enum(["coup-de-coeur", "nouveau"]);
export type PropertyLabel = z.infer<typeof propertyLabelSchema>;

export const imageSchema = z.object({
  /** Path served by Next's image optimizer, e.g. `/images/apt/living-bright.webp`. */
  src: z.string(),
  alt: l10nSchema,
});
export type PropertyImage = z.infer<typeof imageSchema>;

export const propertySchema = z.object({
  id: z.string(),
  /** URL-safe, locale-neutral identifier: /fr/property/{slug} */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Agency reference shown on the listing, e.g. ISL-1042. */
  reference: z.string(),
  type: propertyTypeSchema,
  transaction: transactionSchema,
  status: propertyStatusSchema.default("available"),
  featured: z.boolean().default(false),
  labels: z.array(propertyLabelSchema).default([]),

  price: z.object({
    /** Full amount in DZD (e.g. 415_000_000). Never abbreviated in the data layer. */
    amount: z.number().int().nonnegative(),
    period: z.enum(["one-time", "monthly"]).default("one-time"),
    negotiable: z.boolean().default(false),
  }),

  surface: z.number().positive(), // m² (built area; for land: plot area)
  plotArea: z.number().positive().optional(), // m² of ground (villas, land)
  rooms: z.number().int().nonnegative().optional(), // total rooms (F4 → 4)
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  floor: l10nSchema.optional(),
  furnished: z.boolean().optional(),
  yearBuilt: z.number().int().optional(),
  features: z.array(featureKeySchema).default([]),

  title: l10nSchema,
  excerpt: l10nSchema,
  /** Paragraphs separated by blank lines. */
  description: l10nSchema,

  neighborhood: z.string(), // id into NEIGHBORHOODS
  /** Only display where the owner confirmed it; otherwise omit. */
  exactAddress: l10nSchema.optional(),
  coords: z.object({ lat: z.number(), lng: z.number() }),

  images: z.array(imageSchema).min(1),
  publishedAt: z.string(), // ISO date
});
export type Property = z.infer<typeof propertySchema>;

export const agentSchema = z.object({
  id: z.string(),
  name: l10nSchema,
  initials: z.string(),
  role: l10nSchema,
  bio: l10nSchema,
  email: z.string().email(),
  languages: z.array(z.string()),
  specialties: z.array(propertyTypeSchema),
});
export type Agent = z.infer<typeof agentSchema>;

export const serviceSchema = z.object({
  key: z.enum(["achat", "vente", "location", "estimation", "conseil"]),
  icon: z.string(),
  title: l10nSchema,
  tagline: l10nSchema,
  description: l10nSchema,
  bullets: z.array(l10nSchema),
});
export type Service = z.infer<typeof serviceSchema>;

/**
 * Testimonials must come from real, verifiable client feedback.
 * The dataset ships EMPTY on purpose — nothing renders until the agency
 * adds approved reviews. Never populate it with invented praise.
 */
export const testimonialSchema = z.object({
  id: z.string(),
  author: z.string(),
  context: l10nSchema, // e.g. "Achat d'un appartement à Hydra"
  quote: l10nSchema,
  date: z.string(),
  source: z.enum(["google", "direct", "social"]).default("direct"),
  approved: z.boolean().default(false),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

/* ── Inbound records (forms → data/db.json → /admin) ──────────────── */

export const inquirySchema = z.object({
  id: z.string(),
  kind: z.enum(["visit", "contact"]),
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(24),
  whatsapp: z.string().min(8).max(24).optional().or(z.literal("")).transform((v) => v || undefined),
  email: z.string().email().optional().or(z.literal("")).transform((v) => v || undefined),
  propertySlug: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  preferredDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  message: z.string().max(3000).optional().or(z.literal("")).transform((v) => v || undefined),
  locale: localeSchema,
  createdAt: z.string(),
  status: z.enum(["new", "in-progress", "done", "archived"]).default("new"),
});
export type Inquiry = z.infer<typeof inquirySchema>;

export const submissionSchema = z.object({
  id: z.string(),
  ownerName: z.string().min(2).max(120),
  phone: z.string().min(8).max(24),
  whatsapp: z.string().min(8).max(24).optional().or(z.literal("")).transform((v) => v || undefined),
  email: z.string().email().optional().or(z.literal("")).transform((v) => v || undefined),
  propertyType: propertyTypeSchema,
  transaction: transactionSchema,
  neighborhood: z.string(),
  price: z.coerce.number().nonnegative().optional(),
  surface: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  description: z.string().min(10).max(4000),
  photos: z.array(z.string()).max(12).default([]), // uploaded filenames and/or external links
  consent: z.boolean(),
  locale: localeSchema,
  createdAt: z.string(),
  status: z.enum(["new", "reviewing", "contacted", "listed", "closed"]).default("new"),
});
export type Submission = z.infer<typeof submissionSchema>;

/* ── Site settings (configurable, single edit point) ──────────────── */

export const settingsSchema = z.object({
  brand: z.object({
    name: z.string(),
    tagline: l10nSchema,
    legalName: z.string(), // registered company name, configurable
  }),
  contact: z.object({
    phoneE164: z.string(), // used for tel: + wa.me links
    phoneDisplay: z.string(),
    whatsappPhone: z.string(), // wa.me needs digits without `+`
    email: z.string(),
    address: l10nSchema,
    mapCoords: z.object({ lat: z.number(), lng: z.number() }),
    hours: z.object({
      fr: z.array(z.object({ days: z.string(), hours: z.string() })),
      ar: z.array(z.object({ days: z.string(), hours: z.string() })),
    }),
  }),
  social: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    googleBusiness: z.string().optional(),
  }),
  seo: z.object({
    siteName: z.string(),
    titleTemplate: z.string(),
    defaultDescription: l10nSchema,
    keywords: z.array(z.string()),
    ogImage: z.string(),
  }),
  site: z.object({
    url: z.string(),
    currency: z.enum(["DZD"]),
    currencySymbol: l10nSchema,
    priceSuffix: l10nSchema,
  }),
  content: z.object({
    /** Editorial disclaimer shown under listings ("photos non contractuelles"…). */
    listingsDisclaimer: l10nSchema,
    /** Short legal note shown under forms. */
    privacyNote: l10nSchema,
  }),
});
export type Settings = z.infer<typeof settingsSchema>;
