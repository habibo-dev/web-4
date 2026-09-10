import Link from "next/link";
import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { featuredProperties, availableNeighborhoods } from "@/lib/data/repo";
import { services } from "@/lib/data/services";
import { publishedTestimonials } from "@/lib/data/testimonials";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { settings } from "@/lib/data/settings";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import {
  ArrowRightIcon,
  HandshakeIcon,
  HeartIcon,
  KeyIcon,
  CheckIcon,
  ChatIcon,
  ShieldIcon,
  SparkIcon,
  ScaleIcon,
  CompassIcon,
  BuildingIcon,
  PinIcon,
} from "@/components/icons";

/* ── Featured listings ──────────────────────────────────────────────── */

export function FeaturedBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const list = featuredProperties(6);
  if (list.length === 0) return null;

  return (
    <section className="border-y border-line bg-sand/55" aria-labelledby="featured-title">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading align="start" kicker={m.home.heroKicker} title={m.home.featuredTitle} lead={m.home.featuredLead} className="lg:max-w-xl" />
          <Button href={pathWithLocale(locale, "/properties")} variant="outline" className="hidden sm:inline-flex">
            {m.common.allProperties}
            <ArrowRightIcon size={16} className="rtl:-scale-x-100" />
          </Button>
        </div>
        <h2 id="featured-title" className="sr-only">
          {m.home.featuredTitle}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <Reveal as="li" key={p.id} delay={Math.min(i, 4) * 80}>
              <PropertyCard p={p} locale={locale} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 text-center sm:hidden">
          <Button href={pathWithLocale(locale, "/properties")} variant="outline">
            {m.common.allProperties} <ArrowRightIcon size={16} className="rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Trust / why ISLEM ──────────────────────────────────────────────── */

const TRUST_ICONS = { follow: <HandshakeIcon size={22} />, selection: <CheckIcon size={22} />, reactivity: <ChatIcon size={22} />, professional: <ShieldIcon size={22} /> } as const;

export function TrustBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
      <div>
        <SectionHeading align="start" kicker={m.home.trustTitle} title={m.home.trustLead} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {(Object.keys(m.home.trust) as (keyof typeof m.home.trust)[]).map((k, i) => (
            <Reveal as="li" key={k} delay={i * 90}>
              <div className="card card-hover h-full p-5">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-brass-300">{TRUST_ICONS[k]}</span>
                <h3 className="font-display text-lg font-semibold text-ink">{m.home.trust[k].title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">{m.home.trust[k].text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-lift sm:aspect-[4/4.4]">
          <Image src="/images/city/alger-facades.webp" alt={locale === "fr" ? "Façades restaurées du centre d'Alger" : "واجهات مُرممة في وسط الجزائر"} fill sizes="(min-width:1024px) 46vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent" />
          <figure className="absolute inset-x-5 bottom-5 rounded-2xl border border-bone/20 bg-forest-950/45 p-5 text-bone backdrop-blur-md">
            <blockquote className="font-display text-[1.18rem] leading-snug">
              {locale === "fr"
                ? "« Alger se vit quartier par quartier. Notre travail, c'est de vous y faire entrer comme un riverain, pas comme un visiteur. »"
                : "« تُعاش الجزائر حيا تلو الآخر. عملنا أن ندخلك إليها كما يسكنها أهلها، لا كزائر عابر. »"}
            </blockquote>
            <figcaption className="mt-3 text-[0.8rem] font-semibold uppercase tracking-widest text-brass-300">
              {settings.brand.name}
            </figcaption>
          </figure>
        </div>
        <div aria-hidden className="absolute -bottom-6 -start-6 hidden h-32 w-32 rounded-[2rem] border-2 border-brass-400/40 lg:block" />
      </Reveal>
    </section>
  );
}

/* ── Services preview ───────────────────────────────────────────────── */

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  key: <KeyIcon size={20} />,
  handshake: <HandshakeIcon size={20} />,
  building: <BuildingIcon size={20} />,
  scale: <ScaleIcon size={20} />,
  compass: <CompassIcon size={20} />,
};

export function ServicesBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section className="border-y border-line bg-forest-950 text-bone" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading tone="light" align="start" kicker={m.nav.services} title={m.home.servicesTitle} lead={m.home.servicesLead} className="lg:max-w-2xl" />
        <h2 id="services-title" className="sr-only">
          {m.home.servicesTitle}
        </h2>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 70}>
              <Link href={pathWithLocale(locale, "/services")} className="group flex h-full flex-col gap-4 bg-forest-950 p-6 transition-colors duration-300 hover:bg-forest-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-400/15 text-brass-300 transition group-hover:bg-brass-400 group-hover:text-forest-950">
                  {SERVICE_ICONS[s.icon]}
                </span>
                <h3 className="font-display text-xl font-semibold">{s.title[locale]}</h3>
                <p className="text-[0.88rem] leading-relaxed text-bone/60">{s.tagline[locale]}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.8rem] font-bold text-brass-300">
                  {locale === "fr" ? "En savoir plus" : "اعرف المزيد"}
                  <ArrowRightIcon size={14} className="rtl:-scale-x-100 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Process ────────────────────────────────────────────────────────── */

export function ProcessBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const steps = [m.home.process.s1, m.home.process.s2, m.home.process.s3, m.home.process.s4];
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading kicker={m.detail.requestVisit} title={m.home.processTitle} />
      <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div aria-hidden className="absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block" />
        {steps.map((s, i) => (
          <Reveal as="li" key={i} delay={i * 110} className="relative">
            <span className="font-display relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brass-400/50 bg-bone text-xl font-semibold text-brass-600 shadow-[0_0_0_8px_var(--color-bone)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-semibold text-ink">{s.title}</h3>
            <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ── Areas strip ────────────────────────────────────────────────────── */

export function AreasBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const available = availableNeighborhoods();
  const counts = new Map(available.map((a) => [a.id, a.count]));
  return (
    <section className="border-t border-line bg-sand/40" aria-labelledby="areas-title">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow tracking-eyebrow mb-2 inline-flex items-center gap-2 text-brass-600">
              <PinIcon size={13} /> {m.home.areasTitle}
            </p>
            <h2 id="areas-title" className="font-display text-3xl text-ink lg:text-4xl">
              {m.home.areasLead}
            </h2>
          </div>
          <Link href={pathWithLocale(locale, "/properties")} className="link-arrow">
            {m.common.allProperties} <ArrowRightIcon size={15} className="arr rtl:-scale-x-100" />
          </Link>
        </div>
        <ul className="no-scrollbar mt-8 flex gap-2.5 overflow-x-auto pb-2">
          {NEIGHBORHOODS.map((n) => {
            const c = counts.get(n.id);
            return (
              <li key={n.id}>
                <Link
                  href={c ? pathWithLocale(locale, `/properties?location=${n.id}`) : pathWithLocale(locale, "/contact")}
                  className="chip !bg-white transition hover:border-forest-800"
                  title={c ? undefined : locale === "fr" ? "Nous y cherchons pour vous" : "نبحث لك هناك"}
                >
                  {n.name[locale]}
                  {c ? <span className="rounded-full bg-forest-100 px-1.5 text-[0.68rem] font-bold text-forest-700">{c}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── Owner CTA band ─────────────────────────────────────────────────── */

export function OwnerCtaBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="ownerc-cta">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.2rem] border border-line bg-forest-900 shadow-lift">
          <Image src="/images/city/alger-evening-street.webp" alt="" fill aria-hidden className="object-cover opacity-30" sizes="(min-width:1024px) 1280px, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/35 rtl:bg-gradient-to-l" />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div className="text-bone">
              <p className="eyebrow tracking-eyebrow mb-4 inline-flex items-center gap-2 text-brass-300">
                <SparkIcon size={13} /> {locale === "fr" ? "Propriétaires" : "للمالكين"}
              </p>
              <h2 id="ownerc-cta" className="font-display text-3xl leading-tight sm:text-[2.5rem]">
                {m.home.ctaTitle}
              </h2>
              <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-bone/70">{m.home.ctaLead}</p>
            </div>
            <div className="flex flex-col items-start justify-end gap-5">
              <ul className="space-y-2.5 text-[0.95rem] text-bone/85">
                {[
                  locale === "fr" ? "Estimation de marché gratuite, sur place" : "تقييم مجاني للسوق، في عين المكان",
                  locale === "fr" ? "Reportage photo et annonce bilingue" : "تقرير مصور وإعلان بلغتين",
                  locale === "fr" ? "Aucune commission cachée : nos conditions sont données d'avance" : "بدون عمولات خفية: شروطنا تُسلَّم مسبقًا",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckIcon size={17} className="mt-0.5 shrink-0 text-brass-300" />
                    {t}
                  </li>
                ))}
              </ul>
              <Button href={pathWithLocale(locale, "/submit-property")} variant="brass">
                {m.home.ctaButton}
                <ArrowRightIcon size={16} className="rtl:-scale-x-100" />
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Testimonials (only when real approved feedback exists) ─────────── */

export function TestimonialsBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const list = publishedTestimonials();
  if (list.length === 0) return null; // never render fake reviews
  return (
    <section className="border-t border-line bg-sand/40" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10">
        <SectionHeading kicker={settings.brand.name} title={m.home.testimonialsTitle} />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 90}>
              <figure className="card h-full p-6">
                <HeartIcon size={20} className="text-brass-500" />
                <blockquote className="font-display mt-4 text-[1.05rem] leading-relaxed text-ink">“{t.quote[locale]}”</blockquote>
                <figcaption className="mt-5 text-[0.82rem] text-muted">
                  <strong className="text-ink">{t.author}</strong> · {t.context[locale]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
