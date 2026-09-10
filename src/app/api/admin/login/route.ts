import { NextResponse } from "next/server";
import { adminEnabled, checkPassword, createAdminSession } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminEnabled()) return NextResponse.json({ error: "disabled" }, { status: 404 });
  if (!rateLimit(`admin:${clientIp(req)}`, 8, 60_000)) return NextResponse.json({ error: "slow-down" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const ok = body?.password ? await checkPassword(body.password) : false;
  if (!ok) return NextResponse.json({ error: "invalid" }, { status: 401 });

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
