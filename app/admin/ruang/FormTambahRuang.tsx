"use client";

import { useActionState } from "react";
import { tambahRuang } from "./actions";
import type { RuangFormState } from "@/lib/types";
import { TriangleAlert, CheckCircle2 } from "lucide-react";
import { kelasInput, labelField, pesanError, alert, tombol } from "@/lib/ui";

// Definisi lokal — tidak diimpor dari "use server" agar tersedia sebelum hydration
const INITIAL: RuangFormState = {
  errors: {},
  values: { nama: "", jenis: "", kapasitas: "", lokasi: "" },
};

export default function FormTambahRuang() {
  const [state, formAction, isPending] = useActionState(tambahRuang, INITIAL);

  const errors = state?.errors ?? {};
  const values = state?.values ?? INITIAL.values;

  return (
    <form action={formAction} className="space-y-4">
      {errors.umum && (
        <div className={alert.error}>
          <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>{errors.umum}</span>
        </div>
      )}
      {state?.sukses && (
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
            defaultValue={values.nama}
            maxLength={40}
            className={kelasInput(!!errors.nama) + " border"}
            placeholder="Contoh: Lab Komputer 3"
          />
          {errors.nama && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {errors.nama}
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
            defaultValue={values.jenis}
            className={kelasInput(!!errors.jenis) + " border bg-white"}
          >
            <option value="">Pilih jenis…</option>
            <option value="lab">Laboratorium</option>
            <option value="kelas">Kelas</option>
            <option value="aula">Aula</option>
          </select>
          {errors.jenis && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {errors.jenis}
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
            defaultValue={values.kapasitas}
            className={kelasInput(!!errors.kapasitas) + " border"}
            placeholder="Contoh: 30"
          />
          {errors.kapasitas && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {errors.kapasitas}
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
            defaultValue={values.lokasi}
            className={kelasInput(!!errors.lokasi) + " border"}
            placeholder="Contoh: Gedung A Lantai 2"
          />
          {errors.lokasi && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {errors.lokasi}
            </p>
          )}
        </div>
      </div>

      <button type="submit" disabled={isPending} className={tombol.utama}>
        {isPending ? "Menyimpan…" : "Tambah Ruang"}
      </button>
    </form>
  );
}
