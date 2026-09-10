# Deploy

## Option 0 — GitHub Pages (free, permanent, no server)

The repo already ships the workflow. Two settings, once:

1. **Settings → Pages → Build and deployment → Source → `GitHub Actions`**
2. Push to `main`.

The site is then live, permanently, at
`https://<user>.github.io/web-4/` — every later push to `main` republishes it
in ~2 minutes and the URL never changes.

What runs: `npm ci` → `npm run check:data` → `npm run build:static` →
`actions/deploy-pages`. The workflow derives both `NEXT_PUBLIC_SITE_URL`
(canonicals, sitemap, hreflang, OG cards) and `NEXT_PUBLIC_BASE_PATH`
(`/web-4`, so assets and links resolve under the project prefix).

To publish on your own domain or on a `user.github.io` repo instead, add a
repository **variable** `SITE_URL` (e.g. `https://islemimmobilier.dz`): the
workflow then leaves `NEXT_PUBLIC_BASE_PATH` empty and builds for the root.

Trade-off: GitHub Pages serves files, so there is no Node process.
`/api`, the `/admin` back-office and photo uploads do not exist there — the
contact / visit / property forms hand the visitor to WhatsApp with the
message already written out (see `src/lib/submit-mode.ts`). Everything
visible to a visitor is identical. Need the back-office? Use Option A or C.

Local preview of exactly what Pages will serve:

```bash
npm run build:static
npx serve out
```

## Option A — VPS (recommended: full file access for uploads/db.json)

```bash
git clone <repo> && cd web-4
npm ci
cp .env.example .env.local        # set ADMIN_* + NEXT_PUBLIC_SITE_URL
npm run build
```

`/etc/systemd/system/islem.service`:

```ini
[Unit]
Description=ISLEM Immobilier
After=network.target

[Service]
WorkingDirectory=/var/www/islem-immobilier
ExecStart=/usr/bin/npm start
Restart=always
Environment=PORT=3000
User=www-data

[Install]
WantedBy=multi-user.target
```

nginx (TLS via certbot, media cache, no body-size surprises for photos):

```nginx
server {
  listen 443 ssl http2;
  server_name islemimmobilier.dz www.islemimmobilier.dz;
  client_max_body_size 40M;

  location ~* /(images|fonts|uploads)/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    add_header Cache-Control "public, max-age=604800";
  }
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

`/api` rate limiting is in-process; if you run several instances behind a
load balancer, move `data/db.json` to a shared DB and uploads to object
storage first.

## Option B — Docker

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM node:22-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]
```

```bash
docker build -t islem . && docker run -p 3000:3000 --env-file .env.local \
  -v islem-data:/app/data islem
```

## Option C — Vercel / serverless

Works out of the box (middleware, sitemap, robots, OG routes). Caveats:
`data/db.json` + `data/uploads` are ephemeral there — wire the two form
routes to a database/blob storage (Postgres, Turso, Supabase; see
docs/CMS.md) or keep the agency on Option A.

## Post-deploy verification (5 min)

- [ ] `https://domain/` redirects to `/fr` (or `/ar` per browser language)
- [ ] `/fr/sitemap.xml` and `/robots.txt` respond 200
- [ ] a page share on WhatsApp/Telegram shows the OG card + listing photo
- [ ] send a test inquiry + a test submission with photo → appear in `/admin`
- [ ] Lighthouse (mobile) ≥ 95 for Performance on `/fr/property/...`
- [ ] `npm run check:data` green in CI
