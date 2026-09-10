"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet touches `window` at import time → load the map client-side only.
 * The bridge keeps server pages importable and renders a branded skeleton
 * until the map is ready.
 */
export const MapEmbed = dynamic(
  () => import("./MapEmbed").then((mod) => mod.MapEmbed),
  {
    ssr: false,
    loading: () => (
      <div className="map-frame relative flex items-center justify-center border border-line bg-sand" style={{ height: 380 }}>
        <span className="flex flex-col items-center gap-3 text-muted">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          <span className="text-[0.8rem] font-medium">Carte / خريطة</span>
        </span>
      </div>
    ),
  },
);
