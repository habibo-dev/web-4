import { NextResponse } from "next/server";
import Busboy from "busboy";
import { Readable } from "node:stream";
import { submissionFormSchema, collectErrors } from "@/lib/validation";
import { appendSubmission, saveUpload, isAllowedImage } from "@/lib/store";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { submissionEmailBody, notify } from "@/lib/mailer";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per image
const MAX_FILES = 6;

/**
 * POST /api/property-submissions — multipart (fields + photos).
 * Photos go to /public/uploads/YYYY-MM/ and are referenced by path.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`sub:${ip}`, 3, 120_000)) {
    return NextResponse.json({ error: "too-many-requests" }, { status: 429 });
  }

  const fields: Record<string, string> = {};
  const files: { name: string; type: string; buffer: Buffer }[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      const bb = Busboy({ headers: Object.fromEntries(req.headers.entries()), limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES, fields: 30 } });

      bb.on("field", (name: string, value: string) => {
        fields[name] = value;
      });
      bb.on("file", (name: string, stream: NodeJS.ReadableStream, info: { filename: string; mimeType: string }) => {
        if (name !== "photos") {
          stream.resume();
          return;
        }
        const chunks: Buffer[] = [];
        stream.on("data", (c: Buffer) => chunks.push(c));
        stream.on("end", () => {
          if (isAllowedImage(info.filename) && files.length < MAX_FILES) {
            files.push({ name: info.filename, type: info.mimeType, buffer: Buffer.concat(chunks) });
          }
        });
      });
      bb.on("finish", () => resolve());
      bb.on("error", reject);

      if (req.body) {
        Readable.fromWeb(req.body as import("node:stream/web").ReadableStream<Uint8Array>).pipe(bb);
      } else {
        bb.end();
      }
    });
  } catch (err) {
    console.error("[api/submissions] parse", err);
    return NextResponse.json({ error: "unparsable" }, { status: 400 });
  }

  // rehydrate photoLinks from indexed fields
  const photoLinks: string[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (/^photoLink\d+$/.test(k) && v) photoLinks.push(v);
  }

  const parsed = submissionFormSchema.safeParse({
    ownerName: fields.ownerName,
    phone: fields.phone,
    whatsapp: fields.whatsapp || undefined,
    email: fields.email || undefined,
    propertyType: fields.propertyType,
    transaction: fields.transaction,
    neighborhood: fields.neighborhood,
    price: fields.price || undefined,
    surface: fields.surface || undefined,
    bedrooms: fields.bedrooms || undefined,
    description: fields.description,
    photoLinks,
    consent: fields.consent === "true",
    locale: fields.locale === "ar" ? "ar" : "fr",
    company: fields.company,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", fields: collectErrors(parsed.error) }, { status: 422 });
  }

  const savedPhotos: string[] = [];
  for (const f of files) {
    try {
      savedPhotos.push(await saveUpload(f.name, f.buffer));
    } catch (err) {
      console.error("[api/submissions] save", err);
    }
  }
  const photos = [...savedPhotos, ...photoLinks];

  const record = await appendSubmission({
    ownerName: parsed.data.ownerName,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    propertyType: parsed.data.propertyType,
    transaction: parsed.data.transaction,
    neighborhood: parsed.data.neighborhood,
    price: parsed.data.price,
    surface: parsed.data.surface,
    bedrooms: parsed.data.bedrooms,
    description: parsed.data.description,
    photos,
    consent: parsed.data.consent,
    locale: parsed.data.locale,
  });

  void notify({
    subject: `Nouveau bien soumis — ${record.ownerName} (${record.propertyType}/${record.transaction})`,
    text: submissionEmailBody(record),
  });

  return NextResponse.json({ ok: true, id: record.id, photos: savedPhotos.length }, { status: 201 });
}
