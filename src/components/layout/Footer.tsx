import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/Brand";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n";
import { settings, telLink, waLink } from "@/lib/data/settings";

export function Footer({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${settings.contact.mapCoords.lat},${settings.contact.mapCoords.lng}`;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-forest-950/10 bg-forest-950 text-bone/85">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <BrandMark size={44} className="rounded-xl" />
            <Wordmark tone="light" />
          </div>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-bone/60">{m.footer.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a href={telLink()} className="btn btn-light btn-sm">
              <PhoneIcon size={15} />
              <span dir="ltr">{settings.contact.phoneDisplay}</span>
            </a>
            <a
              href={waLink(locale === "fr" ? "Bonjour, je vous contacte depuis votre site web." : "مرحبًا، أتواصل معكم من موقعكم الإلكتروني.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light btn-sm"
            >
              <WhatsAppIcon size={15} />
              WhatsApp
            </a>
          </div>
        </div>

        <nav className="lg:col-span-2" aria-label={m.footer.quick}>
          <h3 className="eyebrow mb-4 text-brass-300">{m.footer.quick}</h3>
          <ul className="space-y-2.5 text-[0.95rem]">
            {[
              ["/properties", m.nav.properties],
              ["/sale", m.nav.sale],
              ["/rent", m.nav.rent],
              ["/services", m.nav.services],
              ["/about", m.nav.about],
              ["/contact", m.nav.contact],
              ["/submit-property", m.nav.submitProperty],
              ["/legal", m.footer.legalLink],
            ].map(([p, label]) => (
              <li key={p}>
                <Link href={pathWithLocale(locale, p)} className="transition-colors hover:text-bone">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="lg:col-span-2" aria-label={m.footer.categories}>
          <h3 className="eyebrow mb-4 text-brass-300">{m.footer.categories}</h3>
          <ul className="space-y-2.5 text-[0.95rem]">
            {(["apartment", "villa", "land", "commercial", "office"] as const).map((t) => (
              <li key={t}>
                <Link href={pathWithLocale(locale, `/properties?type=${t}`)} className="transition-colors hover:text-bone">
                  {m.typesPlural[t]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pathWithLocale(locale, "/properties?transaction=sale")} className="transition-colors hover:text-bone">
                {m.transactions.sale}
              </Link>
            </li>
            <li>
              <Link href={pathWithLocale(locale, "/properties?transaction=rent")} className="transition-colors hover:text-bone">
                {m.transactions.rent}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h3 className="eyebrow mb-4 text-brass-300">{m.footer.contactTitle}</h3>
          <address className="space-y-3.5 text-[0.95rem] not-italic">
            <p className="flex items-start gap-3">
              <PinIcon size={18} className="mt-0.5 shrink-0 text-brass-300" />
              <a href={gmaps} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
                {settings.contact.address[locale]}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <PhoneIcon size={18} className="shrink-0 text-brass-300" />
              <a href={telLink()} dir="ltr" className="transition-colors hover:text-bone">
                {settings.contact.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <MailIcon size={18} className="shrink-0 text-brass-300" />
              <a href={`mailto:${settings.contact.email}`} className="transition-colors hover:text-bone">
                {settings.contact.email}
              </a>
            </p>
          </address>
          <div className="mt-5 rounded-2xl border border-bone/15 bg-bone/5 p-4">
            <h4 className="eyebrow mb-2.5 text-bone/50">{m.footer.hoursTitle}</h4>
            <ul className="space-y-1.5 text-[0.88rem]">
              {settings.contact.hours[locale].map((h) => (
                <li key={h.days} className="flex items-baseline justify-between gap-4">
                  <span className="text-bone/70">{h.days}</span>
                  <span className="h-px flex-1 translate-y-[-3px] bg-bone/10" />
                  <span className="tabular-nums" dir={locale === "ar" ? "rtl" : "ltr"}>
                    {h.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-[0.8rem] text-bone/50 sm:px-6 lg:px-10">
          <p>
            © {year} {settings.brand.legalName[locale]}. {m.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href={pathWithLocale(locale, "/legal")} className="hover:text-bone/80">
              {m.footer.legalLink}
            </Link>
            <span className="rounded-full border border-bone/15 px-2.5 py-0.5 text-[0.7rem]">{m.footer.disclaimerDemo}</span>
            <span>{m.footer.madeIn} 🇩🇿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
