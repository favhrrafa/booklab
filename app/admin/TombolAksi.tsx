"use client";

// Komponen tombol Setujui & Tolak – Client Component karena pakai useActionState.
// Muncul hanya untuk peminjaman berstatus 'menunggu'.

import { useActionState, useRef } from "react";
import {
  setujuiPeminjaman,
  tolakPeminjaman,
  AdminActionState,
} from "./actions";

interface TombolAksiProps {
  peminjamanId: number;
}

const initialState: AdminActionState = {};

export function TombolSetujui({ peminjamanId }: TombolAksiProps) {
  const [state, formAction, isPending] = useActionState(
    setujuiPeminjaman,
    initialState
  );

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1.5">⚠️ {state.error}</p>
      )}
      {state.sukses && (
        <p className="text-xs text-emerald-600 mb-1.5">✓ {state.sukses}</p>
      )}
      <form action={formAction}>
        <input type="hidden" name="peminjaman_id" value={peminjamanId} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? (
            "Memproses…"
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Setujui
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export function TombolTolak({ peminjamanId }: TombolAksiProps) {
  const [state, formAction, isPending] = useActionState(
    tolakPeminjaman,
    initialState
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1.5">⚠️ {state.error}</p>
      )}
      {state.sukses && (
        <p className="text-xs text-emerald-600 mb-1.5">✓ {state.sukses}</p>
      )}

      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-1.5 bg-white text-red-600 text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Tolak
      </button>

      {/* Dialog konfirmasi tolak */}
      <dialog
        ref={dialogRef}
        className="rounded-xl border border-slate-200 shadow-xl p-0 w-full max-w-md backdrop:bg-slate-900/50"
      >
        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Tolak Peminjaman
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Berikan alasan penolakan minimal 5 karakter.
          </p>

          <form action={formAction} method="dialog">
            <input type="hidden" name="peminjaman_id" value={peminjamanId} />

            <div className="mb-4">
              <label
                htmlFor={`alasan-${peminjamanId}`}
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`alasan-${peminjamanId}`}
                name="alasan_tolak"
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors resize-none"
                placeholder="Minimal 5 karakter…"
              />
              {state.error?.includes("Alasan") && (
                <p className="mt-1 text-xs text-red-600">{state.error}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Memproses…" : "Konfirmasi Tolak"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
