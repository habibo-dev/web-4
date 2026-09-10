import type { Metadata } from "next";
import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { pathWithLocale } from "@/lib/i18n/config";
import { buildMetadata, localeFrom, type PageParams } from "@/lib/page";
import { agents } from "@/lib/data/agents";
import { NEIGHBORHOODS } from "@/lib/data/neighborhoods";
import { settings, telLink, waLink } from "@/lib/data/settings";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, PinIcon, WhatsAppIcon, CompassIcon, HandshakeIcon, CheckIcon, SparkIcon } from "@/components/icons";

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/about", {
    title: () => `${m.nav.about} — immobilier Alger Centre`,
    description: locale === "fr"
      ? "ISLEM Immobilier, agence indépendante au 30 rue Didouche Mourad à Alger : une équipe de conseillers locaux, des annonces vérifiées et un service bilingue français-arabe."
      : "ISLEM Immobilier، وكالة مستقلة في 30 شارع ديدوش مراد بالجزائر العاصمة: فريق من المستشارين المحليين، إعلانات موثّقة وخدمة ثنائية اللغة.",
  });
}

const VALUES_ICONS = [
  <CompassIcon key="a" size={22} />,
  <CheckIcon key="b" size={22} />,
  <SparkIcon key="c" size={22} />,
  <HandshakeIcon key="d" size={22} />,
];

export default async function AboutPage({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  const valueKeys = Object.keys(m.about.values) as (keyof typeof m.about.values)[];

  return (
    <>
      {/* editorial hero */}
      <section className="relative overflow-hidden bg-forest-950 text-bone">
        <Image src="/images/city/alger-bay.webp" alt="" aria-hidden fill className="object-cover opacity-40" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/30 rtl:bg-gradient-to-b" />
        <div className="relative mx-auto max-w-[1320px] px-5 pb-16 pt-24 sm:px-6 lg:px-10 lg:pb-20 lg:pt-28">
          <p className="eyebrow tracking-eyebrow mb-4 text-brass-300">{m.about.kicker}</p>
          <h1 className="font-display max-w-3xl text-[2.5rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem]">{m.about.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone/75">{m.about.lead}</p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/10 px-4 py-2 text-[0.82rem] text-bone/70 backdrop-blur-sm">
            <PinIcon size={14} className="text-brass-300" />
            {settings.contact.address[locale]}
          </p>
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10">
        <SectionHeading kicker={m.about.kicker} title={m.about.valuesTitle} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueKeys.map((k, i) => (
            <Reveal as="li" key={k} delay={i * 80}>
              <div className="card card-hover h-full p-6">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brass-100 text-brass-600">{VALUES_ICONS[i]}</span>
                <h3 className="font-display text-lg font-semibold">{m.about.values[k].title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{m.about.values[k].text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* team */}
      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="start" kicker={m.nav.about} title={m.about.teamTitle} lead={m.about.teamLead} className="lg:max-w-xl" />
            <Button href={pathWithLocale(locale, "/contact")} variant="outline" className="hidden md:inline-flex">
              {m.nav.contact}
            </Button>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 70}>
                <div className="card h-full p-6">
                  <div className="flex items-center gap-4">
                    <span className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 text-lg font-semibold text-brass-300 ring-1 ring-brass-400/30">
                      {a.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display truncate text-[1.05rem] font-semibold text-ink">{a.name[locale]}</p>
                      <p className="mt-0.5 text-[0.72rem] font-bold uppercase tracking-wider text-brass-600">{a.role[locale]}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[0.88rem] leading-relaxed text-muted">{a.bio[locale]}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-[0.78rem]">
                    <a href={`mailto:${a.email}`} dir="ltr" className="chip !py-1 !text-[0.75rem] hover:border-forest-700">
                      {a.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-[0.78rem] text-muted/80">{m.about.disclaimer}</p>
        </div>
      </section>

      {/* coverage */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="start" kicker={m.home.areasTitle} title={m.about.areaTitle} lead={m.about.areaLead} />
            <ul className="mt-8 flex flex-wrap gap-2">
              {NEIGHBORHOODS.map((n) => (
                <li key={n.id}>
                  <a className="chip !bg-white transition hover:border-forest-800" href={pathWithLocale(locale, `/properties?location=${n.id}`)}>
                    <PinIcon size={13} className="text-brass-600" />
                    {n.name[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="self-center">
            <div className="card overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image src="/images/city/alger-evening-street.webp" alt={locale === "fr" ? "Rue Didouche Mourad en soirée" : "شارع ديدوش مراد في المساء"} fill sizes="(min-width:1024px) 590px, 100vw" className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-ink">{m.about.ctaTitle}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{m.about.ctaLead}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <a href={telLink()} className="btn btn-primary btn-sm">
                    <PhoneIcon size={15} /> <span dir="ltr">{settings.contact.phoneDisplay}</span>
                  </a>
                  <a
                    href={waLink(locale === "fr" ? "Bonjour, je souhaite parler à un conseiller." : "مرحبًا، أرغب في التحدث إلى مستشار.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <WhatsAppIcon size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
