"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { isLocale, pathWithLocale, type Locale } from "@/lib/i18n/config";

export default function LocaleNotFound() {
  const pathname = usePathname() ?? "";
  const seg = pathname.split("/")[1];
  const locale: Locale = isLocale(seg) ? seg : "fr";
  const m = getMessages(locale);

  return (
    <section className="mx-auto flex min-h-[62vh] max-w-[720px] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[7rem] leading-none text-brass-400/70">404</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-ink">{m.notFound.title}</h1>
      <p className="mt-3 text-[1rem] text-muted">{m.notFound.lead}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={pathWithLocale(locale, "/properties")} className="btn btn-primary">
          {m.notFound.cta}
        </Link>
        <Link href={pathWithLocale(locale)} className="btn btn-outline">
          {m.nav.home}
        </Link>
      </div>
    </section>
  );
}
