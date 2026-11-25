"use client";

// Form pengajuan peminjaman – Client Component (pakai useActionState).
// Validasi sesungguhnya ada di Server Action; form hanya menampilkan error.

import { useActionState } from "react";
import { ajukanPeminjaman, initialState } from "./actions";
import { Ruang } from "@/lib/types";
import Link from "next/link";

interface FormPinjamProps {
  ruangList: Ruang[];
  ruangIdAwal?: string;
}

// Helper: class input dengan kondisi error
function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
    hasError
      ? "border-red-400 bg-red-50/40"
      : "border-slate-200 bg-white hover:border-slate-300"
  }`;
}

export default function FormPinjam({ ruangList, ruangIdAwal }: FormPinjamProps) {
  const [state, formAction, isPending] = useActionState(ajukanPeminjaman, {
    ...initialState,
    values: { ...initialState.values, ruang_id: ruangIdAwal ?? "" },
  });

  // Tampilan sukses
  if (state.sukses) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Pengajuan Berhasil!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Simpan nomor ID berikut untuk mengecek status persetujuan.
        </p>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6 inline-block min-w-[160px]">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
            Nomor ID Pengajuan
          </p>
          <p className="text-4xl font-bold text-blue-600">#{state.sukses.id}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mb-6 text-left">
          ⚠️ <strong>Simpan nomor ini!</strong> Anda membutuhkannya untuk
          mengecek status bersama nama peminjam yang Anda isi tadi.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cek"
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Cek Status Pengajuan
          </Link>
          <Link
            href="/"
            className="border border-slate-200 text-slate-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Error umum (bentrok jadwal, dll.) */}
      {state.errors.umum && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <span className="flex-shrink-0 mt-0.5">⚠️</span>
          <span>{state.errors.umum}</span>
        </div>
      )}

      {/* Ruang */}
      <div>
        <label
          htmlFor="ruang_id"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Ruang <span className="text-red-500">*</span>
        </label>
        <select
          id="ruang_id"
          name="ruang_id"
          defaultValue={state.values.ruang_id}
          className={inputClass(!!state.errors.ruang_id) + " bg-white"}
        >
          <option value="">Pilih ruang…</option>
          {ruangList.map((r) => (
            <option key={r.id} value={String(r.id)}>
              {r.nama} — {r.lokasi} (maks. {r.kapasitas} orang)
            </option>
          ))}
        </select>
        {state.errors.ruang_id && (
          <p className="mt-1 text-xs text-red-600">{state.errors.ruang_id}</p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label
          htmlFor="tanggal"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Tanggal Peminjaman <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          defaultValue={state.values.tanggal}
          className={inputClass(!!state.errors.tanggal)}
        />
        {state.errors.tanggal ? (
          <p className="mt-1 text-xs text-red-600">{state.errors.tanggal}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">
            Senin–Jumat, maksimal 60 hari ke depan.
          </p>
        )}
      </div>

      {/* Jam */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="mulai"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Jam Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="mulai"
            name="mulai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.mulai}
            className={inputClass(!!state.errors.mulai)}
          />
          {state.errors.mulai && (
            <p className="mt-1 text-xs text-red-600">{state.errors.mulai}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="selesai"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Jam Selesai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="selesai"
            name="selesai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.selesai}
            className={inputClass(!!state.errors.selesai)}
          />
          {state.errors.selesai && (
            <p className="mt-1 text-xs text-red-600">{state.errors.selesai}</p>
          )}
        </div>
      </div>
      {!state.errors.mulai && !state.errors.selesai && (
        <p className="text-xs text-slate-400 -mt-3">
          Jam operasional: 07:00–17:00. Durasi maksimal 3 jam.
        </p>
      )}

      {/* Jumlah Orang */}
      <div>
        <label
          htmlFor="jumlah_orang"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Jumlah Orang <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="jumlah_orang"
          name="jumlah_orang"
          min="1"
          defaultValue={state.values.jumlah_orang}
          className={inputClass(!!state.errors.jumlah_orang)}
          placeholder="Contoh: 25"
        />
        {state.errors.jumlah_orang && (
          <p className="mt-1 text-xs text-red-600">{state.errors.jumlah_orang}</p>
        )}
      </div>

      {/* Peminjam */}
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
          defaultValue={state.values.peminjam}
          maxLength={40}
          className={inputClass(!!state.errors.peminjam)}
          placeholder="Nama lengkap Anda"
        />
        {state.errors.peminjam ? (
          <p className="mt-1 text-xs text-red-600">{state.errors.peminjam}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">3–40 karakter.</p>
        )}
      </div>

      {/* Keperluan */}
      <div>
        <label
          htmlFor="keperluan"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Keperluan / Tujuan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="keperluan"
          name="keperluan"
          rows={3}
          maxLength={120}
          defaultValue={state.values.keperluan}
          className={inputClass(!!state.errors.keperluan) + " resize-none"}
          placeholder="Contoh: Praktikum Pemrograman Web kelas XI RPL"
        />
        {state.errors.keperluan ? (
          <p className="mt-1 text-xs text-red-600">{state.errors.keperluan}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-400">5–120 karakter.</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm mt-2"
      >
        {isPending ? "Memproses…" : "Ajukan Peminjaman"}
      </button>
    </form>
  );
}
