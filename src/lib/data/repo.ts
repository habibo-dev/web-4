import { properties } from "./properties";
import { NEIGHBORHOODS } from "./neighborhoods";
import type { Property, PropertyType, Transaction } from "./types";
import { applyCatalog, type CatalogFilter, type CatalogSort } from "@/lib/catalog-query";

export type { CatalogFilter, CatalogSort };

/* ──────────────────────────────────────────────────────────────────────
   Query layer. Today it filters the in-repo dataset at build/request
   time; swapping in a CMS only means re-implementing these reads.
   ────────────────────────────────────────────────────────────────────── */

export function allPublished(): Property[] {
  return properties
    .filter((p) => p.status !== "sold")
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function featuredProperties(limit = 6): Property[] {
  return allPublished()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function filterProperties(f: CatalogFilter, sort: CatalogSort = "recent"): Property[] {
  return applyCatalog(allPublished(), f, sort);
}

export function similarProperties(p: Property, limit = 3): Property[] {
  const direct = allPublished().filter((o) => o.id !== p.id && o.transaction === p.transaction && o.type === p.type);
  if (direct.length >= limit) return direct.slice(0, limit);
  const fallback = allPublished().filter((o) => o.id !== p.id && o.transaction === p.transaction && o.type !== p.type);
  return [...direct, ...fallback].slice(0, limit);
}

export function countByType(transaction?: Transaction): Record<PropertyType, number> {
  const base = { apartment: 0, villa: 0, land: 0, commercial: 0, office: 0 } as Record<PropertyType, number>;
  for (const p of allPublished()) {
    if (!transaction || p.transaction === transaction) base[p.type] += 1;
  }
  return base;
}

/** Locations available in the catalog (only populated ones, for search selects). */
export function availableNeighborhoods() {
  const counts = new Map<string, number>();
  for (const p of allPublished()) {
    counts.set(p.neighborhood, (counts.get(p.neighborhood) ?? 0) + 1);
  }
  return NEIGHBORHOODS.filter((n) => (counts.get(n.id) ?? 0) > 0).map((n) => ({
    ...n,
    count: counts.get(n.id) ?? 0,
  }));
}

/* ── image key → concrete path resolution ─────────────────────────── */

import { resolveImage } from "./imageLibrary";
import type { L10n } from "./types";

export interface ResolvedImage {
  src: string;
  alt: L10n;
  width: number;
  height: number;
}

export type ResolvedProperty = Omit<Property, "images"> & { images: ResolvedImage[] };

/** Property images reference IMAGE_LIB keys; this materialises them. */
export function withResolvedImages(p: Property): ResolvedProperty {
  return {
    ...p,
    images: p.images.map((img) => {
      const base = resolveImage(img.src);
      return { src: base.src, alt: img.alt ?? base.alt, width: base.width, height: base.height };
    }),
  };
}

export function resolvedPropertyBySlug(slug: string): ResolvedProperty | undefined {
  const p = getPropertyBySlug(slug);
  return p ? withResolvedImages(p) : undefined;
}
