"use client";

// Form cek status peminjaman

import { useActionState } from "react";
import { cekStatusPeminjaman, cekInitialState } from "./actions";
import BadgeStatus from "@/components/BadgeStatus";
import {
  Hash,
  User,
  TriangleAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { labelField, petunjukField, alert, tombol } from "@/lib/ui";

export default function FormCek() {
  const [state, formAction, isPending] = useActionState(
    cekStatusPeminjaman,
    cekInitialState
  );

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="id" className={labelField}>
            <span className="inline-flex items-center gap-1.5">
              <Hash size={13} className="text-slate-400" aria-hidden />
              Nomor ID Pengajuan <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="number"
            id="id"
            name="id"
            min="1"
            defaultValue={state.values?.id ?? ""}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-colors"
            placeholder="Contoh: 5"
          />
        </div>

        <div>
          <label htmlFor="peminjam" className={labelField}>
            <span className="inline-flex items-center gap-1.5">
              <User size={13} className="text-slate-400" aria-hidden />
              Nama Peminjam <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            id="peminjam"
            name="peminjam"
            defaultValue={state.values?.peminjam ?? ""}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-colors"
            placeholder="Nama persis seperti saat pengajuan"
          />
          <p className={petunjukField}>
            Harus sama persis dengan nama saat pengajuan (case-sensitive).
          </p>
        </div>

        <button type="submit" disabled={isPending} className={tombol.utama + " w-full"}>
          <Search size={15} aria-hidden />
          {isPending ? "Mencari…" : "Cek Status"}
        </button>
      </form>

      {state.submitted && (
        <div>
          {state.error && (
            <div className={alert.error}>
              <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
              <span>{state.error}</span>
            </div>
          )}

          {state.found && state.status && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Status Pengajuan #{state.values.id}
                </p>
                <BadgeStatus status={state.status} />
              </div>

              {state.status === "menunggu" && (
                <div className={alert.peringatan}>
                  <Clock size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-medium mb-1">Sedang menunggu persetujuan</p>
                    <p className="text-xs opacity-80">
                      Admin akan meninjau pengajuan Anda. Silakan cek kembali
                      beberapa saat lagi.
                    </p>
                  </div>
                </div>
              )}

              {state.status === "disetujui" && (
                <div className={alert.sukses}>
                  <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-medium mb-1">Pengajuan disetujui</p>
                    <p className="text-xs opacity-80">
                      Silakan gunakan ruang sesuai jadwal yang telah Anda
                      ajukan.
                    </p>
                  </div>
                </div>
              )}

              {state.status === "ditolak" && (
                <div className={alert.error}>
                  <XCircle size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
                  <div className="flex-1">
                    <p className="font-medium mb-2">Pengajuan ditolak</p>
                    {state.alasan_tolak && (
                      <div className="bg-white/70 rounded-xl p-3 border border-red-100">
                        <p className="text-xs text-red-500 uppercase tracking-wide font-medium mb-1">
                          Alasan
                        </p>
                        <p className="text-sm text-red-700">{state.alasan_tolak}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
