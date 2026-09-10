import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";
import { settings } from "@/lib/data/settings";

export const alt = "ISLEM Immobilier — Alger Centre";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const fontsDir = path.join(process.cwd(), "src", "app", "fonts");
  // Static TTF instances (see scripts/make-og-fonts.mjs) — satori rejects woff2 containers.
  const [inter400, inter700, fraunces] = await Promise.all([
    fs.readFile(path.join(fontsDir, "og-inter-400.ttf")),
    fs.readFile(path.join(fontsDir, "og-inter-700.ttf")),
    fs.readFile(path.join(fontsDir, "og-fraunces-600.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "linear-gradient(160deg, #0e2a1e 0%, #081a12 58%, #14432f 100%)",
          color: "#f7f4ed",
          position: "relative",
        }}
      >
        {/* decorative hairline grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "repeating-linear-gradient(90deg, rgba(247,244,237,0.05) 0px, rgba(247,244,237,0.05) 1px, transparent 1px, transparent 120px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="64" height="64" viewBox="0 0 48 48">
            <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#14432f" />
            <path d="M24 11c-6.4 0-10.6 4.1-10.6 9.6V37h21.2V20.6C34.6 15.1 30.4 11 24 11Z" fill="none" stroke="#cfa454" stroke-width="2.4" />
            <path d="M24 19.5c-3 0-5 1.9-5 4.6V37h10V24.1c0-2.7-2-4.6-5-4.6Z" fill="#cfa454" />
            <path d="M15.5 37h17" stroke="#e2c48c" stroke-width="2.2" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, letterSpacing: "8px", color: "#cfa454", fontFamily: "Fraunces", fontWeight: 600 }}>
              ISLEM IMMOBILIER
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 58, fontFamily: "Fraunces", fontWeight: 600, letterSpacing: "-1px", lineHeight: 1.15 }}>
            Votre projet immobilier
          </span>
          <span style={{ fontSize: 58, fontFamily: "Fraunces", fontWeight: 600, letterSpacing: "-1px", lineHeight: 1.15 }}>
            commence ici.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 18, paddingTop: 10 }}>
            <div style={{ width: 64, height: 4, background: "#b9862f", display: "flex" }} />
            <span style={{ fontSize: 26, fontFamily: "Inter", color: "rgba(247,244,237,0.78)", display: "flex" }}>
              Agence immobilière · 30 Rue Didouche Mourad, Alger Centre
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 30, fontFamily: "Inter", fontWeight: 700, color: "#cfa454", display: "flex" }}>
            {settings.contact.phoneDisplay}
          </span>
          <span style={{ fontSize: 22, fontFamily: "Inter", color: "rgba(247,244,237,0.55)", display: "flex" }}>
            WhatsApp disponible · Ventes & Locations
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter400, style: "normal", weight: 400 },
        { name: "Inter", data: inter700, style: "normal", weight: 700 },
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
      ],
    },
  );
}
