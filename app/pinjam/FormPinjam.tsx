"use client";

// Form pengajuan peminjaman – Client Component (karena pakai useActionState).
// Semua validasi sesungguhnya ada di Server Action; form hanya menampilkan error.

import { useActionState } from "react";
import { ajukanPeminjaman, initialState } from "./actions";
import { Ruang } from "@/lib/types";
import Link from "next/link";

interface FormPinjamProps {
  ruangList: Ruang[];
  ruangIdAwal?: string; // dari query param ?ruang_id=
}

export default function FormPinjam({ ruangList, ruangIdAwal }: FormPinjamProps) {
  const [state, formAction, isPending] = useActionState(ajukanPeminjaman, {
    ...initialState,
    values: {
      ...initialState.values,
      ruang_id: ruangIdAwal ?? "",
    },
  });

  // Jika berhasil, state.sukses berisi id pengajuan
  if (state.sukses) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-green-800 mb-2">
          Pengajuan Berhasil Dikirim!
        </h2>
        <p className="text-gray-700 mb-1">Nomor ID Pengajuan Anda:</p>
        <p className="text-4xl font-bold text-green-700 mb-4">
          #{state.sukses.id}
        </p>
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-5 text-sm text-yellow-800">
          ⚠️ <strong>Simpan nomor ID ini!</strong> Anda membutuhkannya untuk
          mengecek status persetujuan.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/cek`}
            className="bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors text-sm"
          >
            Cek Status Pengajuan
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
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
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-sm text-red-700">
          ⚠️ {state.errors.umum}
        </div>
      )}

      {/* Pilih Ruang */}
      <div>
        <label htmlFor="ruang_id" className="block text-sm font-medium text-gray-700 mb-1">
          Ruang yang Dipinjam <span className="text-red-500">*</span>
        </label>
        <select
          id="ruang_id"
          name="ruang_id"
          defaultValue={state.values.ruang_id}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.ruang_id ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">-- Pilih Ruang --</option>
          {ruangList.map((r) => (
            <option key={r.id} value={String(r.id)}>
              {r.nama} ({r.jenis} · {r.lokasi} · maks. {r.kapasitas} orang)
            </option>
          ))}
        </select>
        {state.errors.ruang_id && (
          <p className="mt-1 text-xs text-red-600">{state.errors.ruang_id}</p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Peminjaman <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          defaultValue={state.values.tanggal}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.tanggal ? "border-red-400" : "border-gray-300"
          }`}
        />
        {state.errors.tanggal && (
          <p className="mt-1 text-xs text-red-600">{state.errors.tanggal}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          Senin–Jumat, maksimal 60 hari ke depan.
        </p>
      </div>

      {/* Jam Mulai & Selesai */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mulai" className="block text-sm font-medium text-gray-700 mb-1">
            Jam Mulai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="mulai"
            name="mulai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.mulai}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors.mulai ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors.mulai && (
            <p className="mt-1 text-xs text-red-600">{state.errors.mulai}</p>
          )}
        </div>
        <div>
          <label htmlFor="selesai" className="block text-sm font-medium text-gray-700 mb-1">
            Jam Selesai <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="selesai"
            name="selesai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.selesai}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors.selesai ? "border-red-400" : "border-gray-300"
            }`}
          />
          {state.errors.selesai && (
            <p className="mt-1 text-xs text-red-600">{state.errors.selesai}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 -mt-3">
        Jam operasional: 07:00–17:00. Durasi maksimal 3 jam.
      </p>

      {/* Jumlah Orang */}
      <div>
        <label htmlFor="jumlah_orang" className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah Orang <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="jumlah_orang"
          name="jumlah_orang"
          min="1"
          defaultValue={state.values.jumlah_orang}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.jumlah_orang ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Contoh: 25"
        />
        {state.errors.jumlah_orang && (
          <p className="mt-1 text-xs text-red-600">{state.errors.jumlah_orang}</p>
        )}
      </div>

      {/* Nama Peminjam */}
      <div>
        <label htmlFor="peminjam" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Peminjam <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="peminjam"
          name="peminjam"
          defaultValue={state.values.peminjam}
          maxLength={40}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.peminjam ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Nama lengkap Anda"
        />
        {state.errors.peminjam && (
          <p className="mt-1 text-xs text-red-600">{state.errors.peminjam}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">3–40 karakter.</p>
      </div>

      {/* Keperluan */}
      <div>
        <label htmlFor="keperluan" className="block text-sm font-medium text-gray-700 mb-1">
          Keperluan / Tujuan Peminjaman <span className="text-red-500">*</span>
        </label>
        <textarea
          id="keperluan"
          name="keperluan"
          rows={3}
          maxLength={120}
          defaultValue={state.values.keperluan}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            state.errors.keperluan ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Contoh: Praktikum Pemrograman Web kelas XI RPL"
        />
        {state.errors.keperluan && (
          <p className="mt-1 text-xs text-red-600">{state.errors.keperluan}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">5–120 karakter.</p>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Memproses..." : "Ajukan Peminjaman"}
      </button>
    </form>
  );
}
