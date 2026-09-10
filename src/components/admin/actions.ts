"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { checkPassword, createAdminSession, clearAdminSession, isAdmin } from "@/lib/admin-auth";
import { setRecordStatus } from "@/lib/store";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Server actions for the back-office.
 *
 * Server actions are ordinary POST endpoints: Next ships their ids in the
 * page payload and anyone can replay them. Every mutating action below
 * therefore re-checks the session cookie itself — never rely on the fact
 * that the form is only *rendered* for an admin.
 */

/** Throws instead of silently no-oping, so a forged call cannot look successful. */
async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("unauthorized");
}

export async function loginAction(_prev: { error?: string } | null, formData: FormData): Promise<{ error?: string }> {
  const ip = clientIp({ headers: await headers() });
  // Per-IP: a shared key would let any visitor lock the agency out.
  if (!rateLimit(`admin-login:${ip}`, 8, 60_000)) return { error: "Trop de tentatives — réessayez dans quelques minutes." };

  const password = String(formData.get("password") ?? "");
  const ok = await checkPassword(password);
  if (!ok) return { error: "Mot de passe incorrect." };
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin");
}

export async function statusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const kind = formData.get("kind") === "submission" ? "submission" : "inquiry";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  const allowed =
    kind === "inquiry"
      ? ["new", "in-progress", "done", "archived"]
      : ["new", "reviewing", "contacted", "listed", "closed"];
  if (!allowed.includes(status)) return;
  await setRecordStatus(kind, id, status);
  revalidatePath("/admin");
}
