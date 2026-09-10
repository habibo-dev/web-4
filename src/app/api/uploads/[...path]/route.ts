import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveUploadPath } from "@/lib/store";
import { isAllowedImage } from "@/lib/store";

export const runtime = "nodejs";

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

/**
 * GET /api/uploads/<YYYY-MM>/<file> — streams a submitted photo.
 *
 * Uploads are written at runtime, and `next start` refuses to serve anything
 * that was not in `public/` at build time, so they cannot live there. Names
 * carry a random prefix and are therefore not enumerable; there is no
 * directory listing.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const rel = (segments ?? []).map(decodeURIComponent).join("/");

  if (!isAllowedImage(rel)) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const file = await resolveUploadPath(rel);
  if (!file) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const buf = await fs.readFile(file);
  const type = CONTENT_TYPE[path.extname(file).toLowerCase()] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(buf.byteLength),
      // Owner photos are not part of the public catalog: short cache, no CDN sharing.
      "Cache-Control": "private, max-age=3600, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
