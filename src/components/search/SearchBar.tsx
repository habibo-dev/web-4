"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { CatalogFilter } from "@/lib/catalog-query";
import type { PropertyType, Transaction } from "@/lib/data/types";
import { SearchIcon, AreaIcon } from "@/components/icons";

export type NeighborhoodOption = { id: string; fr: string; ar: string; count: number };

type Props = {
  locale: Locale;
  value: CatalogFilter;
  onChange: (f: CatalogFilter) => void;
  neighborhoods: NeighborhoodOption[];
  variant?: "hero" | "panel";
  /** hero variant: Enter/submit jumps to the catalog */
  onSearch?: () => void;
};

/** The six-criterion search: transaction · type · location · budget · surface · bedrooms. */
export function SearchBar({ locale, value, onChange, neighborhoods, variant = "panel", onSearch }: Props) {
  const m = getMessages(locale);
  const [budgetText, setBudgetText] = useState({
    min: value.priceMin ? String(value.priceMin) : "",
    max: value.priceMax ? String(value.priceMax) : "",
    sMin: value.surfaceMin ? String(value.surfaceMin) : "",
    sMax: value.surfaceMax ? String(value.surfaceMax) : "",
  });

  /**
   * The numeric fields are local until blur, so they can drift from the
   * filter that actually applies (deep link on mount, "clear all", the
   * static build hydrating from the query string). Re-sync them whenever the
   * incoming values change — the guard keeps typing untouched, because
   * typing alone does not change `value`.
   */
  useEffect(() => {
    setBudgetText((b) => {
      const next = {
        min: value.priceMin ? String(value.priceMin) : "",
        max: value.priceMax ? String(value.priceMax) : "",
        sMin: value.surfaceMin ? String(value.surfaceMin) : "",
        sMax: value.surfaceMax ? String(value.surfaceMax) : "",
      };
      return next.min === b.min && next.max === b.max && next.sMin === b.sMin && next.sMax === b.sMax ? b : next;
    });
  }, [value.priceMin, value.priceMax, value.surfaceMin, value.surfaceMax]);

  const set = (patch: Partial<CatalogFilter>) => onChange({ ...value, ...patch });
  const toNum = (s: string) => {
    const n = Number(s.replace(/[^\d]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const applyBudgets = (next: typeof budgetText) => {
    setBudgetText(next);
    set({ priceMin: toNum(next.min), priceMax: toNum(next.max), surfaceMin: toNum(next.sMin), surfaceMax: toNum(next.sMax) });
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.();
      }}
      aria-label={m.search.title}
      className={clsx(
        "grid gap-x-4 gap-y-4",
        isHero
          ? "rounded-2xl border border-line bg-white/95 p-4 shadow-lift backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
          : "rounded-2xl border border-line bg-white p-4 sm:p-5",
      )}
    >
      {/* Transaction */}
      <div>
        <span className="field-label">{m.search.transaction}</span>
        <div className="grid grid-cols-3 gap-1 rounded-full border border-line bg-sand/60 p-1" role="group">
          {(
            [
              ["", m.search.any],
              ["sale", m.transactions.sale],
              ["rent", m.transactions.rent],
            ] as const
          ).map(([t, label]) => {
            const active = (value.transaction ?? "") === t;
            return (
              <button
                key={t || "any"}
                type="button"
                aria-pressed={active}
                onClick={() => set({ transaction: (t || undefined) as Transaction | undefined })}
                className={clsx(
                  "rounded-full px-2 py-1.5 text-[0.78rem] font-semibold transition-all",
                  active ? "bg-forest-800 text-bone shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property type */}
      <label className="block">
        <span className="field-label">{m.search.type}</span>
        <select
          className="field-input"
          value={value.type ?? ""}
          onChange={(e) => set({ type: (e.target.value || undefined) as PropertyType | undefined })}
        >
          <option value="">{m.search.anyType}</option>
          {(["apartment", "villa", "land", "commercial", "office"] as const).map((t) => (
            <option key={t} value={t}>
              {m.typesPlural[t]}
            </option>
          ))}
        </select>
      </label>

      {/* Location */}
      <label className="block">
        <span className="field-label">{m.search.location}</span>
        <select
          className="field-input"
          value={value.neighborhood ?? ""}
          onChange={(e) => set({ neighborhood: e.target.value || undefined })}
        >
          <option value="">{m.search.anyLocation}</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n[locale]} ({n.count})
            </option>
          ))}
        </select>
      </label>

      {/* Bedrooms */}
      <div>
        <span className="field-label">{m.search.bedrooms}</span>
        <div className="flex gap-1.5" role="group">
          {[undefined, 1, 2, 3, 4].map((b) => {
            const active = value.bedrooms === b || (b === undefined && value.bedrooms === undefined);
            return (
              <button
                key={b ?? "any"}
                type="button"
                aria-pressed={active}
                onClick={() => set({ bedrooms: b })}
                className={clsx("chip flex-1 !justify-center !px-2 !py-[0.44rem]", active && "is-active")}
              >
                {b === undefined ? m.search.anyBedrooms : b === 4 ? `4+` : b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="lg:col-span-2">
        <span className="field-label flex items-center gap-1.5">
          {m.search.budget}
          {(value.priceMin || value.priceMax) && (
            <button
              type="button"
              onClick={() => applyBudgets({ ...budgetText, min: "", max: "" })}
              className="ms-1 rounded-full bg-forest-100 px-1.5 text-[0.62rem] font-bold text-forest-700 normal-case"
            >
              ✕
            </button>
          )}
        </span>
        <div className="flex items-center gap-2">
          <input
            name="budgetMin"
            inputMode="numeric"
            placeholder={m.search.phMin[value.transaction ?? "sale"]}
            className="field-input !py-2"
            value={budgetText.min}
            onChange={(e) => setBudgetText((b) => ({ ...b, min: e.target.value }))}
            onBlur={(e) => applyBudgets({ ...budgetText, min: e.target.value })}
          />
          <span className="text-muted">—</span>
          <input
            name="budgetMax"
            inputMode="numeric"
            placeholder={m.search.phMax[value.transaction ?? "sale"]}
            className="field-input !py-2"
            value={budgetText.max}
            onChange={(e) => setBudgetText((b) => ({ ...b, max: e.target.value }))}
            onBlur={(e) => applyBudgets({ ...budgetText, max: e.target.value })}
          />
        </div>
      </div>

      {/* Surface */}
      <div>
        <span className="field-label flex items-center gap-1.5">
          <AreaIcon size={13} className="text-brass-600" />
          {m.search.surface}
          {(value.surfaceMin || value.surfaceMax) && (
            <button
              type="button"
              onClick={() => applyBudgets({ ...budgetText, sMin: "", sMax: "" })}
              className="ms-1 rounded-full bg-forest-100 px-1.5 text-[0.62rem] font-bold text-forest-700 normal-case"
            >
              ✕
            </button>
          )}
        </span>
        <div className="flex items-center gap-2">
          <input
            name="surfaceMin"
            inputMode="numeric"
            placeholder={m.search.min}
            className="field-input !py-2"
            value={budgetText.sMin}
            onChange={(e) => setBudgetText((b) => ({ ...b, sMin: e.target.value }))}
            onBlur={(e) => applyBudgets({ ...budgetText, sMin: e.target.value })}
          />
          <span className="text-muted">—</span>
          <input
            name="surfaceMax"
            inputMode="numeric"
            placeholder={m.search.max}
            className="field-input !py-2"
            value={budgetText.sMax}
            onChange={(e) => setBudgetText((b) => ({ ...b, sMax: e.target.value }))}
            onBlur={(e) => applyBudgets({ ...budgetText, sMax: e.target.value })}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-end">
        <button type="submit" className="btn btn-primary w-full" aria-label={m.search.submit}>
          <SearchIcon size={17} />
          {m.search.submit}
        </button>
      </div>
    </form>
  );
}
