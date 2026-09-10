import type { Metadata, Viewport } from "next";
import { clsx } from "clsx";
import "../globals.css";
import { fontInter, fontFraunces, fontPlexArabic } from "@/lib/fonts";
import { getMessages } from "@/lib/i18n";
import { LOCALES, isLocale, localeDir, localeHtmlLang, pathWithLocale, type Locale } from "@/lib/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AgentGraph, WebsiteGraph } from "@/lib/jsonld";
import { settings } from "@/lib/data/settings";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ed",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "fr";
  return {
    metadataBase: new URL(settings.site.url),
    title: {
      template: settings.seo.titleTemplate,
      default: `${settings.seo.siteName} — ${settings.brand.tagline[l]}`,
    },
    description: settings.seo.defaultDescription[l],
    keywords: settings.seo.keywords,
    alternates: {
      canonical: pathWithLocale(l),
      languages: {
        "fr-DZ": pathWithLocale("fr"),
        "ar-DZ": pathWithLocale("ar"),
        "x-default": pathWithLocale("fr"),
      },
    },
    openGraph: {
      type: "website",
      siteName: settings.seo.siteName,
    },
    category: "real estate",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) throw new Error(`Unknown locale: ${locale}`);
  const m = getMessages(locale);

  return (
    <html
      lang={localeHtmlLang(locale)}
      dir={localeDir(locale)}
      className={clsx(fontInter.variable, fontFraunces.variable, fontPlexArabic.variable)}
      suppressHydrationWarning
    >
      <body className="bg-bone font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only z-[70] m-3 rounded-full bg-forest-900 px-4 py-2 text-sm text-bone focus:not-sr-only focus:absolute"
        >
          {m.a11y.skip}
        </a>
        <Header locale={locale} m={m} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <AgentGraph locale={locale} />
        <WebsiteGraph />
      </body>
    </html>
  );
}
