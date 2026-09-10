import Link from "next/link";
import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { countByType } from "@/lib/data/repo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/icons";
import type { PropertyType } from "@/lib/data/types";

const TYPE_IMAGE: Record<PropertyType, { src: string; fr: string; ar: string }> = {
  apartment: { src: "/images/apt/living-bright.webp", fr: "Intérieur d'appartement moderne à Alger", ar: "داخِل شقة عصرية في الجزائر" },
  villa: { src: "/images/villa/exterior-pool.webp", fr: "Villa avec piscine dans les hauteurs d'Alger", ar: "فيلا بمسبح في مرتفعات الجزائر" },
  land: { src: "/images/land/plot-hill-view.webp", fr: "Terrain à bâtir dominant la plaine de la Mitidja", ar: "أرض للبناء تطل على متيجة" },
  commercial: { src: "/images/com/shop-front.webp", fr: "Vitrine d'un local commercial en centre-ville", ar: "واجهة محل تجاري في وسط المدينة" },
  office: { src: "/images/office/open-space.webp", fr: "Open-space lumineux dans un immeuble de bureaux", ar: "فضاء عمل مضيء في مبنى مكاتب" },
};

const ORDER: PropertyType[] = ["apartment", "villa", "land", "commercial", "office"];

export function CategoriesBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const counts = countByType();

  return (
    <section className="paper-grain mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cat-title">
      <SectionHeading kicker={m.nav.properties} title={m.home.categoriesTitle} lead={m.home.categoriesLead} />
      <h2 id="cat-title" className="sr-only">
        {m.home.categoriesTitle}
      </h2>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {ORDER.map((t, i) => {
          const img = TYPE_IMAGE[t];
          const big = i === 0 || i === 1;
          return (
            <Reveal as="li" key={t} delay={i * 70} className={big ? "lg:col-span-2 lg:row-span-1" : "lg:col-span-2"}>
              <Link
                href={pathWithLocale(locale, `/properties?type=${t}`)}
                className="group card card-hover relative block overflow-hidden"
              >
                <div className={`relative ${big ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[16/10]"} overflow-hidden`}>
                  <Image
                    src={img.src}
                    alt={img[locale]}
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-widest text-brass-300">
                      {counts[t]} {counts[t] > 1 ? m.catalog.unitMany : m.catalog.unitOne}
                    </p>
                    <h3 className="font-display mt-1 text-xl font-semibold text-bone">{m.typesPlural[t]}</h3>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center rounded-full bg-bone/15 text-bone opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRightIcon size={16} className="rtl:-scale-x-100" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
