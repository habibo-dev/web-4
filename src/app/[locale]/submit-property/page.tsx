import type { Metadata } from "next";
import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { buildMetadata, localeFrom, type PageParams } from "@/lib/page";
import { settings } from "@/lib/data/settings";
import { PropertySubmissionForm } from "@/components/forms/PropertySubmissionForm";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/submit-property", {
    title: () => m.submit.title,
    description: locale === "fr"
      ? "Vendre ou louer un bien à Alger : déposez votre annonce chez ISLEM Immobilier — estimation sur place, reportage photo, annonce bilingue et acquéreurs qualifiés."
      : "بيع أو كراء عقار في الجزائر: أودع إعلانك لدى ISLEM Immobilier — تقييم في عين المكان، تقرير مصور، إعلان بلغتين ومشترَون مؤهَّلون.",
  });
}

export default async function SubmitPropertyPage({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);

  const promises = [
    locale === "fr" ? "Visite d'estimation gratuite à domicile" : "زيارة تقييم مجانية في عين المكان",
    locale === "fr" ? "Reportage photo et vidéo professionnel" : "تقرير مصور وفيديو احترافي",
    locale === "fr" ? "Annonce FR/AR + diffusion réseau acquéreurs" : "إعلان بالعربية والفرنسية + نشر عبر شبكة مشترينا",
    locale === "fr" ? "Compte rendu après chaque visite" : "تقرير بعد كل زيارة",
  ];

  return (
    <>
      {/* editorial header */}
      <section className="relative overflow-hidden bg-forest-950 text-bone">
        <Image src="/images/apt/terrace-sea.webp" alt="" aria-hidden fill className="object-cover opacity-35" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/80 to-forest-950/40 rtl:bg-gradient-to-l" />
        <div className="relative mx-auto max-w-[1320px] px-5 pb-16 pt-24 sm:px-6 lg:px-10 lg:pb-20 lg:pt-24">
          <p className="eyebrow tracking-eyebrow mb-4 text-brass-300">{m.submit.kicker}</p>
          <h1 className="font-display max-w-3xl text-[2.3rem] leading-[1.1] sm:text-5xl">{m.submit.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/75">{m.submit.lead}</p>
          <ul className="mt-9 grid max-w-2xl gap-2.5 sm:grid-cols-2">
            {promises.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[0.92rem] text-bone/85">
                <CheckIcon size={17} className="mt-0.5 shrink-0 text-brass-300" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/10 px-4 py-2 text-[0.85rem] backdrop-blur-sm">
            <PhoneIcon size={14} className="text-brass-300" />
            <a href={`tel:${settings.contact.phoneE164}`} dir="ltr" className="font-semibold">{settings.contact.phoneDisplay}</a>
          </p>
        </div>
      </section>

      {/* form */}
      <section className="mx-auto max-w-[920px] px-5 py-14 sm:px-6 lg:py-16">
        <Reveal>
          <PropertySubmissionForm locale={locale} />
        </Reveal>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[0.78rem] leading-relaxed text-muted">
          {locale === "fr"
            ? "En déposant votre bien, vous acceptez d'être recontacté par l'agence. Aucune annonce n'est publiée sans votre validation écrite."
            : "بإيداع عقارك، توافق على إعادة اتصال الوكالة بك. لا يُنشر أي إعلان دون موافقتك الخطية."}
        </p>
      </section>
    </>
  );
}
