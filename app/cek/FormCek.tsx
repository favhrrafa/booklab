"use client";

// Form cek status peminjaman – Client Component (pakai useActionState).

import { useActionState } from "react";
import { cekStatusPeminjaman, cekInitialState } from "./actions";
import BadgeStatus from "@/components/BadgeStatus";

export default function FormCek() {
  const [state, formAction, isPending] = useActionState(
    cekStatusPeminjaman,
    cekInitialState
  );

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4">
        {/* ID Pengajuan */}
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Nomor ID Pengajuan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="id"
            name="id"
            min="1"
            defaultValue={state.values?.id ?? ""}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            placeholder="Contoh: 5"
          />
        </div>

        {/* Nama Peminjam */}
        <div>
          <label
            htmlFor="peminjam"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Nama Peminjam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="peminjam"
            name="peminjam"
            defaultValue={state.values?.peminjam ?? ""}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            placeholder="Nama persis seperti saat pengajuan"
          />
          <p className="mt-1 text-xs text-slate-400">
            Harus sama persis dengan nama yang Anda isi saat pengajuan (case-sensitive).
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isPending ? "Mencari…" : "Cek Status"}
        </button>
      </form>

      {/* Hasil */}
      {state.submitted && (
        <div>
          {/* Error / tidak ditemukan */}
          {state.error && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              <span className="flex-shrink-0">⚠️</span>
              <span>{state.error}</span>
            </div>
          )}

          {/* Ditemukan */}
          {state.found && state.status && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Status Pengajuan #{state.values.id}
                </p>
                <BadgeStatus status={state.status} />
              </div>

              {state.status === "menunggu" && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                  <p className="font-medium mb-1">Sedang menunggu persetujuan</p>
                  <p className="text-amber-600 text-xs">
                    Admin akan meninjau pengajuan Anda. Silakan cek kembali
                    beberapa saat lagi.
                  </p>
                </div>
              )}

              {state.status === "disetujui" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
                  <p className="font-medium mb-1">Pengajuan disetujui ✓</p>
                  <p className="text-emerald-600 text-xs">
                    Silakan gunakan ruang sesuai jadwal yang telah Anda ajukan.
                  </p>
                </div>
              )}

              {state.status === "ditolak" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  <p className="font-medium mb-2">Pengajuan ditolak</p>
                  {state.alasan_tolak && (
                    <div className="bg-white/70 rounded-md p-3 border border-red-100">
                      <p className="text-xs text-red-500 uppercase tracking-wide font-medium mb-1">
                        Alasan
                      </p>
                      <p className="text-sm text-red-700">{state.alasan_tolak}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
