import { getMessages } from "@/lib/i18n";
import { buildMetadata, catalogSeed, localeFrom, type PageParams, type PageSearch } from "@/lib/page";
import { CatalogView } from "@/components/property/CatalogView";

export async function generateMetadata({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/properties", {
    title: () => m.catalog.allTitle,
    description: locale === "fr"
      ? "Parcourez les appartements, villas, terrains, locaux commerciaux et bureaux proposés par ISLEM Immobilier à Alger — vente et location, filtrés par budget, surface et quartier."
      : "تصفّح الشقق والفلل والأراضي والمحلات التجارية والمكاتب التي تعرضها ISLEM Immobilier في الجزائر العاصمة — بيعًا وكراءً، مع تصفية حسب الميزانية والمساحة والحي.",
  });
}

export default async function PropertiesPage({ params, searchParams }: { params: PageParams; searchParams: PageSearch }) {
  const locale = await localeFrom(params);
  const { filter, sort } = await catalogSeed(searchParams);
  const m = getMessages(locale);

  return (
    <CatalogView
      locale={locale}
      initialFilter={filter}
      initialSort={sort}
      title={m.catalog.allTitle}
      lead={m.catalog.allLead}
    />
  );
}
