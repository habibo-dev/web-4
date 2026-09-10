# Data models

All content records are defined once in `src/lib/data/types.ts` (zod
schemas + inferred TS types). The UI only ever reads through these shapes,
so any backing store can be swapped in as long as it returns the same JSON.

## Content (curated, file- or CMS-managed)

### Property
| Field | Type | Notes |
| --- | --- | --- |
| `id`, `reference`, `slug` | string | `slug` is locale-neutral, used in `/property/{slug}` |
| `type` | `apartment \| villa \| land \| commercial \| office` | catalog categories |
| `transaction` | `sale \| rent` | |
| `status` | `available \| reserved \| sold` | `sold` is auto-hidden from the catalog |
| `featured`, `labels` | bool / `coup-de-coeur \| nouveau` | merchandising only, no performance claims |
| `price.amount` | int DZD | full amount; UI formats with FR/AR conventions |
| `price.period` | `one-time \| monthly` | |
| `surface`, `plotArea`, `rooms`, `bedrooms`, `bathrooms`, `floor`, `furnished`, `yearBuilt` | numbers / flags | shown in “key facts” |
| `features` | `FeatureKey[]` | fixed vocabulary, translated by the UI dictionary |
| `title`, `excerpt`, `description` | `{ fr, ar }` | `description` = paragraphs separated by blank lines |
| `neighborhood`, `coords` | id + `{lat,lng}` | pins for Leaflet maps |
| `exactAddress` | `{fr,ar}` optional | **only set with owner consent** |
| `images[].src` | IMAGE_LIB key | resolved server-side (`withResolvedImages`) |
| `publishedAt` | ISO date | default sort |

Demo pricing is realistic for the listed areas but illustrative — replace
with live inventory before commercial use.

### Agent
`id, name {fr,ar}, initials, role {fr,ar}, bio {fr,ar}, email,
languages[], specialties[]`. Phones deliberately route to the verified
agency line (`settings.contact`); add a `photo` field when real portraits
exist (the card already renders a monogram fallback).

### Service
`key (achat|vente|location|estimation|conseil), icon, title, tagline,
description, bullets[]` — all bilingual.

### Neighborhood
`id, name {fr,ar}, district {fr,ar}, coords, note {fr,ar}` — used by search
selects, area chips and map popups.

### Testimonial
`id, author, context {fr,ar}, quote {fr,ar}, date, source, approved`.
**Hard rule:** only `approved: true` entries render (the whole section
stays hidden otherwise) and reviews must be real, written client feedback.
Never ship invented quotes.

### Settings (`settings.ts`)
Brand, verified contact (phone `+213 772 226 303`, address
30 Rue Didouche Mourad), email, hours, social links, SEO defaults, currency
display, disclaimers. Every occurrence on the site reads from here.

## Inbound records (forms → `data/db.json` → `/admin`)

### Inquiry
`kind: visit | contact`, name, phone (+ optional WhatsApp, e-mail),
`propertySlug`, `preferredDate`, `message`, `locale`, `status:
new | in-progress | done | archived`, `createdAt`.

### Submission (owner listing request)
`ownerName, phone, whatsapp?, email?, propertyType, transaction,
neighborhood, price?, surface?, bedrooms?, description,
photos[] (upload paths and/or external links), consent, locale, status:
new | reviewing | contacted | listed | closed`.

Both are validated with the same zod schemas as the browser (`validation.ts`),
rate-limited, honeypot-protected, and appended atomically to
`data/db.json` (`lib/store.ts`).

## Adding a property — minimal example

```ts
{
  id: "p-1017",
  slug: "f2-hydra-location",
  reference: "ISL-1017",
  type: "apartment",
  transaction: "rent",
  status: "available",
  featured: false,
  labels: [],
  price: { amount: 85_000, period: "monthly", negotiable: true },
  surface: 62,
  rooms: 2, bedrooms: 1, bathrooms: 1,
  furnished: false,
  features: ["parking", "security", "elevator"],
  title: { fr: "F2 en location — Hydra", ar: "شقة لغرفتين للكراء — حيدرة" },
  excerpt: { fr: "…", ar: "…" },
  description: { fr: "…\n\n…", ar: "…\n\n…" },
  neighborhood: "hydra",
  coords: { lat: 36.7641, lng: 3.0369 },
  images: [{ src: "apt/living-bright", alt: { fr: "…", ar: "…" } }],
  publishedAt: "2026-09-09",
}
```

Then run `npm run check:data` — it enforces uniqueness, bilingual
completeness, valid image keys and pricing sanity.
