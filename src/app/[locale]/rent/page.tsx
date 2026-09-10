import { getMessages } from "@/lib/i18n";
import { buildMetadata, catalogSeed, localeFrom, type PageParams, type PageSearch } from "@/lib/page";
import { CatalogView } from "@/components/property/CatalogView";

export async function generateMetadata({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/rent", {
    title: () => m.catalog.rentTitle,
    description: locale === "fr"
      ? "Location à Alger : appartements meublés et vides, villas avec jardin, bureaux et locaux commerciaux. Dossiers étudiés rapidement, visites sur rendez-vous."
      : "الكراء في الجزائر: شقق مفروشة وغير مفروشة، فلل بحدائق، مكاتب ومحلات تجارية. دراسة سريعة للملفات وزيارات بموعد مسبق.",
  });
}

export default async function RentPage({ params, searchParams }: { params: PageParams; searchParams: PageSearch }) {
  const locale = await localeFrom(params);
  const { filter, sort } = await catalogSeed(searchParams);
  const m = getMessages(locale);

  return (
    <CatalogView
      locale={locale}
      initialFilter={{ ...filter, transaction: "rent" }}
      initialSort={sort}
      lockTransaction="rent"
      title={m.catalog.rentTitle}
      lead={m.catalog.rentLead}
    />
  );
}
