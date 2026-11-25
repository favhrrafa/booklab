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
    <div>
      <form action={formAction} className="space-y-4 mb-6">
        {/* ID Pengajuan */}
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nomor ID Pengajuan <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="id"
            name="id"
            min="1"
            defaultValue={state.values?.id ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 5"
          />
        </div>

        {/* Nama Peminjam */}
        <div>
          <label
            htmlFor="peminjam"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Peminjam <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="peminjam"
            name="peminjam"
            defaultValue={state.values?.peminjam ?? ""}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama persis seperti saat pengajuan (case-sensitive)"
          />
          <p className="mt-1 text-xs text-gray-400">
            Nama harus persis sama dengan yang Anda isikan saat pengajuan.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Mencari..." : "Cek Status"}
        </button>
      </form>

      {/* Hasil */}
      {state.submitted && (
        <div>
          {state.error && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-sm text-red-700">
              ⚠️ {state.error}
            </div>
          )}

          {state.found && state.status && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-gray-800 mb-3">
                Status Pengajuan #{state.values.id}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">Status:</span>
                <BadgeStatus status={state.status} />
              </div>

              {state.status === "menunggu" && (
                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  ⏳ Pengajuan Anda sedang menunggu persetujuan admin.
                  Silakan cek kembali beberapa saat lagi.
                </p>
              )}

              {state.status === "disetujui" && (
                <p className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  ✅ Selamat! Pengajuan Anda telah <strong>disetujui</strong>.
                  Silakan gunakan ruang sesuai jadwal yang telah diajukan.
                </p>
              )}

              {state.status === "ditolak" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium mb-1">
                    ❌ Maaf, pengajuan Anda <strong>ditolak</strong>.
                  </p>
                  {state.alasan_tolak && (
                    <p className="text-sm text-red-600">
                      <strong>Alasan:</strong> {state.alasan_tolak}
                    </p>
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
