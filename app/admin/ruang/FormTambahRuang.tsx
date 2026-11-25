"use client";

// Form tambah ruang baru – Client Component.

import { useActionState } from "react";
import { tambahRuang, ruangInitialState } from "./actions";

function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
    hasError
      ? "border-red-400 bg-red-50/40"
      : "border-slate-200 bg-white hover:border-slate-300"
  }`;
}

export default function FormTambahRuang() {
  const [state, formAction, isPending] = useActionState(
    tambahRuang,
    ruangInitialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.errors.umum && (
        <div className="flex gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3.5 text-sm text-red-700">
          <span>⚠️</span>
          <span>{state.errors.umum}</span>
        </div>
      )}
      {state.sukses && (
        <div className="flex gap-2.5 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-sm text-emerald-700">
          <span>✓</span>
          <span>{state.sukses}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama */}
        <div className="sm:col-span-2">
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Nama Ruang <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            defaultValue={state.values.nama}
            maxLength={40}
            className={inputClass(!!state.errors.nama)}
            placeholder="Contoh: Lab Komputer 3"
          />
          {state.errors.nama && (
            <p className="mt-1 text-xs text-red-600">{state.errors.nama}</p>
          )}
        </div>

        {/* Jenis */}
        <div>
          <label
            htmlFor="jenis"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Jenis <span className="text-red-500">*</span>
          </label>
          <select
            id="jenis"
            name="jenis"
            defaultValue={state.values.jenis}
            className={inputClass(!!state.errors.jenis) + " bg-white"}
          >
            <option value="">Pilih jenis…</option>
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
          <label
            htmlFor="kapasitas"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Kapasitas (orang) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="kapasitas"
            name="kapasitas"
            min="1"
            defaultValue={state.values.kapasitas}
            className={inputClass(!!state.errors.kapasitas)}
            placeholder="Contoh: 30"
          />
          {state.errors.kapasitas && (
            <p className="mt-1 text-xs text-red-600">{state.errors.kapasitas}</p>
          )}
        </div>

        {/* Lokasi */}
        <div className="sm:col-span-2">
          <label
            htmlFor="lokasi"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Lokasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lokasi"
            name="lokasi"
            defaultValue={state.values.lokasi}
            className={inputClass(!!state.errors.lokasi)}
            placeholder="Contoh: Gedung A Lantai 2"
          />
          {state.errors.lokasi && (
            <p className="mt-1 text-xs text-red-600">{state.errors.lokasi}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Menyimpan…" : "Tambah Ruang"}
      </button>
    </form>
  );
}
