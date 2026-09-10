"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { ExternalIcon, PinIcon } from "@/components/icons";

/* One branded div-icon for every map on the site. */
const brandIcon = L.divIcon({
  className: "",
  html: `<span style="display:grid;place-items:center;width:36px;height:36px;border-radius:9999px;background:#14432f;border:3px solid #f7f4ed;box-shadow:0 6px 16px rgba(8,26,18,.35);color:#cfa454"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg></span>`,
  iconSize: [36, 36],
  iconAnchor: [18, 34],
  popupAnchor: [0, -32],
});

export function MapEmbed({
  lat,
  lng,
  zoom,
  label,
  sublabel,
  height = 380,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  label: string;
  sublabel?: string;
  height?: number;
}) {
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return (
    <div className="map-frame relative border border-line bg-sand" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom ?? 15}
        scrollWheelZoom={false}
        dragging
        className="h-full w-full"
        aria-label={label}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <Marker position={[lat, lng]} icon={brandIcon}>
          <Popup>
            <strong>{label}</strong>
            {sublabel ? <div className="text-sm text-muted">{sublabel}</div> : null}
          </Popup>
        </Marker>
      </MapContainer>
      <a
        href={gmaps}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm absolute bottom-3 end-3 z-[500] border border-line bg-white/95 !text-ink shadow-md backdrop-blur transition hover:bg-white"
      >
        <ExternalIcon size={14} className="text-forest-700" />
        <PinIcon size={14} className="text-brass-600" />
      </a>
    </div>
  );
}
