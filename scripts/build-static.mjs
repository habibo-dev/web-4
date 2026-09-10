#!/usr/bin/env node
/**
 * Builds the fully static version of the site into `out/`.
 *
 * Next.js refuses `output: "export"` while POST route handlers, server
 * actions or `cookies()` are still reachable from the router, so the
 * server-only pieces are parked in `.static-build-parked/` for the duration
 * of the build and always restored afterwards (including on failure).
 *
 * What the static site keeps: every page, both locales, the catalog with its
 * filters, galleries, maps, JSON-LD, sitemap/robots/manifest and the OG cards.
 * What it swaps: form submissions go to WhatsApp instead of `/api`, and the
 * `/admin` back-office is not published (it needs a server and a database).
 *
 * Usage:  npm run build:static   →   out/
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const parked = path.join(root, ".static-build-parked");

/** Server-only paths, relative to `src/`, parked during the export build. */
const SERVER_ONLY = [
  path.join("app", "api"),
  path.join("app", "(backoffice)"),
  "middleware.ts",
];

/**
 * `next build` in export mode rewrites the default `.next` even when a custom
 * `distDir` is configured, which would leave `npm start` serving the export
 * (trailing-slash redirects, no middleware). Move the Node build aside for
 * the duration of the static build and put it back afterwards.
 */
const NODE_DIST = path.join(root, ".next");
const NODE_DIST_PARKED = path.join(root, ".next-node-parked");

function parkNodeDist() {
  fs.rmSync(NODE_DIST_PARKED, { recursive: true, force: true });
  if (fs.existsSync(NODE_DIST)) {
    fs.renameSync(NODE_DIST, NODE_DIST_PARKED);
    console.log("  parked  .next/ (Node build preserved)");
  }
}

function restoreNodeDist() {
  if (!fs.existsSync(NODE_DIST_PARKED)) return;
  fs.rmSync(NODE_DIST, { recursive: true, force: true });
  fs.renameSync(NODE_DIST_PARKED, NODE_DIST);
  console.log("  restored  .next/ (Node build)");
}

function park() {
  fs.rmSync(parked, { recursive: true, force: true });
  fs.mkdirSync(parked, { recursive: true });
  for (const rel of SERVER_ONLY) {
    const from = path.join(root, "src", rel);
    if (!fs.existsSync(from)) continue;
    const to = path.join(parked, rel.replace(/[()]/g, "_"));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.renameSync(from, to);
    console.log(`  parked  src/${rel}`);
  }
}

function restore() {
  if (!fs.existsSync(parked)) return;
  for (const rel of SERVER_ONLY) {
    const to = path.join(root, "src", rel);
    const from = path.join(parked, rel.replace(/[()]/g, "_"));
    if (!fs.existsSync(from)) continue;
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.renameSync(from, to);
    console.log(`  restored  src/${rel}`);
  }
  fs.rmSync(parked, { recursive: true, force: true });
}

/**
 * `output: "export"` produces no `/index.html` (the root is a redirect
 * handled by middleware on the Node build), so write a tiny locale picker
 * that mirrors `detectLocale()` in `src/lib/i18n/config.ts`.
 */
/**
 * With a custom `distDir` Next writes the export INTO that directory rather
 * than `out/`, so move it to the documented location. The Node build's
 * `.next` is never touched, which keeps `npm start` serving the server build.
 */
function publishOut() {
  const staged = path.join(root, ".next-static");
  const out = path.join(root, "out");
  if (!fs.existsSync(staged)) throw new Error("static export produced no .next-static/");
  fs.rmSync(out, { recursive: true, force: true });
  fs.renameSync(staged, out);
  console.log("  published  .next-static/ → out/");
}

function writeRootRedirect() {
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ISLEM Immobilier — Alger Centre</title>
    <meta name="robots" content="noindex,follow" />
    <link rel="alternate" hreflang="fr-DZ" href="fr/" />
    <link rel="alternate" hreflang="ar-DZ" href="ar/" />
    <link rel="alternate" hreflang="x-default" href="fr/" />
    <link rel="canonical" href="fr/" />
    <meta http-equiv="refresh" content="0; url=fr/" />
    <script>
      (function () {
        var l = "fr";
        try {
          var c = document.cookie.match(/(?:^|;\\s*)NEXT_LOCALE=(fr|ar)/);
          if (c) l = c[1];
          else if (/^ar/i.test(navigator.language || "")) l = "ar";
        } catch (e) {}
        var target = l + "/" + location.search + location.hash;
        document.querySelector('meta[http-equiv="refresh"]').content = "0; url=" + target;
        location.replace(target);
      })();
    </script>
  </head>
  <body>
    <p style="font-family: system-ui, sans-serif; padding: 2rem; text-align: center">
      <a href="fr/">Français</a> · <a href="ar/">العربية</a>
    </p>
  </body>
</html>
`;
  fs.writeFileSync(path.join(root, "out", "index.html"), html);
  console.log("  wrote  out/index.html (locale redirect)");
}

console.log("▸ Static export build (GitHub Pages / any static host)");
parkNodeDist();
park();
let code = 1;
try {
  const build = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_STATIC_EXPORT: "1",
      NEXT_PUBLIC_STATIC_SITE: "1",
    },
  });
  code = build.status ?? 1;
  if (code === 0) {
    publishOut();
    writeRootRedirect();
  }
} finally {
  restore();
  restoreNodeDist();
}

if (code !== 0) {
  console.error("✗ static build failed");
  process.exit(code);
}
console.log("✓ static site in out/ — serve it with: npx serve out");
