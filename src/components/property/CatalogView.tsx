import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { allPublished, availableNeighborhoods, withResolvedImages } from "@/lib/data/repo";
import type { CatalogFilter, CatalogSort } from "@/lib/catalog-query";
import { CatalogClient } from "./CatalogClient";

export function CatalogView({
  locale,
  initialFilter,
  initialSort,
  lockTransaction,
  title,
  lead,
}: {
  locale: Locale;
  initialFilter: CatalogFilter;
  initialSort: CatalogSort;
  lockTransaction?: "sale" | "rent";
  title: string;
  lead: string;
}) {
  const m = getMessages(locale);
  const all = allPublished().map(withResolvedImages);
  const neighborhoods = availableNeighborhoods().map((n) => ({
    id: n.id,
    fr: n.name.fr,
    ar: n.name.ar,
    count: n.count,
  }));

  return (
    <>
      <section className="paper-grain border-b border-line bg-sand/50">
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-10">
          <nav aria-label="Fil d'Ariane" className="mb-4 text-[0.8rem] text-muted">
            <a href={`/${locale}`} className="hover:text-ink">{m.nav.home}</a>
            <span className="mx-2 text-line">/</span>
            <span className="font-semibold text-ink">{title}</span>
          </nav>
          <p className="eyebrow tracking-eyebrow mb-3 text-brass-600">{m.home.heroKicker}</p>
          <h1 className="font-display max-w-3xl text-[2.3rem] leading-[1.08] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted">{lead}</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-5 py-10 sm:px-6 lg:px-10">
        <CatalogClient
          locale={locale}
          all={all}
          initialFilter={initialFilter}
          initialSort={initialSort}
          neighborhoods={neighborhoods}
          lockTransaction={lockTransaction}
        />
      </section>
    </>
  );
}
