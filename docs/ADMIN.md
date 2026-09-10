# Back-office (`/admin`)

## Enable

```env
# .env.local
ADMIN_PASSWORD=your-strong-password        # enables the panel
ADMIN_SESSION_SECRET=$(openssl rand -hex 32)
```

`/admin` → login screen. Without `ADMIN_PASSWORD` the panel renders a
disabled notice (the public site is unaffected). Sessions are signed
httpOnly cookies, 12 h expiry, `Secure` flag in production.

## What it shows

- **Counters** — only real values: new requests to process, totals of each
  record type, published listings, approved reviews. No vanity metrics.
- **Demandes reçues** — every visit request and contact message
  (`data/db.json`), filterable by status: `Nouveau → En cours → Traité →
  Archivé`. Phone/WhatsApp/e-mail are linked actions; the referenced
  listing opens in a new tab.
- **Biens soumis** — owner submissions incl. description, price hint,
  surface, uploaded photos (served from `/public/uploads/`) and external
  links; workflow `Nouveau → En revue → Rappelé → Publié → Clôturé`.
- **Export JSON** — one click for the full set (`/api/admin/export`).

## API surface

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/inquiries` | POST | public: visit + contact forms |
| `/api/property-submissions` | POST | public: listing submission (multipart, ≤6 images, ≤5 MB each) |
| `/api/admin/login` | POST | password check, rate-limited (8/min) |
| `/api/admin/logout` | POST | clears session |
| `/api/admin/export?kind=all` | GET | authenticated JSON export |

Server actions (`components/admin/actions.ts`) mutate statuses.

## Scaling notes

`data/db.json` suits a single-origin deployment (one node process, atomic
tmp+rename writes, in-process mutex). For multiple instances move the two
tables to Postgres/MySQL — the `store.ts` interface is 5 functions; a thin
adapter is the only file to rewrite. Uploaded files: switch `saveUpload`
to S3-compatible storage if needed (returned paths are already URLs).

## Hardening checklist (production)

1. Long `ADMIN_PASSWORD` + different `ADMIN_SESSION_SECRET` (64 hex chars).
2. HTTPS only (cookies are `Secure`).
3. Rate limiting is in-memory: add a WAF/CDN rule on `/api/*` if the
   agency faces traffic abuse.
4. Back up `data/db.json` and `public/uploads/` (daily cron recommended).
