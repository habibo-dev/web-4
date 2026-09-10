import { settings } from "@/lib/data/settings";
import { SITE_URL } from "./page";
import type { Property } from "@/lib/data/types";
import { getNeighborhood } from "@/lib/data/neighborhoods";

/**
 * Structured data: a single RealEstateAgent node (+ WebSite) on every page,
 * and per-property `Residence` nodes on listing pages. No fabricated
 * aggregate ratings or review counts are ever emitted.
 */
export function AgentGraph({ locale }: { locale: "fr" | "ar" }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.brand.name,
    description: settings.seo.defaultDescription[locale],
    url: SITE_URL,
    telephone: settings.contact.phoneE164,
    email: settings.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "30 Rue Didouche Mourad",
      addressLocality: "Alger Centre",
      addressRegion: "Alger",
      addressCountry: "DZ",
    },
    areaServed: "Wilaya d'Alger",
    priceRange: "$$",
    knowsLanguage: ["fr", "ar", "en"],
    sameAs: Object.values(settings.social).filter(Boolean) as string[],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function WebsiteGraph() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.seo.siteName,
    url: SITE_URL,
    inLanguage: ["fr-DZ", "ar-DZ"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ListingGraph({ property, locale }: { property: Property; locale: "fr" | "ar" }) {
  const nb = getNeighborhood(property.neighborhood);
  const isRent = property.transaction === "rent";
  const data = {
    "@context": "https://schema.org",
    "@type": isRent ? "Product" : "Residence",
    name: property.title[locale],
    description: property.excerpt[locale],
    url: `${SITE_URL}/${locale}/property/${property.slug}`,
    image: property.images.map((i) => `${SITE_URL}${i.src}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: nb?.name.fr ?? "Alger",
      addressRegion: "Alger",
      addressCountry: "DZ",
    },
    geo: { "@type": "GeoCoordinates", latitude: property.coords.lat, longitude: property.coords.lng },
    numberOfRooms: property.rooms,
    floorSize: { "@type": "QuantitativeValue", value: property.surface, unitCode: "MTK" },
    ...(isRent
      ? { offers: { "@type": "Offer", price: property.price.amount, priceCurrency: "DZD", availability: "https://schema.org/InStock" } }
      : { offers: { "@type": "Offer", price: property.price.amount, priceCurrency: "DZD", availability: property.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut" } }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BreadcrumbGraph({ trail, locale }: { trail: { name: string; url?: string }[]; locale: "fr" | "ar" }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      ...(t.url ? { item: `${SITE_URL}/${locale}${t.url}` } : {}),
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
