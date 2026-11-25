"use client";

// Komponen tombol aksi Setujui & Tolak – Client Component karena pakai useActionState.
// Muncul hanya untuk peminjaman berstatus 'menunggu'.

import { useActionState, useRef } from "react";
import { setujuiPeminjaman, tolakPeminjaman, AdminActionState } from "./actions";

interface TombolAksiProps {
  peminjamanId: number;
}

const initialState: AdminActionState = {};

export function TombolSetujui({ peminjamanId }: TombolAksiProps) {
  const [state, formAction, isPending] = useActionState(setujuiPeminjaman, initialState);

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1">⚠️ {state.error}</p>
      )}
      {state.sukses && (
        <p className="text-xs text-green-600 mb-1">✅ {state.sukses}</p>
      )}
      <form action={formAction}>
        <input type="hidden" name="peminjaman_id" value={peminjamanId} />
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Memproses..." : "Setujui"}
        </button>
      </form>
    </div>
  );
}

export function TombolTolak({ peminjamanId }: TombolAksiProps) {
  const [state, formAction, isPending] = useActionState(tolakPeminjaman, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      {state.error && (
        <p className="text-xs text-red-600 mb-1">⚠️ {state.error}</p>
      )}
      {state.sukses && (
        <p className="text-xs text-green-600 mb-1">✅ {state.sukses}</p>
      )}

      {/* Tombol buka dialog penolakan */}
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
      >
        Tolak
      </button>

      {/* Dialog konfirmasi penolakan */}
      <dialog
        ref={dialogRef}
        className="rounded-xl border border-gray-200 shadow-lg p-6 w-full max-w-sm backdrop:bg-black/40"
      >
        <h3 className="font-semibold text-gray-900 mb-3">Tolak Peminjaman</h3>
        <form action={formAction} method="dialog">
          <input type="hidden" name="peminjaman_id" value={peminjamanId} />

          <div className="mb-3">
            <label
              htmlFor={`alasan-${peminjamanId}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              id={`alasan-${peminjamanId}`}
              name="alasan_tolak"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Minimal 5 karakter..."
            />
            {state.error?.includes("Alasan") && (
              <p className="mt-1 text-xs text-red-600">{state.error}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 text-sm bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:opacity-60"
            >
              {isPending ? "Memproses..." : "Konfirmasi Tolak"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
