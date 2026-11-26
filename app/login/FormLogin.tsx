"use client";

// Form login admin – Client Component (pakai useActionState).

import { useActionState } from "react";
import { loginAdmin } from "./actions";
import { Lock, TriangleAlert, LogIn } from "lucide-react";
import { alert, tombol } from "@/lib/ui";

export default function FormLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className={alert.error}>
          <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          <span className="inline-flex items-center gap-1.5">
            <Lock size={13} className="text-slate-400" aria-hidden />
            Kata Sandi Admin
          </span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-colors"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button type="submit" disabled={isPending} className={tombol.utama + " w-full"}>
        <LogIn size={15} aria-hidden />
        {isPending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
