import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal, dependency-free admin session for the agency back-office.
 * Password from env (ADMIN_PASSWORD); cookie signed with ADMIN_SESSION_SECRET.
 * For multi-server deployments replace with your CMS/SSO — see docs/ADMIN.md.
 */
const COOKIE = "islem_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 12;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "islem-dev-secret";
}

export function adminEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sign(exp: string): string {
  return createHmac("sha256", secret()).update(exp).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(createHash("sha256").update(input).digest("hex"), createHash("sha256").update(expected).digest("hex"));
}

export async function createAdminSession(): Promise<void> {
  const exp = String(Date.now() + MAX_AGE_MS);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + MAX_AGE_MS),
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}
