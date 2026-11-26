"use client";

// Form tambah ruang baru

import { useActionState } from "react";
import { tambahRuang, ruangInitialState } from "./actions";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import { kelasInput, labelField, pesanError, alert, tombol } from "@/lib/ui";

export default function FormTambahRuang() {
  const [state, formAction, isPending] = useActionState(
    tambahRuang,
    ruangInitialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.errors.umum && (
        <div className={alert.error}>
          <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>{state.errors.umum}</span>
        </div>
      )}
      {state.sukses && (
        <div className={alert.sukses}>
          <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>{state.sukses}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="nama" className={labelField}>
            Nama Ruang <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            defaultValue={state.values.nama}
            maxLength={40}
            className={kelasInput(!!state.errors.nama) + " border"}
            placeholder="Contoh: Lab Komputer 3"
          />
          {state.errors.nama && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.nama}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="jenis" className={labelField}>
            Jenis <span className="text-red-500">*</span>
          </label>
          <select
            id="jenis"
            name="jenis"
            defaultValue={state.values.jenis}
            className={kelasInput(!!state.errors.jenis) + " border bg-white"}
          >
            <option value="">Pilih jenis…</option>
            <option value="lab">Laboratorium</option>
            <option value="kelas">Kelas</option>
            <option value="aula">Aula</option>
          </select>
          {state.errors.jenis && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.jenis}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="kapasitas" className={labelField}>
            Kapasitas (orang) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="kapasitas"
            name="kapasitas"
            min="1"
            defaultValue={state.values.kapasitas}
            className={kelasInput(!!state.errors.kapasitas) + " border"}
            placeholder="Contoh: 30"
          />
          {state.errors.kapasitas && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.kapasitas}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="lokasi" className={labelField}>
            Lokasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lokasi"
            name="lokasi"
            defaultValue={state.values.lokasi}
            className={kelasInput(!!state.errors.lokasi) + " border"}
            placeholder="Contoh: Gedung A Lantai 2"
          />
          {state.errors.lokasi && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.lokasi}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={tombol.utama}
      >
        {isPending ? "Menyimpan…" : "Tambah Ruang"}
      </button>
    </form>
  );
}
