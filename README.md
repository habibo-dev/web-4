# ISLEM Immobilier — Site vitrine immobilier premium (FR/AR)

Site commercial complet pour **ISLEM Immobilier**, agence immobilière au
**30 Rue Didouche Mourad, Alger Centre** — **+213 772 226 303**.

Stack : **Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 ·
zod · Leaflet/OSM · next/image (WebP/AVIF)** — 100 % self-hosted (polices et
images incluses, aucune dépendance CDN externe au runtime).

---

## Démarrage

```bash
npm install
cp .env.example .env.local   # optionnel (admin, e-mails, URL publique)
npm run dev                  # http://localhost:3000  (redirige /fr ou /ar)
```

Commandes :

| Script | Rôle |
| --- | --- |
| `npm run dev` | serveur de dev |
| `npm run build` | build de production (toutes les pages pré-rendues en SSG) |
| `npm start` | sert le build |
| `npm run typecheck` | TypeScript strict |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run check:data` | QC éditorial du catalogue (doublons, FR/AR, clés d'images, cohérence prix) |
| `bash scripts/prepare-images.sh` | convertit les PNG/JPG déposés dans `public/images` en WebP optimisés |

## Carte d'identité du site

- **Langues** : français (LTR) et arabe (RTL complet), URLs `/{fr|ar}/…`,
  bascule instantanée, `hreflang fr-DZ / ar-DZ / x-default`.
- **Pages** : accueil · `/properties` (recherche + filtres) · `/sale` ·
  `/rent` · `/property/[slug]` (galerie, carte, conseiller, demande de
  visite, WhatsApp, biens similaires) · `/services` · `/about` ·
  `/contact` · `/submit-property` (dépôt de bien avec photos) · `/legal`.
- **Recherche** : opération, type, localisation, budget (min/max), surface,
  chambres — partagée entre le hero et le catalogue, synchronisée dans l'URL
  (`/fr/properties?type=villa&priceMin=100000000` est un lien profond valide).
- **Back-office** : `/admin` protégé par mot de passe (`ADMIN_PASSWORD`) —
  demandes de visite/contact, biens soumis avec photos, statuts, export JSON.
- **SEO** : sitemap, robots, JSON-LD (`RealEstateAgent`, `WebSite`,
  `Residence`/`Product` par annonce, fil d'Ariane), cartes OpenGraph générées
  par route (`/fr/opengraph-image`), titres orientés « immobilier Alger
  Centre / appartement Alger / villa Alger / location appartement Alger ».

## Architecture des données

Tout le contenu passe par des **schémas zod** (`src/lib/data/types.ts`) et
des modules JSON-like dans `src/lib/data/` :

```
properties.ts     → 16 annonces bilingues (démo)   ─┐
agents.ts         → équipe                          │ lisibles/éditables,
services.ts       → Achat · Vente · Location ·      │ typées, prêtes pour
                    Estimation · Conseil            │ un CMS
testimonials.ts   → VIDE par conception (voir plus) │
neighborhoods.ts  → quartiers desservis + repères   │
settings.ts       → coordonnées, horaires, SEO,     │
                    disclaimers                    ──┘
```

Les **demandes entrantes** (visites, contact, dépôts de biens avec photos)
sont validées par les mêmes schémas côté client **et** serveur
(`/api/inquiries`, `/api/property-submissions`), persistées dans
`data/db.json` et stockées dans `public/uploads/` — voir
[`docs/DATA-MODELS.md`](docs/DATA-MODELS.md) et
[`docs/CMS.md`](docs/CMS.md).

## Personnaliser pour l'agence (checklist pré-lancement)

1. **Photos réelles** — remplacer les visuels de démonstration : déposer les
   photos dans `public/images/<categorie>/<nom>.png` (mêmes noms), lancer
   `bash scripts/prepare-images.sh`, puis `npm run build`. Aucune ligne de
   code à toucher. Les visuels fournis sont **des rendus de démonstration** ;
   le site l'indique honnêtement via `settings.content.listingsDisclaimer`.
2. **Prix et annonces** — éditer `src/lib/data/properties.ts` (ou la
   collection CMS). Les prix de démo sont réalistes pour Alger mais **ne
   constituent pas une offre** : à remplacer par l'inventaire réel.
3. **E-mail & horaires** — `src/lib/data/settings.ts` (le seul endroit où
   l'adresse et le téléphone sont saisis ; téléphone et adresse sont les
   données vérifiées de l'agence, l'e-mail par défaut est à confirmer).
4. **Équipe** — `src/lib/data/agents.ts` : monogrammes par défaut ; ajoutez
   un champ `photo` au schéma et déposez les portraits réels.
5. **Avis clients** — `src/lib/data/testimonials.ts` reste **vide** tant que
   l'agence n'a pas recueilli de vrais avis écrits et validés
   (`approved: true`). La section s'affiche toute seule dès qu'un avis est
   publié — jamais de faux avis pré-remplis.
6. **Réseaux sociaux / fiche Google Business** — `settings.social`
   (liens optionnels, cachés s'ils sont vides).
7. **Domaine** — définir `NEXT_PUBLIC_SITE_URL` (canonicals, sitemap, OG).

## En bref côté exploitation

- Notifications e-mail optionnelles via Resend (`RESEND_API_KEY`,
  `NOTIFY_EMAIL`) — sans clé, tout est simplement enregistré dans le store.
- Anti-spam : honeypot + limitation de débit par IP (5/min formulaires,
  3/2 min dépôts, 8/min login admin).
- Images : le pipeline d'optimisation Next sert WebP/AVIF responsives ;
  `sizes` adaptés mobile-first ; hero prioritaire, lazy partout ailleurs.
- `prefers-reduced-motion` respecté ; navigation clavier galerie/lightbox;
  focus visibles.

For detailed guides: [`docs/`](docs/) — DATA-MODELS, CMS integration,
ADMIN, DEPLOY, CONTENT.
