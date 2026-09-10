import localFont from "next/font/local";

/**
 * Self-hosted font pipeline — no third-party CDN at runtime, fully offline
 * build. Latin faces: Inter (UI) + Fraunces (editorial display).
 * Arabic face: IBM Plex Sans Arabic.
 */
export const fontInter = localFont({
  src: [
    { path: "../app/fonts/inter-latin.woff2", weight: "400 700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const fontFraunces = localFont({
  src: [
    { path: "../app/fonts/fraunces-latin.woff2", weight: "300 700", style: "normal" },
    { path: "../app/fonts/fraunces-latin-italic.woff2", weight: "300 700", style: "italic" },
    { path: "../app/fonts/fraunces-latin-ext.woff2", weight: "300 700", style: "normal" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const fontPlexArabic = localFont({
  src: [
    { path: "../app/fonts/plex-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/plex-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/plex-arabic-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/plex-arabic-700.woff2", weight: "700", style: "normal" },
    { path: "../app/fonts/plex-arabic-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/plex-arabic-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/plex-arabic-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  fallback: ["system-ui", "Tahoma", "Arial", "sans-serif"],
});
