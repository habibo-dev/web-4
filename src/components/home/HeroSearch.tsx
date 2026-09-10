"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, type NeighborhoodOption } from "@/components/search/SearchBar";
import type { Locale } from "@/lib/i18n/config";
import { pathWithLocale } from "@/lib/i18n/config";
import { filterToUrl, type CatalogFilter } from "@/lib/catalog-query";

export function HeroSearch({ locale, neighborhoods, initial }: { locale: Locale; neighborhoods: NeighborhoodOption[]; initial?: CatalogFilter }) {
  const router = useRouter();
  const [filter, setFilter] = useState<CatalogFilter>(initial ?? {});
  return (
    <SearchBar
      locale={locale}
      value={filter}
      onChange={setFilter}
      neighborhoods={neighborhoods}
      variant="hero"
      onSearch={() => router.push(pathWithLocale(locale, `/properties${filterToUrl(filter)}`))}
    />
  );
}
