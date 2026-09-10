import { getMessages } from "@/lib/i18n";
import { buildMetadata, localeFrom, toSearchParams, type PageParams, type PageSearch } from "@/lib/page";
import { urlToFilter, sortFromUrl } from "@/lib/catalog-query";
import { CatalogView } from "@/components/property/CatalogView";

export async function generateMetadata({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/sale", {
    title: () => m.catalog.saleTitle,
    description: locale === "fr"
      ? "Achat immobilier à Alger : appartements et villas de caractère à Alger Centre, Hydra, El Biar, terrains, locaux et murs commerciaux — sélection vérifiée par l'agence."
      : "العقار للبيع في الجزائر: شقق وفلل ذات طابع في وسط المدينة وحيدرة والبير، إضافة إلى أراضٍ ومحلات — تشكيلة مُتحقق منها من الوكالة.",
  });
}

export default async function SalePage({ params, searchParams }: { params: PageParams; searchParams: PageSearch }) {
  const locale = await localeFrom(params);
  const sp = toSearchParams(await searchParams);
  const m = getMessages(locale);

  return (
    <CatalogView
      locale={locale}
      initialFilter={{ ...urlToFilter(sp), transaction: "sale" }}
      initialSort={sortFromUrl(sp)}
      lockTransaction="sale"
      title={m.catalog.saleTitle}
      lead={m.catalog.saleLead}
    />
  );
}
