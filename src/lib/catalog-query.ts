import type { Property, PropertyType, Transaction } from "@/lib/data/types";

/**
 * Pure filtering logic shared by the server repository and the client
 * catalog — one source of truth for what a query means.
 */

export type CatalogFilter = {
  transaction?: Transaction;
  type?: PropertyType;
  neighborhood?: string;
  priceMin?: number;
  priceMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  bedrooms?: number;
  q?: string;
};

export type CatalogSort = "recent" | "price-asc" | "price-desc" | "surface-desc";

export function urlToFilter(sp: URLSearchParams): CatalogFilter {
  const num = (k: string) => {
    const v = sp.get(k);
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const t = sp.get("transaction");
  const ty = sp.get("type");
  return {
    transaction: t === "sale" || t === "rent" ? t : undefined,
    type: ty && ["apartment", "villa", "land", "commercial", "office"].includes(ty) ? (ty as PropertyType) : undefined,
    neighborhood: sp.get("location") ?? undefined,
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    surfaceMin: num("surfaceMin"),
    surfaceMax: num("surfaceMax"),
    bedrooms: num("bedrooms"),
    q: sp.get("q") ?? undefined,
  };
}

export function filterToUrl(f: CatalogFilter): string {
  const sp = new URLSearchParams();
  if (f.transaction) sp.set("transaction", f.transaction);
  if (f.type) sp.set("type", f.type);
  if (f.neighborhood) sp.set("location", f.neighborhood);
  if (f.priceMin) sp.set("priceMin", String(f.priceMin));
  if (f.priceMax) sp.set("priceMax", String(f.priceMax));
  if (f.surfaceMin) sp.set("surfaceMin", String(f.surfaceMin));
  if (f.surfaceMax) sp.set("surfaceMax", String(f.surfaceMax));
  if (f.bedrooms) sp.set("bedrooms", String(f.bedrooms));
  if (f.q) sp.set("q", f.q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function sortFromUrl(sp: URLSearchParams): CatalogSort {
  const s = sp.get("sort");
  return s === "price-asc" || s === "price-desc" || s === "surface-desc" ? s : "recent";
}

export function matches(p: Property, f: CatalogFilter): boolean {
  if (f.transaction && p.transaction !== f.transaction) return false;
  if (f.type && p.type !== f.type) return false;
  if (f.neighborhood && p.neighborhood !== f.neighborhood) return false;
  if (f.priceMin !== undefined && p.price.amount < f.priceMin) return false;
  if (f.priceMax !== undefined && p.price.amount > f.priceMax) return false;
  if (f.surfaceMin !== undefined && p.surface < f.surfaceMin) return false;
  if (f.surfaceMax !== undefined && p.surface > f.surfaceMax) return false;
  if (f.bedrooms !== undefined && f.bedrooms > 0 && (p.bedrooms ?? 0) < f.bedrooms) return false;
  if (f.q) {
    const q = f.q.toLowerCase();
    const hay = `${p.title.fr} ${p.title.ar} ${p.excerpt.fr} ${p.excerpt.ar} ${p.reference} ${p.slug}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function applyCatalog(list: Property[], f: CatalogFilter, sort: CatalogSort): Property[] {
  const out = list.filter((p) => matches(p, f));
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return out.sort((a, b) => b.price.amount - a.price.amount);
    case "surface-desc":
      return out.sort((a, b) => b.surface - a.surface);
    default:
      return out;
  }
}
