"use client";

// Komponen tombol Toggle Aktif & Hapus Ruang – Client Component.

import { useActionState } from "react";
import { toggleAktif, hapusRuang, HapusState } from "./actions";
import { Ruang } from "@/lib/types";
import { TriangleAlert, PowerOff, Power, Trash2 } from "lucide-react";

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
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
          ruang.aktif
            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
        }`}
      >
        {ruang.aktif ? (
          <>
            <PowerOff size={12} aria-hidden />
            Nonaktifkan
          </>
        ) : (
          <>
            <Power size={12} aria-hidden />
            Aktifkan
          </>
        )}
      </button>
    </form>
  );
}

export function TombolHapus({ ruang }: TombolRuangProps) {
  const [state, formAction, isPending] = useActionState(hapusRuang, hapusInitial);

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1 max-w-xs leading-snug flex items-start gap-1">
          <TriangleAlert size={11} className="mt-0.5 flex-shrink-0" aria-hidden />
          {state.error}
        </p>
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          <Trash2 size={12} aria-hidden />
          {isPending ? "Menghapus…" : "Hapus"}
        </button>
      </form>
    </div>
  );
}
