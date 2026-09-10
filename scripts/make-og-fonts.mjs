/**
 * Rebuild the OpenGraph font assets:  src/app/fonts/og-*.ttf
 *
 * Pipeline (run once whenever the brand fonts change):
 *   1. wawoff2 decompresses the site's variable woff2 files → variable ttf
 *   2. fontTools.varLib.instancer freezes the design axis at the exact
 *      weight used on the card (satori — the layout engine behind next/og —
 *      cannot read variable-font `fvar` tables from woff2-derived files).
 *
 * Usage:  node scripts/make-og-fonts.mjs
 * Requires: devDependency `wawoff2`, python3 with fonttools installed.
 */
import fs from "node:fs";
import { execSync } from "node:child_process";
import wawoff from "wawoff2";

const DIR = "src/app/fonts";
const pairs = [
  ["inter-latin.woff2", "og-inter.ttf"],
  ["fraunces-latin.woff2", "og-fraunces.ttf"],
];

for (const [src, dst] of pairs) {
  const ttf = await wawoff.decompress(fs.readFileSync(`${DIR}/${src}`));
  fs.writeFileSync(`${DIR}/${dst}`, Buffer.from(ttf));
  console.log(`✓ decompressed ${dst}`);
}

const statics = [
  ["og-inter.ttf", "og-inter-400.ttf", "wght=400"],
  ["og-inter.ttf", "og-inter-700.ttf", "wght=700"],
  ["og-fraunces.ttf", "og-fraunces-600.ttf", "wght=600 opsz=80"],
];
for (const [src, dst, axes] of statics) {
  execSync(`python3 -m fontTools.varLib.instancer ${DIR}/${src} ${axes} -o ${DIR}/${dst}`, { stdio: "inherit" });
  console.log(`✓ instanced ${dst} @ ${axes}`);
}
