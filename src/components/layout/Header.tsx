"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { BrandMark, Wordmark } from "@/components/Brand";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { pathWithLocale, switchLocalePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages/fr";
import { telLink, settings } from "@/lib/data/settings";

export function Header({ locale, m }: { locale: Locale; m: Messages }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /**
   * `usePathname()` drops the query string, so the language switcher would
   * silently discard catalog filters (`/fr/properties?type=villa`). Read it
   * from the location instead — client-only, so SSR markup stays stable.
   */
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const other: Locale = locale === "fr" ? "ar" : "fr";
  const active = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href + "/"));

  const links = [
    { href: pathWithLocale(locale, "/properties"), label: m.nav.properties },
    { href: pathWithLocale(locale, "/sale"), label: m.nav.sale },
    { href: pathWithLocale(locale, "/rent"), label: m.nav.rent },
    { href: pathWithLocale(locale, "/services"), label: m.nav.services },
    { href: pathWithLocale(locale, "/about"), label: m.nav.about },
    { href: pathWithLocale(locale, "/contact"), label: m.nav.contact },
  ];

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-bone/90 shadow-[0_1px_0_rgb(11_31_23_/_0.04)] backdrop-blur-md" : "border-b border-transparent bg-bone/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link href={pathWithLocale(locale)} className="flex shrink-0 items-center gap-2.5" aria-label={settings.brand.name}>
          <BrandMark size={38} />
          <Wordmark className="hidden min-[420px]:flex" />
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 lg:flex" aria-label={m.a11y.navMain}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors",
                active(l.href) ? "bg-forest-800/8 text-forest-900" : "text-ink/75 hover:bg-forest-800/5 hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <a
            href={telLink()}
            className="hidden items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[0.85rem] font-semibold text-forest-900 transition hover:border-forest-800 md:flex"
          >
            <PhoneIcon size={15} className="text-brass-600" />
            <span dir="ltr">{settings.contact.phoneDisplay}</span>
          </a>
          <Link
            href={`${switchLocalePath(pathname || `/${locale}`, other)}${search}`}
            className="rounded-full border border-line bg-white px-3.5 py-2 text-[0.82rem] font-semibold text-ink transition hover:border-forest-800"
            aria-label={m.a11y.lang}
          >
            {m.a11y.langShort}
          </Link>
          <Link
            href={pathWithLocale(locale, "/submit-property")}
            className="btn btn-primary btn-sm hidden xl:inline-flex"
          >
            {m.nav.submitProperty}
          </Link>
          <button
            type="button"
            className="btn btn-outline !px-3 lg:hidden"
            aria-expanded={open}
            aria-label={open ? m.a11y.close : m.a11y.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={clsx(
          "fixed inset-x-0 top-[72px] bottom-0 z-40 origin-top bg-bone/98 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        inert={!open}
      >
        <nav className="flex flex-col gap-1 px-5 pt-5" aria-label={m.a11y.navMobile}>
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "font-display flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg transition",
                active(l.href) ? "bg-forest-800 text-bone" : "text-ink hover:bg-sand",
              )}
              style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 grid grid-cols-1 gap-2.5">
            <Link href={pathWithLocale(locale, "/submit-property")} className="btn btn-brass w-full">
              {m.nav.submitProperty}
            </Link>
            <a href={telLink()} className="btn btn-outline w-full">
              <PhoneIcon size={16} />
              <span dir="ltr">{settings.contact.phoneDisplay}</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
