# CMS integration guide

The front-end never reads raw files — it reads the query layer in
`src/lib/data/repo.ts` ( `allPublished`, `getPropertyBySlug`,
`filterProperties`, `featuredProperties`, `similarProperties`,
`countByType`, `availableNeighborhoods` ). Point those at a CMS and the
entire site becomes database-driven with zero UI changes.

## Shape mapping (Payload CMS example)

`src/lib/data/types.ts` was written so each zod schema maps 1:1 to a CMS
collection. Example in Payload 3 syntax (field names identical):

```ts
// collections/Properties.ts
{
  slug: "properties",
  fields: [
    { name: "reference", type: "text", unique: true },
    { name: "slug", type: "upload", isAutosize: true /* or text + hook */ },
    { name: "type", type: "select", options: ["apartment","villa","land","commercial","office"] },
    { name: "transaction", type: "select", options: ["sale","rent"] },
    { name: "status", type: "select", options: ["available","reserved","sold"] },
    { name: "featured", type: "checkbox" },
    { name: "labels", type: "select", hasMany: true, options: ["coup-de-coeur","nouveau"] },
    { name: "price", type: "group", fields: [
      { name: "amount", type: "number", min: 0 },
      { name: "period", type: "select", options: ["one-time","monthly"] },
      { name: "negotiable", type: "checkbox" },
    ]},
    { name: "surface", type: "number" }, { name: "plotArea", type: "number" },
    { name: "rooms", type: "number" }, { name: "bedrooms", type: "number" },
    { name: "bathrooms", type: "number" }, { name: "yearBuilt", type: "number" },
    { name: "furnished", type: "checkbox" },
    { name: "floor", type: "group", fields: [ {name:"fr",type:"text"},{name:"ar",type:"text"} ] },
    { name: "features", type: "select", hasMany: true /* FeatureKey enum */ },
    { name: "title", type: "group", fields: [ {name:"fr",type:"text"},{name:"ar",type:"textarea"} ] },
    { name: "excerpt", type: "group", localized: false /* fr/ar pair as above */ },
    { name: "description", type: "group" /* fr/ar pair, textarea */ },
    { name: "neighborhood", type: "relationship", relationTo: "neighborhoods" },
    { name: "coords", type: "group", fields: [ {name:"lat",type:"number"},{name:"lng",type:"number"} ] },
    { name: "images", type: "array", fields: [
      { name: "src", type: "upload", relationTo: "media" },
      { name: "alt", type: "group" /* fr/ar */ },
    ]},
    { name: "publishedAt", type: "date" },
  ],
}
```

Same pattern for `agents`, `services`, `neighborhoods`, `testimonials`
(add a `published` flag; the frontend filter keeps `approved` semantics)
and for the two inbound collections `inquiries` and `submissions`
(read-only + status workflow in the CMS admin; Payload Live
Preview can reuse the front-end routes).

## Fetching at build time

```ts
// src/lib/data/repo.cms.ts
const res = await fetch(`${process.env.PAYLOAD_URL}/api/properties?depth=1&limit=500`, {
  next: { revalidate: 600 },
});
export async function allPublished(): Promise<Property[]> { /* map → Property[] */ }
```

Keep function signatures identical; pages already render from the repo.

## Alternative stores

- **Directus**: one collection per model, image field returns
  `/assets/{id}` → map to `src` (Directus can deliver AVIF via
  `?format=webp`; simpler to keep next/image).
- **Sanity**: schema types mirror the zod files; use the WebP CDN URL
  `https://cdn.sanity.io/images/…?fm=webp&w=1600` directly as `src`.
- **Google Sheets / File-run CMS**: fine for <100 listings — the store in
  `lib/store.ts` is append-only JSON, trivially replaced by Postgres
  (`inquiries` and `submissions` tables share the same columns).

## Media pipeline without a CMS

Real photos: drop them into `public/images/{apt,villa,land,com,office,city}/*.png`
keeping the existing file names, run `bash scripts/prepare-images.sh`
(resize 1600×1067 / hero 2200, WebP q80, remove sources) and rebuild.
`IMAGE_LIB` alt-text and dimensions live in `src/lib/data/imageLibrary.ts` —
update the `alt` lines with the true photo descriptions per listing.
