"use client";

// Form tambah ruang baru – Client Component.

import { useActionState } from "react";
import { tambahRuang, ruangInitialState } from "./actions";

export default function FormTambahRuang() {
  const [state, formAction, isPending] = useActionState(
    tambahRuang,
    ruangInitialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.errors.umum && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-700">
          ⚠️ {state.errors.umum}
        </div>
      )}
      {state.sukses && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-700">
          ✅ {state.sukses}
        </div>
      )}

      {/* Nama */}
      <div>
        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
          Nama Ruang <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nama"
          name="nama"
          defaultValue={state.values.nama}
          maxLength={40}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.nama ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Contoh: Lab Komputer 3"
        />
        {state.errors.nama && (
          <p className="mt-1 text-xs text-red-600">{state.errors.nama}</p>
        )}
      </div>

      {/* Jenis */}
      <div>
        <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">
          Jenis Ruang <span className="text-red-500">*</span>
        </label>
        <select
          id="jenis"
          name="jenis"
          defaultValue={state.values.jenis}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.jenis ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">-- Pilih Jenis --</option>
          <option value="lab">Laboratorium</option>
          <option value="kelas">Kelas</option>
          <option value="aula">Aula</option>
        </select>
        {state.errors.jenis && (
          <p className="mt-1 text-xs text-red-600">{state.errors.jenis}</p>
        )}
      </div>

      {/* Kapasitas */}
      <div>
        <label htmlFor="kapasitas" className="block text-sm font-medium text-gray-700 mb-1">
          Kapasitas (orang) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="kapasitas"
          name="kapasitas"
          min="1"
          defaultValue={state.values.kapasitas}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.kapasitas ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Contoh: 30"
        />
        {state.errors.kapasitas && (
          <p className="mt-1 text-xs text-red-600">{state.errors.kapasitas}</p>
        )}
      </div>

      {/* Lokasi */}
      <div>
        <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
          Lokasi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lokasi"
          name="lokasi"
          defaultValue={state.values.lokasi}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state.errors.lokasi ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Contoh: Gedung A Lantai 2"
        />
        {state.errors.lokasi && (
          <p className="mt-1 text-xs text-red-600">{state.errors.lokasi}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-60 transition-colors"
      >
        {isPending ? "Menyimpan..." : "Tambah Ruang"}
      </button>
    </form>
  );
}
