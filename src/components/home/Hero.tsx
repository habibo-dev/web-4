import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale, type Locale } from "@/lib/i18n/config";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, ChatIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { HeroSearch } from "./HeroSearch";
import { availableNeighborhoods } from "@/lib/data/repo";
import { waLink } from "@/lib/data/settings";
import { telLink } from "@/lib/data/settings";
import { settings } from "@/lib/data/settings";

export function Hero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const neighborhoods = availableNeighborhoods().map((n) => ({
    id: n.id,
    fr: n.name.fr,
    ar: n.name.ar,
    count: n.count,
  }));

  return (
    <section className="relative -mt-[72px] overflow-hidden bg-forest-950 pt-[72px] text-bone" aria-label={m.home.heroKicker}>
      {/* backdrop */}
      <div className="absolute inset-0">
        <Image
          src="/images/city/alger-bay.webp"
          alt={locale === "fr" ? "Alger au coucher du soleil : la baie, les toits et les collines" : "الجزائر عند الغروب: الخليج والأسطح والتلال"}
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/85 via-forest-950/45 to-forest-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_10%,rgb(8_26_18_/_0.55),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 pt-14 pb-10 lg:grid-cols-12 lg:pt-20 lg:pb-12">
          <div className="max-w-2xl lg:col-span-7">
            <p className="eyebrow tracking-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/10 px-3.5 py-1.5 text-brass-300 backdrop-blur-sm">
              <PinIcon size={13} />
              {m.home.heroKicker}
            </p>
            <h1 className="font-display text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-[4.2rem]">{m.home.heroTitle}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/75">{m.home.heroLead}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Button href={pathWithLocale(locale, "/properties")} className="!bg-brass-400 !text-forest-950 hover:!bg-brass-300">
                {m.home.heroCta1}
                <ArrowRightIcon size={17} className="rtl:-scale-x-100" />
              </Button>
              <Button href={pathWithLocale(locale, "/contact")} variant="light">
                {m.home.heroCta2}
              </Button>
              <a href={telLink()} className="group ms-1 hidden items-center gap-2 text-sm text-bone/70 transition hover:text-bone sm:flex">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-bone/25 group-hover:border-brass-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6.5 3.5 9 4l1 4-2 1.6a12.5 12.5 0 0 0 6.4 6.4l1.6-2 4 1 .5 2.5a2 2 0 0 1-2.2 2.3C10.5 19.3 4.7 13.5 4.2 5.7A2 2 0 0 1 6.5 3.5Z" />
                  </svg>
                </span>
                <span dir="ltr">{settings.contact.phoneDisplay}</span>
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.84rem] text-bone/65">
              {[
                { icon: <PinIcon size={14} className="text-brass-300" />, t: m.home.heroBadge1 },
                { icon: <ChatIcon size={14} className="text-brass-300" />, t: m.home.heroBadge2 },
                { icon: <ShieldIcon size={14} className="text-brass-300" />, t: m.home.heroBadge3 },
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  {b.icon}
                  {b.t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden w-full items-start justify-end self-stretch lg:col-span-5 lg:grid">
            <a
              href={waLink(locale === "fr" ? "Bonjour ISLEM Immobilier, je recherche un bien à Alger." : "مرحبًا ISLEM Immobilier، أبحث عن عقار في الجزائر.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex h-full w-full flex-col justify-between rounded-2xl border border-bone/15 bg-forest-950/35 p-6 backdrop-blur-md transition hover:border-brass-300/40 hover:bg-forest-950/50"
            >
              <div>
                <p className="eyebrow tracking-eyebrow text-brass-300">{m.home.waKicker}</p>
                <p className="font-display mt-3 text-2xl leading-snug">{m.home.waTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{m.home.waLead}</p>
              </div>
              <span className="btn btn-light mt-8 w-full group-hover:border-brass-300/60">
                <ChatIcon size={16} />
                {m.common.whatsapp}
                <ArrowRightIcon size={15} className="ms-auto rtl:-scale-x-100" />
              </span>
            </a>
          </div>
        </div>

        {/* search card */}
        <div className="relative z-10 pb-14 lg:pb-16">
          <HeroSearch locale={locale} neighborhoods={neighborhoods} />
        </div>
      </div>
    </section>
  );
}
