import { settings } from "@/lib/data/settings";
import { getPropertyBySlug } from "@/lib/data/repo";
import type { Inquiry, Submission } from "@/lib/data/types";

/** The form stores a slug; the agency reads a title. */
function propertyLabel(slug: string): string {
  const p = getPropertyBySlug(slug);
  if (!p) return slug;
  return `${p.title.fr} (${p.reference})`;
}

/**
 * Optional e-mail notification via Resend (no SDK — one fetch call).
 * Without RESEND_API_KEY the site still works: records land in
 * data/db.json + /admin. Configure RESEND_API_KEY & NOTIFY_EMAIL to
 * receive a copy of every inbound request in real time.
 */
export async function notify(payload: { subject: string; text: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${settings.brand.name} <onboarding@resend.dev>`,
        to: [to],
        subject: payload.subject,
        text: payload.text,
      }),
    });
    if (!res.ok) console.error("[mailer] resend responded", res.status, await res.text());
  } catch (err) {
    console.error("[mailer] notification failed", err);
  }
}

export function inquiryEmailBody(i: Inquiry): string {
  const lines = [
    `Type: ${i.kind === "visit" ? "Demande de visite" : "Contact depuis le site"}`,
    `Nom: ${i.name}`,
    `Téléphone: ${i.phone}`,
    i.whatsapp ? `WhatsApp: ${i.whatsapp}` : null,
    i.email ? `Email: ${i.email}` : null,
    i.propertySlug ? `Bien: ${propertyLabel(i.propertySlug)}` : null,
    i.preferredDate ? `Date souhaitée: ${i.preferredDate}` : null,
    `Langue: ${i.locale}`,
    "",
    i.message ?? "(aucun message)",
  ].filter(Boolean);
  return lines.join("\n");
}

export function submissionEmailBody(s: Submission): string {
  const lines = [
    "Nouveau bien soumis depuis le site :",
    `Propriétaire: ${s.ownerName}`,
    `Téléphone: ${s.phone}`,
    s.email ? `Email: ${s.email}` : null,
    `Type: ${s.propertyType} — ${s.transaction}`,
    `Quartier: ${s.neighborhood}`,
    s.price ? `Prix souhaité: ${s.price.toLocaleString("fr-FR")} DA` : null,
    s.surface ? `Surface: ${s.surface} m²` : null,
    s.bedrooms ? `Chambres: ${s.bedrooms}` : null,
    s.photos.length ? `Médias: ${s.photos.length}` : null,
    "",
    s.description,
  ].filter(Boolean);
  return lines.join("\n");
}
