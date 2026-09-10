import Image from "next/image";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale } from "@/lib/i18n/config";
import { buildMetadata, localeFrom, type PageParams } from "@/lib/page";
import { services } from "@/lib/data/services";
import { faq } from "@/lib/data/faq";
import { settings, waLink, telLink } from "@/lib/data/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { BreadcrumbGraph } from "@/lib/jsonld";
import {
  ArrowRightIcon,
  CheckIcon,
  CompassIcon,
  HandshakeIcon,
  KeyIcon,
  ScaleIcon,
  BuildingIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";

const ICONS: Record<string, React.ReactNode> = {
  key: <KeyIcon size={24} />,
  handshake: <HandshakeIcon size={24} />,
  building: <BuildingIcon size={24} />,
  scale: <ScaleIcon size={24} />,
  compass: <CompassIcon size={24} />,
};

const PHOTOS = [
  "/images/city/alger-facades.webp",
  "/images/apt/kitchen-open.webp",
  "/images/com/shop-front.webp",
  "/images/villa/garden-terrace.webp",
  "/images/office/meeting-glass.webp",
];

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/services", {
    title: () => `${m.nav.services} — Alger Centre`,
    description: locale === "fr"
      ? "Achat, vente, location, estimation et conseil immobilier à Alger Centre : chaque service d'ISLEM Immobilier, étape par étape, sans surprise."
      : "الشراء والبيع والكراء والتقييم والاستشارة العقارية في وسط مدينة الجزائر: خدمات ISLEM Immobilier خطوة بخطوة و دون مفاجآت.",
  });
}

export default async function ServicesPage({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);

  return (
    <>
      <BreadcrumbGraph
        locale={locale}
        trail={[{ name: m.nav.home, url: "/" }, { name: m.nav.services }]}
      />

      {/* header */}
      <section className="paper-grain border-b border-line bg-sand/50">
        <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-16 sm:px-6 lg:px-10 lg:pb-16 lg:pt-20">
          <p className="eyebrow tracking-eyebrow mb-3 text-brass-600">{m.servicesPage.kicker}</p>
          <h1 className="font-display max-w-3xl text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem]">{m.servicesPage.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{m.servicesPage.lead}</p>
        </div>
      </section>

      {/* services */}
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
        {services.map((s, i) => (
          <Reveal key={s.key}>
            <section
              id={s.key}
              aria-labelledby={`s-${s.key}`}
              className="grid items-center gap-8 border-b border-line py-14 last:border-b-0 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:py-20"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3.5">
                  <span className="font-display flex h-9 w-9 items-center justify-center rounded-full text-[0.8rem] font-bold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-forest-800">{ICONS[s.icon]}</span>
                </div>
                <h2 id={`s-${s.key}`} className="font-display mt-4 text-3xl leading-tight text-ink lg:text-[2.4rem]">
                  {s.title[locale]}
                </h2>
                <p className="mt-2 text-[1.02rem] font-medium text-brass-600">{s.tagline[locale]}</p>
                <p className="mt-4 max-w-xl text-[1rem] leading-[1.75] text-ink/85">{s.description[locale]}</p>

                <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.9rem]">
                      <CheckIcon size={15} className="mt-0.5 shrink-0 text-forest-600" />
                      {b[locale]}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={pathWithLocale(locale, "/contact")} variant="primary">
                    {locale === "fr" ? `Parler ${s.title.fr.toLowerCase()}` : `تحدث عن ${s.title.ar}`}
                    <ArrowRightIcon size={15} className="rtl:-scale-x-100" />
                  </Button>
                  <Button href={pathWithLocale(locale, "/submit-property")} variant="outline">
                    {m.nav.submitProperty}
                  </Button>
                </div>
              </div>

              <div className={`relative aspect-[16/11] overflow-hidden rounded-[1.75rem] border border-line shadow-card ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <Image
                  src={PHOTOS[i % PHOTOS.length]}
                  alt={s.tagline[locale]}
                  fill
                  sizes="(min-width:1024px) 44vw, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/25 to-transparent" />
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* FAQ */}
      <section className="bg-forest-950 py-16 lg:py-20" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-10">
          <div>
            <SectionHeading tone="light" align="start" kicker={m.contact.faqTitle} title={m.servicesPage.faqTitle} />
            <div className="mt-8 hidden flex-col gap-3 lg:flex">
              <a href={waLink(locale === "fr" ? "Bonjour, j'ai une question sur vos services." : "مرحبًا، لدي سؤال حول خدماتكم.")} target="_blank" rel="noopener noreferrer" className="btn btn-light self-start">
                <WhatsAppIcon size={16} /> {m.common.whatsapp}
              </a>
              <a href={telLink()} className="btn btn-light self-start">
                <PhoneIcon size={16} /> <span dir="ltr">{settings.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>
          <h2 id="faq-title" className="sr-only">{m.servicesPage.faqTitle}</h2>
          <Accordion
            items={faq.map((f) => ({ q: f.q[locale], a: f.a[locale] }))}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 lg:px-10">
        <div className="card flex flex-wrap items-center justify-between gap-6 p-8 sm:p-10">
          <div className="max-w-xl">
            <h2 className="font-display text-[1.7rem] leading-tight text-ink">{m.servicesPage.ctaTitle}</h2>
            <p className="mt-2 text-[0.95rem] text-muted">{m.servicesPage.ctaLead}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={pathWithLocale(locale, "/contact")} variant="primary">{m.contact.title}</Button>
            <Button href={pathWithLocale(locale, "/properties")} variant="outline">{m.common.allProperties}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
