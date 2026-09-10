"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createAdminSession, clearAdminSession } from "@/lib/admin-auth";
import { setRecordStatus } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limit";

export async function loginAction(_prev: { error?: string } | null, formData: FormData): Promise<{ error?: string }> {
  const key = `admin-login`;
  if (!rateLimit(key, 10, 120_000)) return { error: "Trop de tentatives — réessayez dans quelques minutes." };

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
