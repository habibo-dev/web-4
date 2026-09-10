/**
 * How inbound forms reach the agency.
 *
 * Two builds of the same site exist:
 *
 *  1. **Node build** (default — `npm run build && npm start`, VPS or Docker):
 *     the forms POST to `/api/inquiries` and `/api/property-submissions`,
 *     records land in `data/db.json` and show up in `/admin`.
 *
 *  2. **Static build** (`npm run build:static`, published to GitHub Pages or
 *     any static host): there is no server process, so no `/api` and no
 *     back-office. The very same forms stay fully usable — they hand the
 *     visitor to WhatsApp with the message already written out, which is how
 *     the agency is contacted in practice anyway.
 *
 * `NEXT_PUBLIC_STATIC_SITE` is inlined at build time by Next, so the browser
 * bundle of a static build contains no reference to `/api` at all.
 */
import { waLink } from "@/lib/data/settings";

export const STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === "1";

/** Opens the agency's WhatsApp with a ready-to-send message. */
export function sendViaWhatsApp(text: string): void {
  window.open(waLink(text), "_blank", "noopener,noreferrer");
}
