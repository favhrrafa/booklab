"use client";

// Tombol Setujui dan Tolak – hanya muncul untuk peminjaman berstatus menunggu

import { useActionState, useRef, useEffect } from "react";
import {
  setujuiPeminjaman,
  tolakPeminjaman,
} from "./actions";
import type { AdminActionState } from "@/lib/types";
import { CheckCircle2, XCircle, TriangleAlert, CheckCheck } from "lucide-react";
import { tombol } from "@/lib/ui";

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
        <p className="text-xs text-red-600 mb-1.5 flex items-center gap-1">
          <TriangleAlert size={11} aria-hidden />
          {state.error}
        </p>
      )}
      {state.sukses && (
        <p className="text-xs text-emerald-600 mb-1.5 flex items-center gap-1">
          <CheckCheck size={11} aria-hidden />
          {state.sukses}
        </p>
      )}
      <form action={formAction}>
        <input type="hidden" name="peminjaman_id" value={peminjamanId} />
        <button type="submit" disabled={isPending} className={tombol.sukses}>
          <CheckCircle2 size={13} aria-hidden />
          {isPending ? "Memproses…" : "Setujui"}
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
  const formRef   = useRef<HTMLFormElement>(null);

  // Tutup dialog & reset form setelah sukses
  useEffect(() => {
    if (state.sukses) {
      dialogRef.current?.close();
      formRef.current?.reset();
    }
  }, [state.sukses]);

  return (
    <div>
      {state.sukses && (
        <p className="text-xs text-emerald-600 mb-1.5 flex items-center gap-1">
          <CheckCheck size={11} aria-hidden />
          {state.sukses}
        </p>
      )}

      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={tombol.bahaya}
      >
        <XCircle size={13} aria-hidden />
        Tolak
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-slate-200 shadow-2xl p-0 w-full max-w-md backdrop:bg-slate-900/50"
      >
        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Tolak Peminjaman
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Berikan alasan penolakan minimal 5 karakter.
          </p>

          {/* Tidak pakai method="dialog" — form submit lewat Server Action */}
          <form ref={formRef} action={formAction}>
            <input type="hidden" name="peminjaman_id" value={peminjamanId} />

            <div className="mb-5">
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
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-colors resize-none"
                placeholder="Minimal 5 karakter…"
              />
              {state.error && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <TriangleAlert size={11} aria-hidden />
                  {state.error}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
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
