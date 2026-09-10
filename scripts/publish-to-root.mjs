#!/usr/bin/env node
/**
 * Publishes `out/` (the static export) to the repository root.
 *
 * GitHub Pages on this repo is configured for **legacy** builds from the
 * branch root, and the token available here cannot switch it to
 * workflow-based deployments. Legacy mode runs Jekyll, which cannot build a
 * Next.js app — so the built site is committed instead, and `.nojekyll`
 * tells Pages to serve those files verbatim (Jekyll would otherwise skip
 * `_next/` and try to render the markdown).
 *
 * Nothing in the source tree is touched: the published paths are a fixed,
 * known list and are refreshed in place on every run.
 *
 * Usage:  npm run build:static && node scripts/publish-to-root.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");

/** Every top-level entry the export produces, plus the Pages marker. */
const PUBLISHED = [
  ".nojekyll",
  "404",
  "404.html",
  "_next",
  "ar",
  "fr",
  "icon.svg",
  "images",
  "index.html",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap.xml",
];

if (!fs.existsSync(out)) {
  console.error("✗ out/ not found — run `npm run build:static` first");
  process.exit(1);
}

// Fail loudly rather than silently deleting something unexpected.
for (const name of fs.readdirSync(out)) {
  if (!PUBLISHED.includes(name)) {
    console.error(`✗ unexpected export entry "${name}" — add it to PUBLISHED`);
    process.exit(1);
  }
}

for (const name of PUBLISHED) {
  const target = path.join(root, name);
  fs.rmSync(target, { recursive: true, force: true });
  const src = path.join(out, name);
  if (name === ".nojekyll") {
    fs.writeFileSync(target, "");
    continue;
  }
  if (!fs.existsSync(src)) continue;
  fs.cpSync(src, target, { recursive: true });
}

const pages = PUBLISHED.filter((n) => n !== ".nojekyll" && fs.existsSync(path.join(root, n)));
console.log(`✓ published ${pages.length} entries to the repo root (+ .nojekyll)`);
