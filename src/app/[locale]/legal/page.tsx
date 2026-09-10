import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n";
import { buildMetadata, localeFrom, type PageParams } from "@/lib/page";
import { settings } from "@/lib/data/settings";

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale = await localeFrom(params);
  const m = getMessages(locale);
  return buildMetadata(locale, "/legal", {
    title: () => m.legal.title,
    description: m.legal.lead,
    noindex: true,
  });
}

export default async function LegalPage({ params }: { params: PageParams }) {
  const locale = await localeFrom(params);
  const m = getMessages(locale);

  const blocks = [
    { title: m.legal.editorTitle, body: `${m.legal.editorBody}\n${settings.contact.address[locale]}\n${settings.contact.phoneDisplay} · ${settings.contact.email}` },
    { title: m.legal.dataTitle, body: m.legal.dataBody },
    { title: m.legal.ipTitle, body: m.legal.ipBody },
  ];

  return (
    <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-6 lg:py-20">
      <p className="eyebrow tracking-eyebrow mb-3 text-brass-600">ISLEM Immobilier</p>
      <h1 className="font-display text-4xl leading-tight">{m.legal.title}</h1>
      <p className="mt-4 text-[1rem] leading-relaxed text-muted">{m.legal.lead}</p>

      <div className="mt-10 space-y-8">
        {blocks.map((b) => (
          <article key={b.title} className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">{b.title}</h2>
            {b.body.split("\n").map((line, i) => (
              <p key={i} className={i === 0 ? "mt-3 text-[0.95rem] leading-relaxed text-muted" : "mt-1.5 text-[0.95rem] font-medium text-ink"}>
                {line}
              </p>
            ))}
          </article>
        ))}
      </div>

      <p className="mt-8 text-[0.78rem] text-muted/80">{m.legal.seoNote}</p>
    </section>
  );
}
