import { z } from "zod";
import { propertyTypeSchema, transactionSchema } from "@/lib/data/types";

/**
 * Shared form schemas — the same zod modules run on the client (before
 * submit) and in the API routes (source of truth server-side).
 */

/** Algerian mobile formats: 0{5,6,7}XXXXXXXX or +213{5,6,7}XXXXXXXX. */
export const PHONE_RE = /^(?:\+213|00213|0)(5|6|7)\d{8}$/;

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s.\-()]/g, ""))
  .pipe(z.string().regex(PHONE_RE, { message: "invalidPhone" }));

const email = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined))
  .pipe(z.string().email({ message: "invalidEmail" }).optional());

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined))
  .pipe(phone.optional());

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal("")).transform((v) => (v ? v : undefined));

export const inquiryFormSchema = z
  .object({
    kind: z.enum(["visit", "contact"]),
    name: z.string().trim().min(2, "invalidName").max(120),
    phone,
    whatsapp: optionalPhone,
    email,
    propertySlug: optionalText(160),
    preferredDate: optionalText(32),
    message: optionalText(3000),
    consent: z.boolean().optional(),
    locale: z.enum(["fr", "ar"]),
    /** anti-spam honeypot — must stay empty */
    company: z.string().max(0).optional(),
    /** client-side timestamp for soft rate checks */
    ts: z.coerce.number().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.company !== undefined && v.company !== "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["company"], message: "spam" });
    }
    if (v.kind === "visit" && v.consent !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consent"], message: "consentRequired" });
    }
  });
export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;

export const submissionFormSchema = z.object({
  ownerName: z.string().trim().min(2, "invalidName").max(120),
  phone,
  whatsapp: optionalPhone,
  email,
  propertyType: propertyTypeSchema,
  transaction: transactionSchema,
  neighborhood: z.string().min(1).max(80),
  price: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v.replace(/[^\d.]/g, "")) : undefined))
    .pipe(z.number().nonnegative().max(1_000_000_000_000).optional()),
  surface: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v.replace(/[^\d.]/g, "")) : undefined))
    .pipe(z.number().positive().max(1_000_000).optional()),
  bedrooms: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().int().nonnegative().max(30).optional()),
  description: z.string().trim().min(10, "required").max(4000),
  photoLinks: z
    .array(z.string().trim())
    .transform((v) => v.filter(Boolean))
    .refine((v) => v.length <= 12, "photosMax")
    .pipe(z.array(z.string().url({ message: "invalidUrl" })).max(12)),
  consent: z.literal(true, { errorMap: () => ({ message: "consentRequired" }) }),
  locale: z.enum(["fr", "ar"]),
  company: z.string().max(0).optional(),
});
export type SubmissionFormInput = z.infer<typeof submissionFormSchema>;

export type FieldErrors = Record<string, string>;

export function collectErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message === "invalid_type" ? "required" : String(issue.message);
  }
  return out;
}
