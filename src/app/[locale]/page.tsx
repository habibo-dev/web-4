import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/page";
import { getMessages } from "@/lib/i18n";
import { Hero } from "@/components/home/Hero";
import { CategoriesBand } from "@/components/home/CategoriesBand";
import { FeaturedBand, TrustBand, ServicesBand, ProcessBand, AreasBand, OwnerCtaBand, TestimonialsBand } from "@/components/home/Bands";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "fr";
  const m = getMessages(l);
  return {
    ...buildMetadata(l, "/", { title: () => m.home.heroTitle }),
    alternates: {
      canonical: buildMetadata(l, "/").alternates?.canonical,
      languages: { "fr-DZ": "/", "ar-DZ": "/ar", "x-default": "/" },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  return (
    <>
      <Hero locale={locale} />
      <CategoriesBand locale={locale} />
      <FeaturedBand locale={locale} />
      <TrustBand locale={locale} />
      <ServicesBand locale={locale} />
      <ProcessBand locale={locale} />
      <TestimonialsBand locale={locale} />
      <AreasBand locale={locale} />
      <OwnerCtaBand locale={locale} />
    </>
  );
}
