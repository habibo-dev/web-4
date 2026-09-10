import type { NextConfig } from "next";

/**
 * Two build modes, one codebase:
 *
 *  · default — Node server (`npm run build && npm start`): `/api` routes,
 *    the `/admin` back-office and `next/image` optimisation are all live.
 *  · `NEXT_STATIC_EXPORT=1` (`npm run build:static`) — a fully static site
 *    for GitHub Pages / Netlify / S3. Server-only pieces (API routes, admin,
 *    middleware) are parked by `scripts/build-static.mjs` before the build
 *    and forms fall back to WhatsApp (see `src/lib/submit-mode.ts`).
 */
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

/**
 * GitHub Pages serves a *project* site from `https://user.github.io/<repo>/`,
 * so the build must know its prefix. Leave unset for a domain root
 * (custom domain, `user.github.io` repo, VPS, Netlify, Vercel…).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(basePath ? { basePath } : {}),
  ...(staticExport
    ? {
        output: "export" as const,
        // GitHub Pages serves `out/` verbatim; trailing slashes make every
        // route resolve to its own `index.html` without server rewrites.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  images: {
    formats: ["image/webp", "image/avif"],
    // Responsive breakpoints tuned for a photo-heavy catalog site.
    deviceSizes: [360, 420, 540, 640, 750, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [24, 32, 48, 64, 96, 128, 256, 384, 512],
    ...(staticExport ? { unoptimized: true } : {}),
  },
  experimental: {
    optimizePackageImports: ["react-leaflet", "leaflet"],
  },
  // `headers()` is a Node-server feature; omitted entirely in the static build.
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/fonts/:all*(.woff2)",
              headers: [
                { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
              ],
            },
            {
              source: "/images/:all*",
              headers: [
                { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
