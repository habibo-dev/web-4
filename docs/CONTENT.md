# Content guide (agency & editors)

## What is real vs. configured

Real, verified data already in place:
- agency name **ISLEM Immobilier**
- address **30 Rue Didouche Mourad, Alger Centre, Algeria**
- public phone **+213 772 226 303** (used for `tel:` and `wa.me:` links in
  both languages, in every contact surface on the site)

Everything else is structured demo content to validate before launch:
- **16 property listings** — realistic Algiers profiles/prices, bilingual
  copy, but illustrative. Replace with the live inventory.
- **Photography** — AI-rendered demonstration images; replace the files in
  `public/images/` (same names) with real shoots, then
  `bash scripts/prepare-images.sh` and rebuild. Each listing card already
  tells visitors the visuals are illustrative (settings disclaimer).
- **Agent emails** (`@islemimmobilier.dz`) and opening hours — placeholders
  in `settings.ts` / `agents.ts`; confirm with the owner, don't invent.
- **About page** — describes the agency's method; add founding story,
  credentials, and real team portraits when provided.
- **Testimonials** — intentionally empty; the section stays hidden until a
  genuinely approved review exists. No fake reviews, ever.

## Editing recipes

| Task | File | Verify |
| --- | --- | --- |
| Add/edit listing | `src/lib/data/properties.ts` | `npm run check:data` |
| Swap a photo | `public/images/…` (+ rerun `prepare-images.sh`) | visual |
| Team members | `src/lib/data/agents.ts` | — |
| Service copy | `src/lib/data/services.ts` | — |
| Hours, e-mail, socials | `src/lib/data/settings.ts` | footer + contact |
| Add a neighborhood | `src/lib/data/neighborhoods.ts` | search filter |
| Approved client review | `src/lib/data/testimonials.ts` | home bottom |
| UI wording (both langs) | `src/lib/i18n/messages/{fr,ar}.ts` | TS enforces parity |

Bilingual rule: any `fr` string must ship its `ar` twin — the type system
(`Messages`) makes a missing translation a compile error, so the site can
never half-translate.

## Photography conventions (for future uploads)

- 3:2 landscape, ≥1600 px wide, neutral white balance, no filters/text.
- First image of a listing = the “hero” shot (used in cards and link previews).
- Alt text required FR + AR: describe what is visible, not marketing.

## Phone/WhatsApp etiquette

All CTAs dial or open the single verified line. WhatsApp deep links
pre-fill context (reference + listing title) so the advisor sees which
property a visitor means before replying.
