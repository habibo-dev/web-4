import { NextResponse } from "next/server";
import { inquiryFormSchema } from "@/lib/validation";
import { appendInquiry } from "@/lib/store";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { inquiryEmailBody, notify } from "@/lib/mailer";

export const runtime = "nodejs";

/**
 * POST /api/inquiries — visit requests & general contact messages.
 * Validates with the same zod schema as the client, rate-limits per IP,
 * persists to the records store and (optionally) e-mails the agency.
 */
export async function POST(req: Request) {
  try {
    if (!rateLimit(`inq:${clientIp(req)}`, 5, 60_000)) {
      return NextResponse.json({ error: "too-many-requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const parsed = inquiryFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
        { status: 422 },
      );
    }

    const d = parsed.data;
    const record = await appendInquiry({
      kind: d.kind,
      name: d.name,
      phone: d.phone,
      whatsapp: d.whatsapp,
      email: d.email,
      propertySlug: d.propertySlug,
      preferredDate: d.preferredDate,
      message: d.message,
      locale: d.locale,
    });

    void notify({
      subject:
        d.kind === "visit"
          ? `Nouvelle demande de visite — ${d.name}${d.propertySlug ? ` (${d.propertySlug})` : ""}`
          : `Nouveau message de contact — ${d.name}`,
      text: inquiryEmailBody({ ...record }),
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (err) {
    console.error("[api/inquiries]", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
