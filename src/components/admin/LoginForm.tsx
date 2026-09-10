"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  return (
    <form action={formAction} className="card mt-8 max-w-sm space-y-4 border border-[#ddd4c1] bg-white p-7 shadow-sm">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#5d6a60]">Mot de passe</span>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="w-full rounded-xl border border-[#ddd4c1] bg-white px-3.5 py-2.5 outline-none transition focus:border-[#236b4c] focus:ring-4 focus:ring-[#236b4c]/15"
        />
      </label>
      {state?.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#14432f] px-5 py-3 text-sm font-semibold text-[#f7f4ed] transition hover:bg-[#0e2a1e] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
