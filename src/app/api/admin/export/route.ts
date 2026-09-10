import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { listDb } from "@/lib/store";

export const runtime = "nodejs";

/** GET /api/admin/export?kind=inquiries|submissions|all — authenticated JSON backup. */
export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const kind = new URL(req.url).searchParams.get("kind") ?? "all";
  const db = await listDb();
  const body = kind === "inquiries" ? { inquiries: db.inquiries } : kind === "submissions" ? { submissions: db.submissions } : db;

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="islem-${kind}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
