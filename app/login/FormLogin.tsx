"use client";

// Form login admin – Client Component (pakai useActionState).

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function FormLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-700">
          ⚠️ {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Kata Sandi Admin
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Masukkan kata sandi"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-60 transition-colors"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
