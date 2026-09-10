import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";

import { buildMetadata, localeFrom, type PageParams } from "@/lib/page";
import { allPublished } from "@/lib/data/repo";
import { settings, telLink } from "@/lib/data/settings";
import { faq } from "@/lib/data/faq";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { MapEmbed } from "@/components/map/MapBridge";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { ClockIcon, ExternalIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/contact", {
    title: () => `${m.nav.contact} — 30 Rue Didouche Mourad, Alger Centre`,
    description: locale === "fr"
      ? "Contactez ISLEM Immobilier, agence immobilière à Alger Centre : 30 Rue Didouche Mourad, +213 772 226 303, WhatsApp, e-mail et formulaire de demande de visite."
      : "اتصل بـ ISLEM Immobilier، وكالة عقارية في وسط المدينة: 30 شارع ديدوش مراد، ‎+213 772 226 303، واتساب وبريد إلكتروني ونموذج طلب زيارة.",
  });
}

export default async function ContactPage({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  const waIntro = m.contact.whatsappIntro;
  const options = allPublished().map((p) => ({ slug: p.slug, title: p.title[locale] }));
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.contact.address.fr)}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${settings.contact.mapCoords.lat},${settings.contact.mapCoords.lng}`;

  return (
    <>
      <section className="paper-grain border-b border-line bg-sand/50">
        <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-16 sm:px-6 lg:px-10 lg:pt-20">
          <p className="eyebrow tracking-eyebrow mb-3 text-brass-600">{m.contact.kicker}</p>
          <h1 className="font-display max-w-2xl text-[2.4rem] leading-[1.08] sm:text-5xl">{m.contact.title}</h1>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-muted">{m.contact.lead}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:px-10">
        {/* info cards */}
        <div className="flex flex-col gap-4">
          <Reveal>
            <a href={gmaps} target="_blank" rel="noopener noreferrer" className="card card-hover group block p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-forest-800 text-brass-300">
                  <PinIcon size={20} />
                </span>
                <div>
                  <p className="eyebrow text-muted">{m.contact.addressLabel}</p>
                  <p className="font-display mt-1 text-lg leading-snug text-ink">{settings.contact.address[locale]}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-forest-700">
                    {m.contact.directions} <ExternalIcon size={13} className="transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
                  </p>
                </div>
              </div>
            </a>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal delay={70}>
              <a href={telLink()} className="card card-hover block p-6">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brass-100 text-brass-600">
                  <PhoneIcon size={18} />
                </span>
                <p className="eyebrow text-muted">{m.contact.phoneLabel}</p>
                <p className="mt-1 text-lg font-bold text-ink" dir="ltr">{settings.contact.phoneDisplay}</p>
              </a>
            </Reveal>
            <Reveal delay={140}>
              <a
                href={`https://wa.me/${settings.contact.whatsappPhone}?text=${encodeURIComponent(waIntro)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-hover block p-6"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4e9] text-[#25D366]">
                  <WhatsAppIcon size={19} />
                </span>
                <p className="eyebrow text-muted">{m.contact.whatsappLabel}</p>
                <p className="mt-1 text-lg font-bold text-ink">WhatsApp</p>
              </a>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <a href={`mailto:${settings.contact.email}`} className="card card-hover block p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-700">
                  <MailIcon size={18} />
                </span>
                <div>
                  <p className="eyebrow text-muted">{m.contact.emailLabel}</p>
                  <p className="mt-0.5 text-[1.02rem] font-semibold text-ink" dir="ltr">{settings.contact.email}</p>
                </div>
              </div>
            </a>
          </Reveal>

          <Reveal delay={220}>
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2 text-muted">
                <ClockIcon size={17} className="text-brass-600" />
                <p className="eyebrow">{m.contact.hoursLabel}</p>
              </div>
              <ul className="space-y-2.5 text-[0.95rem]">
                {settings.contact.hours[locale].map((h) => (
                  <li key={h.days} className="flex items-baseline gap-3">
                    <span className="text-ink/80">{h.days}</span>
                    <span className="h-px flex-1 translate-y-[-3px] bg-line" />
                    <strong className="tabular-nums" dir={locale === "ar" ? "rtl" : "ltr"}>{h.hours}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal>
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink">{m.contact.formTitle}</h2>
            <div className="mt-6">
              <InquiryForm locale={locale} kind="contact" properties={options} />
            </div>
            <p className="mt-6 text-[0.78rem] leading-relaxed text-muted/90">{settings.content.privacyNote[locale]}</p>
          </div>
        </Reveal>
      </section>

      {/* map */}
      <section className="mx-auto max-w-[1320px] px-5 pb-6 sm:px-6 lg:px-10">
        <h2 className="font-display mb-5 text-2xl font-semibold text-ink">{m.contact.mapLabel}</h2>
        <MapEmbed
          lat={settings.contact.mapCoords.lat}
          lng={settings.contact.mapCoords.lng}
          zoom={16}
          label="ISLEM Immobilier — Alger Centre"
          sublabel={settings.contact.address.fr}
          height={420}
        />
        <p className="mt-3 text-end">
          <a className="link-arrow !text-[0.85rem]" href={directions} target="_blank" rel="noopener noreferrer">
            {m.contact.directions} <span className="arr">→</span>
          </a>
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-6 lg:px-10">
        <h2 className="font-display mb-6 text-2xl font-semibold text-ink">{m.contact.faqTitle}</h2>
        <Accordion items={faq.slice(0, 3).map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
      </section>
    </>
  );
}
