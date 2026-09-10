/**
 * Content QC gate — run with `npm run check:data` (also in CI).
 * Fails the build pipeline when the catalogue would render broken:
 *  - duplicate ids/slugs/references
 *  - missing bilingual strings (FR/AR)
 *  - unknown image keys / neighborhoods
 *  - incoherent numbers (bedrooms > rooms, price vs transaction, dates)
 */
import { properties } from "../src/lib/data/properties";
import { IMAGE_LIB } from "../src/lib/data/imageLibrary";
import { NEIGHBORHOODS } from "../src/lib/data/neighborhoods";
import { agents } from "../src/lib/data/agents";
import { services } from "../src/lib/data/services";
import { testimonials } from "../src/lib/data/testimonials";
import { propertySchema, agentSchema, serviceSchema, testimonialSchema } from "../src/lib/data/types";
import { existsSync } from "node:fs";
import { join } from "node:path";

const errors: string[] = [];
const seen: Record<string, Set<string>> = { id: new Set(), slug: new Set(), reference: new Set() };
const nbIds = new Set(NEIGHBORHOODS.map((n) => n.id));

for (const p of properties) {
  const parsed = propertySchema.safeParse(p);
  if (!parsed.success) {
    errors.push(`${p.slug}: schema → ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  for (const key of ["id", "slug", "reference"] as const) {
    const v = String(p[key]);
    if (seen[key].has(v)) errors.push(`duplicate ${key}: ${v}`);
    seen[key].add(v);
  }
  if (!nbIds.has(p.neighborhood)) errors.push(`${p.slug}: unknown neighborhood "${p.neighborhood}"`);
  if (p.images.length === 0) errors.push(`${p.slug}: no images`);
  for (const img of p.images) {
    if (!IMAGE_LIB[img.src]) errors.push(`${p.slug}: unknown image key "${img.src}"`);
  }
  for (const field of ["title", "excerpt", "description"] as const) {
    if (!p[field].fr.trim() || !p[field].ar.trim()) errors.push(`${p.slug}: ${field} missing FR or AR`);
  }
  if (p.bedrooms !== undefined && p.rooms !== undefined && p.bedrooms > p.rooms)
    errors.push(`${p.slug}: bedrooms(${p.bedrooms}) > rooms(${p.rooms})`);
  if (p.transaction === "sale" && p.price.period === "monthly") errors.push(`${p.slug}: sale priced monthly`);
  if (p.transaction === "rent" && p.price.period !== "monthly") errors.push(`${p.slug}: rent must be priced monthly`);
  if (p.transaction === "sale" && p.price.amount < 5_000_000) errors.push(`${p.slug}: sale price implausibly low`);
  if (p.transaction === "rent" && p.price.amount > 5_000_000) errors.push(`${p.slug}: monthly rent implausibly high`);
  if (Number.isNaN(Date.parse(p.publishedAt))) errors.push(`${p.slug}: bad publishedAt`);
  if (p.images.some((i) => !i.alt.fr || !i.alt.ar)) errors.push(`${p.slug}: image alt missing FR/AR`);
}

for (const a of agents) {
  if (!agentSchema.safeParse(a).success) errors.push(`agent ${a.id}: schema invalid`);
  if (!a.name.fr || !a.name.ar) errors.push(`agent ${a.id}: bilingual name required`);
}
for (const s of services) if (!serviceSchema.safeParse(s).success) errors.push(`service ${s.key}: schema invalid`);
for (const t of testimonials) {
  if (!testimonialSchema.safeParse(t).success) errors.push(`testimonial ${t.id}: schema invalid`);
  if (!t.approved) errors.push(`testimonial ${t.id}: unapproved testimonial present in published dataset`);
}

/* Image files must exist on disk, not just as registry keys — a missing
   file renders a broken <img> that no schema check would catch. */
for (const [key, lib] of Object.entries(IMAGE_LIB)) {
  if (!existsSync(join(process.cwd(), "public", lib.src))) errors.push(`imageLibrary "${key}": file missing → public${lib.src}`);
}

const counts = properties.reduce<Record<string, number>>((acc, p) => {
  const k = `${p.transaction}/${p.type}`;
  acc[k] = (acc[k] ?? 0) + 1;
  return acc;
}, {});

if (errors.length) {
  console.error(`✖ ${errors.length} data issue(s):\n` + errors.map((e) => `  – ${e}`).join("\n"));
  process.exit(1);
}
console.log(
  `✓ ${properties.length} listings OK (${Object.entries(counts).map(([k, v]) => `${k}:${v}`).join("  ")}) · ` +
    `${agents.length} agents · ${services.length} services · ${testimonials.filter((t) => t.approved).length} approved reviews`,
);
