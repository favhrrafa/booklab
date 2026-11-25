"use client";

// Komponen tombol Toggle Aktif & Hapus Ruang – Client Component.

import { useActionState } from "react";
import { toggleAktif, hapusRuang, HapusState } from "./actions";
import { Ruang } from "@/lib/types";

interface TombolRuangProps {
  ruang: Ruang;
}

const hapusInitial: HapusState = {};

export function TombolToggleAktif({ ruang }: TombolRuangProps) {
  return (
    <form action={toggleAktif}>
      <input type="hidden" name="ruang_id" value={ruang.id} />
      <button
        type="submit"
        className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
          ruang.aktif
            ? "bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200"
            : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
        }`}
      >
        {ruang.aktif ? "Nonaktifkan" : "Aktifkan"}
      </button>
    </form>
  );
}

export function TombolHapus({ ruang }: TombolRuangProps) {
  const [state, formAction, isPending] = useActionState(hapusRuang, hapusInitial);

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1 max-w-xs">⚠️ {state.error}</p>
      )}
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!confirm(`Yakin ingin menghapus "${ruang.nama}"?`)) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="ruang_id" value={ruang.id} />
        <button
          type="submit"
          disabled={isPending}
          className="text-xs font-semibold px-3 py-1.5 rounded bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Menghapus..." : "Hapus"}
        </button>
      </form>
    </div>
  );
}
