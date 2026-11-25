"use client";

// Form login admin – Client Component (pakai useActionState).

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function FormLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5 text-sm text-red-700">
          <span className="flex-shrink-0 mt-0.5">⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Kata Sandi Admin
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {isPending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
