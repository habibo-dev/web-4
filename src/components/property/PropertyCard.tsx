import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import type { Locale } from "@/lib/i18n/config";
import { pathWithLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import type { Property, PropertyType } from "@/lib/data/types";
import { neighborhoodLabel } from "@/lib/data/neighborhoods";
import { settings } from "@/lib/data/settings";
import { formatPrice, formatSurface } from "@/lib/format";
import { AreaIcon, ArrowRightIcon, BathIcon, BedIcon, BuildingIcon, DeskIcon, ShopIcon, TreeIcon, VillaIcon, HeartIcon, ShieldIcon } from "@/components/icons";

export function typeIcon(t: PropertyType, size = 17) {
  switch (t) {
    case "apartment":
      return <BuildingIcon size={size} />;
    case "villa":
      return <VillaIcon size={size} />;
    case "land":
      return <TreeIcon size={size} />;
    case "commercial":
      return <ShopIcon size={size} />;
    case "office":
      return <DeskIcon size={size} />;
  }
}

export function PropertyCard({
  p,
  locale,
  priority = false,
  className,
}: {
  p: Property;
  locale: Locale;
  priority?: boolean;
  className?: string;
}) {
  const m = getMessages(locale);
  const cur = settings.site.currencySymbol[locale];
  const cover = p.images[0];
  const isReserved = p.status === "reserved";

  const facts: { icon: React.ReactNode; label: string }[] = [];
  if (p.surface) facts.push({ icon: <AreaIcon size={15} />, label: formatSurface(p.surface, locale) });
  if (p.type !== "land" && p.bedrooms !== undefined && p.bedrooms > 0)
    facts.push({ icon: <BedIcon size={15} />, label: String(p.bedrooms) });
  if (p.type !== "land" && p.bathrooms !== undefined && p.bathrooms > 0)
    facts.push({ icon: <BathIcon size={15} />, label: String(p.bathrooms) });
  if (p.type !== "land" && p.features.includes("parking")) facts.push({ icon: <ShieldIcon size={15} />, label: m.features.parking });

  return (
    <article className={clsx("card card-hover group relative flex flex-col overflow-hidden", className)}>
      <Link href={pathWithLocale(locale, `/property/${p.slug}`)} className="flex h-full flex-col" prefetch={false}>
        <div className="relative aspect-[3/2] overflow-hidden bg-sand">
          <Image
            src={cover.src}
            alt={cover.alt[locale]}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={clsx(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]",
              isReserved && "saturate-[0.55]",
            )}
            priority={priority}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-ink shadow-sm backdrop-blur">
                {typeIcon(p.type, 13)}
                {m.types[p.type]}
              </span>
              <span className="inline-flex items-center rounded-full bg-forest-900/85 px-2.5 py-1 text-[0.7rem] font-semibold text-bone backdrop-blur">
                {m.transactions[p.transaction]}
              </span>
            </div>
            {p.labels.includes("coup-de-coeur") ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brass-400/95 px-2.5 py-1 text-[0.7rem] font-bold text-forest-950 shadow-sm">
                <HeartIcon size={12} />
                {m.labels["coup-de-coeur"]}
              </span>
            ) : null}
          </div>
          {isReserved ? (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent">
              <span className="m-3 rounded-full bg-ink/85 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-brass-300">
                {m.common.reserved}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[1.15rem] font-bold tracking-tight text-forest-900">
              {formatPrice(p.price.amount, locale, cur)}
              {p.price.period === "monthly" ? (
                <span className="ms-1 text-[0.8rem] font-medium text-muted">{m.common.monthly}</span>
              ) : null}
            </p>
            {p.labels.includes("nouveau") ? (
              <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[0.68rem] font-bold uppercase text-forest-700">
                {m.common.new}
              </span>
            ) : null}
          </div>

          <h3 className="font-display mt-2 line-clamp-2 text-[1.12rem] font-semibold leading-snug text-ink transition-colors group-hover:text-forest-700">
            {p.title[locale]}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.88rem] leading-relaxed text-muted">{p.excerpt[locale]}</p>

          <div className="mt-auto pt-4">
            <p className="eyebrow tracking-eyebrow flex items-center gap-1.5 text-[0.68rem] text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
              </svg>
              {neighborhoodLabel(p.neighborhood, locale)}
              <span className="ms-auto text-[0.62rem] font-medium tracking-normal text-muted/60">{p.reference}</span>
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3.5">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-muted">
                {facts.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-brass-600">{f.icon}</span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-forest-800 transition-all duration-300 group-hover:border-forest-800 group-hover:bg-forest-800 group-hover:text-bone">
                <ArrowRightIcon size={15} className="rtl:-scale-x-100" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
