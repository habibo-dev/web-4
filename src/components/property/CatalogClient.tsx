"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { applyCatalog, filterToUrl, sortFromUrl, urlToFilter, type CatalogFilter, type CatalogSort } from "@/lib/catalog-query";
import { STATIC_SITE } from "@/lib/submit-mode";
import type { Property, PropertyType } from "@/lib/data/types";
import { PropertyCard } from "./PropertyCard";
import { SearchBar, type NeighborhoodOption } from "@/components/search/SearchBar";
import { SlidersIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  locale: Locale;
  all: Property[];
  initialFilter: CatalogFilter;
  initialSort: CatalogSort;
  neighborhoods: NeighborhoodOption[];
  /** lock the transaction tab (used by /sale and /rent) */
  lockTransaction?: "sale" | "rent";
};

export function CatalogClient({ locale, all, initialFilter, initialSort, neighborhoods, lockTransaction }: Props) {
  const m = getMessages(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<CatalogFilter>(initialFilter);
  const [sort, setSort] = useState<CatalogSort>(initialSort);
  const [panelOpen, setPanelOpen] = useState(() => countActive(initialFilter) > 0);

  /**
   * The static build cannot read the query string on the server, so deep
   * links (`/fr/properties?type=villa&priceMin=…`) are applied here, on
   * mount, instead. The Node build already arrives pre-filtered.
   */
  useEffect(() => {
    if (!STATIC_SITE) return;
    const sp = new URLSearchParams(window.location.search);
    if (![...sp.keys()].length) return;
    const fromUrl = urlToFilter(sp);
    const nextSort = sortFromUrl(sp);
    setFilter({ ...fromUrl, transaction: lockTransaction ?? fromUrl.transaction });
    setSort(nextSort);
    setPanelOpen(countActive(fromUrl) > 0);
  }, [lockTransaction]);

  const results = useMemo(() => applyCatalog(all, { ...filter, transaction: lockTransaction ?? filter.transaction }, sort), [all, filter, sort, lockTransaction]);

  const sync = useCallback(
    (next: CatalogFilter, nextSort: CatalogSort) => {
      const query = filterToUrl({ ...next, transaction: lockTransaction ?? next.transaction });
      const sortQ = nextSort !== "recent" ? (query ? `&sort=${nextSort}` : `?sort=${nextSort}`) : "";
      router.replace(`${pathname}${query}${sortQ}`, { scroll: false });
    },
    [pathname, router, lockTransaction],
  );

  const update = useCallback(
    (next: CatalogFilter) => {
      setFilter(next);
      sync(next, sort);
    },
    [sync, sort],
  );

  const setType = (t?: PropertyType) => {
    update({ ...filter, type: t });
    setPanelOpen(true);
  };

  const clear = () => {
    const reset: CatalogFilter = lockTransaction ? { transaction: lockTransaction } : {};
    setFilter(reset);
    setSort("recent");
    sync(reset, "recent");
  };

  const activeCount = countActive(filter);
  const count = results.length;

  return (
    <div>
      {/* Category tabs */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label={m.catalog.filters}>
        {[undefined, "apartment", "villa", "land", "commercial", "office"].map((t) => {
          const active = (filter.type ?? undefined) === t;
          return (
            <button key={t ?? "all"} role="tab" aria-selected={active} onClick={() => setType(t as PropertyType | undefined)} className={clsx("chip", active && "is-active")}>
              {t ? m.typesPlural[t as PropertyType] : m.common.allProperties}
            </button>
          );
        })}
        <button type="button" onClick={() => setPanelOpen((v) => !v)} className={clsx("chip ms-auto", panelOpen && "is-active")}>
          <SlidersIcon size={15} />
          {panelOpen ? m.catalog.hideFilters : m.catalog.showFilters}
          {activeCount > 0 && !panelOpen ? (
            <span className="ms-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brass-500 px-1 text-[0.65rem] font-bold text-forest-950">
              {activeCount}
            </span>
          ) : null}
        </button>
      </div>

      {panelOpen ? (
        <div className="mt-4 animate-fade-in">
          <SearchBar locale={locale} value={filter} onChange={update} neighborhoods={neighborhoods} variant="panel" />
        </div>
      ) : null}

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p className="text-[0.92rem] text-muted">
          <strong className="font-display text-xl font-semibold text-ink">{count}</strong>{" "}
          {count === 1 ? m.catalog.unitOne : m.catalog.unitMany}
          {activeCount > 0 ? (
            <button onClick={clear} className="link-arrow ms-4 !text-brass-600 underline-offset-4 hover:underline">
              {m.catalog.clearAll}
            </button>
          ) : null}
        </p>
        <label className="flex items-center gap-2 text-[0.85rem] text-muted">
          {m.catalog.sortBy}
          <select
            className="field-input !w-auto !py-1.5 !text-[0.85rem]"
            value={sort}
            onChange={(e) => {
              const s = e.target.value as CatalogSort;
              setSort(s);
              sync(filter, s);
            }}
          >
            <option value="recent">{m.catalog.sortRecent}</option>
            <option value="price-asc">{m.catalog.sortPriceAsc}</option>
            <option value="price-desc">{m.catalog.sortPriceDesc}</option>
            <option value="surface-desc">{m.catalog.sortSurface}</option>
          </select>
        </label>
      </div>

      {/* Grid */}
      {count > 0 ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p, i) => (
            <Reveal as="li" key={p.id} delay={Math.min(i, 5) * 60}>
              <PropertyCard p={p} locale={locale} priority={i < 3} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <h3 className="font-display text-2xl text-ink">{m.catalog.emptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-muted">{m.catalog.emptyLead}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={clear} className="btn btn-outline">
              {m.catalog.clearAll}
            </button>
            <a href={pathWithLocale(locale, "/contact")} className="btn btn-primary">
              {m.catalog.emptyCta}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function countActive(f: CatalogFilter): number {
  let n = 0;
  if (f.type) n++;
  if (f.neighborhood) n++;
  if (f.priceMin || f.priceMax) n++;
  if (f.surfaceMin || f.surfaceMax) n++;
  if (f.bedrooms) n++;
  if (f.q) n++;
  return n;
}
