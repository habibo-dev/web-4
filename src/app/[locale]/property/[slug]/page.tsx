import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { isLocale, LOCALES, pathWithLocale, type Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/page";
import { properties, agentForListing } from "@/lib/data/properties";
import { allPublished, getPropertyBySlug, similarProperties, withResolvedImages } from "@/lib/data/repo";
import { getAgent } from "@/lib/data/agents";
import { ListingGraph, BreadcrumbGraph } from "@/lib/jsonld";
import { getNeighborhood, neighborhoodLabel } from "@/lib/data/neighborhoods";
import { settings, telLink, waLink } from "@/lib/data/settings";
import { formatPrice, formatSurface, formatDate } from "@/lib/format";
import { Gallery } from "@/components/property/Gallery";
import { AgentCard } from "@/components/property/AgentCard";
import { ShareButton } from "@/components/property/ShareButton";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { MapEmbed } from "@/components/map/MapBridge";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  AreaIcon,
  BathIcon,
  BedIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PinIcon,
  PhoneIcon,
  WhatsAppIcon,
  HomeIcon,
  VillaIcon,
} from "@/components/icons";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => properties.map((p) => ({ locale, slug: p.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

function resolve(params: Params) {
  return params.then(async ({ locale, slug }) => {
    if (!isLocale(locale)) notFound();
    const p = getPropertyBySlug(slug);
    if (!p) notFound();
    return { locale, p: withResolvedImages(p) };
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, p } = await resolve(params);
  const title = p.title[locale];
  return {
    ...buildMetadata(locale, `/property/${p.slug}`, {
      title: () => title,
      description: p.excerpt[locale],
      type: "article",
    }),
    // full-bleed absolute URLs for social
    openGraph: {
      type: "article",
      url: `${settings.site.url}/${locale}/property/${p.slug}`,
      title,
      description: p.excerpt[locale],
      siteName: settings.seo.siteName,
      images: p.images.slice(0, 4).map((i) => `${settings.site.url}${i.src}`),
    },
    other: { "og:price:amount": String(p.price.amount), "og:price:currency": settings.site.currency },
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { p } = await resolve(params);
  const locale: Locale = (await params).locale as Locale;
  const m = getMessages(locale);
  const nb = getNeighborhood(p.neighborhood);
  const agent = getAgent(agentForListing(p))!;
  const cur = settings.site.currencySymbol[locale];
  const perM2 = p.transaction === "sale" && p.surface ? Math.round(p.price.amount / p.surface) : undefined;
  const similar = similarProperties(p, 3).map(withResolvedImages);
  const options = allPublished().map((o) => ({ slug: o.slug, title: o.title[locale] }));

  const waText =
    locale === "fr"
      ? `Bonjour ISLEM Immobilier, je suis intéressé(e) par le bien ${p.reference} — « ${p.title.fr} » (${formatPrice(p.price.amount, "fr", cur)}${p.price.period === "monthly" ? " / mois" : ""}) vu sur votre site. Pouvons-nous organiser une visite ?`
      : `مرحبًا ISLEM Immobilier، أنا مهتم بالعقار ${p.reference} — «${p.title.ar}» (${formatPrice(p.price.amount, "ar", cur)}${p.price.period === "monthly" ? " شهريًا" : ""}) الذي رأيته في موقعكم. هل يمكن ترتيب زيارة؟`;

  const facts = [
    { icon: <AreaIcon size={17} />, label: m.detail.surfaceLabel, value: formatSurface(p.surface, locale) },
    ...(p.plotArea ? [{ icon: <VillaIcon size={17} />, label: m.detail.plotLabel, value: formatSurface(p.plotArea, locale) }] : []),
    ...(p.type === "land"
      ? []
      : [
          ...(p.rooms ? [{ icon: <BuildingIcon size={17} />, label: m.detail.roomsLabel, value: String(p.rooms) }] : []),
          ...(p.bedrooms !== undefined ? [{ icon: <BedIcon size={17} />, label: m.detail.bedroomsLabel, value: String(p.bedrooms) }] : []),
          ...(p.bathrooms !== undefined ? [{ icon: <BathIcon size={17} />, label: m.detail.bathroomsLabel, value: String(p.bathrooms) }] : []),
        ]),
    ...(p.floor ? [{ icon: <HomeIcon size={17} />, label: m.detail.floorLabel, value: p.floor[locale] }] : []),
    ...(p.furnished !== undefined ? [{ icon: <CheckIcon size={17} />, label: m.detail.furnishedLabel, value: p.furnished ? m.detail.furnishedYes : m.detail.furnishedNo }] : []),
    ...(p.yearBuilt ? [{ icon: <CalendarIcon size={17} />, label: m.detail.yearLabel, value: String(p.yearBuilt) }] : []),
  ];

  return (
    <>
      <ListingGraph locale={locale} property={p} />
      <BreadcrumbGraph
        locale={locale}
        trail={[
          { name: m.nav.home, url: "/" },
          { name: m.nav.properties, url: "/properties" },
          { name: p.title[locale] },
        ]}
      />

      {/* ── header ── */}
      <section className="border-b border-line bg-sand/40">
        <div className="mx-auto max-w-[1320px] px-5 pb-8 pt-6 sm:px-6 lg:px-10">
          <nav aria-label={m.a11y.breadcrumb} className="text-[0.78rem] text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={pathWithLocale(locale)} className="hover:text-ink">{m.nav.home}</Link>
                <span className="px-1 text-line">/</span>
              </li>
              <li>
                <Link href={pathWithLocale(locale, `/properties?type=${p.type}`)} className="hover:text-ink">{m.typesPlural[p.type]}</Link>
                <span className="px-1 text-line">/</span>
              </li>
              <li className="max-w-[40ch] truncate font-semibold text-ink">{p.title[locale]}</li>
            </ol>
          </nav>

          <div className="mt-5 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wide text-bone">
                  {m.transactions[p.transaction]}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[0.72rem] font-semibold text-muted">
                  <PinIcon size={12} className="text-brass-600" />
                  {neighborhoodLabel(p.neighborhood, locale)}
                </span>
                {p.labels.map((l) => (
                  <span key={l} className="inline-flex items-center gap-1 rounded-full bg-brass-100 px-3 py-1 text-[0.72rem] font-bold text-brass-600">
                    {m.labels[l]}
                  </span>
                ))}
                {p.status === "reserved" ? (
                  <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wide text-brass-300">{m.common.reserved}</span>
                ) : null}
              </div>

              <h1 className="font-display mt-4 max-w-3xl text-[1.9rem] leading-[1.15] sm:text-[2.6rem]">{p.title[locale]}</h1>

              <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.82rem] text-muted">
                <span>
                  {m.common.reference} <strong className="font-mono text-ink">{p.reference}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon size={13} /> {m.common.listedOn} {formatDate(p.publishedAt, locale)}
                </span>
              </p>
            </div>

            <div className="flex items-end justify-between gap-5 lg:flex-col lg:items-end">
              <div className="text-start lg:text-end">
                <p className="font-display text-[1.9rem] font-semibold leading-none text-forest-900">
                  {formatPrice(p.price.amount, locale, cur)}
                  {p.price.period === "monthly" ? <span className="ms-2 text-sm font-medium text-muted">{m.common.monthly}</span> : null}
                </p>
                {perM2 ? <p className="mt-1.5 text-[0.8rem] text-muted">≈ {formatPrice(perM2, locale, cur)} / {locale === "fr" ? "m²" : "م²"}</p> : null}
                {p.price.negotiable ? <p className="mt-1 text-[0.8rem] font-semibold text-brass-600">{m.common.negotiable}</p> : null}
              </div>
              <ShareButton locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* ── body ── */}
      <article className="mx-auto grid max-w-[1320px] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1.65fr_1fr] lg:gap-12 lg:px-10">
        <div className="min-w-0">
          <Gallery images={p.images} locale={locale} />

          {/* key facts */}
          <section className="mt-8" aria-label={m.detail.keyFacts}>
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {facts.map((f, i) => (
                <li key={i} className="flex items-center gap-3 bg-white px-4 py-3.5">
                  <span className="text-brass-600">{f.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-wider text-muted">{f.label}</span>
                    <span className="block truncate text-[0.95rem] font-semibold text-ink">{f.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* description */}
          <section className="mt-10" aria-labelledby="desc">
            <h2 id="desc" className="font-display text-2xl font-semibold text-ink">{m.detail.overview}</h2>
            <div className="mt-4 space-y-4 text-[1rem] leading-[1.75] text-ink/85">
              {p.description[locale].split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* features */}
          {p.features.length > 0 ? (
            <section className="mt-10" aria-labelledby="feat">
              <h2 id="feat" className="font-display text-2xl font-semibold text-ink">{m.detail.features}</h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.92rem]">
                    <CheckIcon size={15} className="shrink-0 text-forest-600" />
                    {m.features[f]}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* location */}
          <section className="mt-10" aria-labelledby="loc">
            <h2 id="loc" className="font-display text-2xl font-semibold text-ink">{m.detail.locationTitle}</h2>
            <p className="mt-2 text-[0.92rem] text-muted">{m.detail.locationLead}</p>
            <div className="mt-5">
              <MapEmbed
                lat={p.coords.lat}
                lng={p.coords.lng}
                label={nb?.name[locale] ?? "Alger"}
                sublabel={p.title[locale]}
                height={340}
              />
            </div>
            {nb?.note ? (
              <p className="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-[0.88rem] leading-relaxed text-muted">
                <PinIcon size={14} className="me-1 inline text-brass-600" />
                {nb.note[locale]}
              </p>
            ) : null}
          </section>

          {/* visit request */}
          <section id="visite" className="mt-12 scroll-mt-28" aria-labelledby="visit-h">
            <h2 id="visit-h" className="font-display text-2xl font-semibold text-ink">{m.visit.title}</h2>
            <p className="mt-2 max-w-2xl text-[0.95rem] text-muted">{m.visit.lead}</p>
            <div className="card mt-5 p-5 sm:p-7">
              <InquiryForm locale={locale} kind="visit" defaultProperty={p.slug} properties={options} lockProperty />
            </div>
          </section>
        </div>

        {/* ── aside ── */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-[0.8rem] font-semibold uppercase tracking-widest text-muted">{m.detail.visitBox}</p>
            <p className="font-display mt-2 text-[1.7rem] font-semibold leading-tight text-forest-900">
              {formatPrice(p.price.amount, locale, cur)}
              {p.price.period === "monthly" ? <span className="ms-2 text-sm font-medium text-muted">{m.common.monthly}</span> : null}
            </p>
            <div className="mt-5 grid gap-2">
              <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                <WhatsAppIcon size={17} /> {m.detail.agentWhatsapp}
              </a>
              <a href={telLink()} className="btn btn-outline w-full">
                <PhoneIcon size={16} /> <span dir="ltr">{settings.contact.phoneDisplay}</span>
              </a>
              <a href="#visite" className="btn btn-brass w-full">
                <CalendarIcon size={16} /> {m.detail.requestVisit}
              </a>
            </div>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">{m.detail.visitBoxLead}</p>
          </div>

          <AgentCard agent={agent} locale={locale} title={`${m.detail.listingWord} ${p.reference} — ${p.title[locale]}`} whatsappText={waText} />

          <p className="rounded-2xl border border-line bg-sand/50 px-4 py-3.5 text-[0.75rem] leading-relaxed text-muted">
            <strong className="font-semibold text-ink">{m.detail.disclaimerTitle} — </strong>
            {settings.content.listingsDisclaimer[locale]}
          </p>
        </aside>
      </article>

      {/* similar */}
      <section className="border-t border-line bg-sand/40" aria-labelledby="similar">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-10">
          {similar.length > 0 ? (
            <>
              <SectionHeading align="start" kicker={m.nav.properties} title={m.detail.similarTitle} />
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((o, i) => (
                  <Reveal as="li" key={o.id} delay={i * 80}>
                    <PropertyCard p={o} locale={locale} />
                  </Reveal>
                ))}
              </ul>
            </>
          ) : (
            <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="text-[0.95rem] text-muted">{m.detail.similarEmpty}</p>
              <Link href={pathWithLocale(locale, "/contact")} className="btn btn-outline btn-sm">
                {m.catalog.emptyCta}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
