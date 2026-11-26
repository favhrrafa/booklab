"use client";

// Form pengajuan peminjaman – validasi sesungguhnya ada di Server Action

import { useActionState } from "react";
import { ajukanPeminjaman, initialState } from "./actions";
import { Ruang } from "@/lib/types";
import Link from "next/link";
import {
  CheckCircle2,
  TriangleAlert,
  CalendarDays,
  Clock,
  Users,
  User,
  FileText,
  DoorOpen,
  Search,
  Home,
} from "lucide-react";
import { kelasInput, labelField, pesanError, petunjukField, alert, tombol } from "@/lib/ui";

interface FormPinjamProps {
  ruangList: Ruang[];
  ruangIdAwal?: string;
}

export default function FormPinjam({ ruangList, ruangIdAwal }: FormPinjamProps) {
  const [state, formAction, isPending] = useActionState(ajukanPeminjaman, {
    ...initialState,
    values: { ...initialState.values, ruang_id: ruangIdAwal ?? "" },
  });

  if (state.sukses) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" aria-hidden />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Pengajuan Berhasil!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Simpan nomor ID berikut untuk mengecek status persetujuan.
        </p>
        <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6 mb-6 inline-block min-w-[160px]">
          <p className="text-xs text-teal-500 uppercase tracking-wide font-medium mb-1">
            Nomor ID Pengajuan
          </p>
          <p className="text-4xl font-bold text-teal-700">
            #{state.sukses.id}
          </p>
        </div>
        <div className={`${alert.peringatan} mb-6 text-left`}>
          <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>
            <strong>Simpan nomor ini!</strong> Anda membutuhkannya untuk
            mengecek status.
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/cek" className={tombol.utama}>
            <Search size={15} aria-hidden />
            Cek Status Pengajuan
          </Link>
          <Link href="/" className={tombol.sekunder}>
            <Home size={15} aria-hidden />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.errors.umum && (
        <div className={alert.error}>
          <TriangleAlert size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
          <span>{state.errors.umum}</span>
        </div>
      )}

      {/* Ruang */}
      <div>
        <label htmlFor="ruang_id" className={labelField}>
          <span className="inline-flex items-center gap-1.5">
            <DoorOpen size={13} className="text-slate-400" aria-hidden />
            Ruang <span className="text-red-500">*</span>
          </span>
        </label>
        <select
          id="ruang_id"
          name="ruang_id"
          defaultValue={state.values.ruang_id}
          className={kelasInput(!!state.errors.ruang_id) + " border"}
        >
          <option value="">Pilih ruang…</option>
          {ruangList.map((r) => (
            <option key={r.id} value={String(r.id)}>
              {r.nama} — {r.lokasi} (maks. {r.kapasitas} orang)
            </option>
          ))}
        </select>
        {state.errors.ruang_id && (
          <p className={pesanError}>
            <TriangleAlert size={11} aria-hidden />
            {state.errors.ruang_id}
          </p>
        )}
      </div>

      {/* Tanggal */}
      <div>
        <label htmlFor="tanggal" className={labelField}>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} className="text-slate-400" aria-hidden />
            Tanggal Peminjaman <span className="text-red-500">*</span>
          </span>
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          defaultValue={state.values.tanggal}
          className={kelasInput(!!state.errors.tanggal) + " border"}
        />
        {state.errors.tanggal ? (
          <p className={pesanError}>
            <TriangleAlert size={11} aria-hidden />
            {state.errors.tanggal}
          </p>
        ) : (
          <p className={petunjukField}>
            Senin–Jumat, maksimal 60 hari ke depan.
          </p>
        )}
      </div>

      {/* Jam mulai & selesai */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="mulai" className={labelField}>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" aria-hidden />
              Jam Mulai <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="time"
            id="mulai"
            name="mulai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.mulai}
            className={kelasInput(!!state.errors.mulai) + " border"}
          />
          {state.errors.mulai && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.mulai}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="selesai" className={labelField}>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" aria-hidden />
              Jam Selesai <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="time"
            id="selesai"
            name="selesai"
            min="07:00"
            max="17:00"
            defaultValue={state.values.selesai}
            className={kelasInput(!!state.errors.selesai) + " border"}
          />
          {state.errors.selesai && (
            <p className={pesanError}>
              <TriangleAlert size={11} aria-hidden />
              {state.errors.selesai}
            </p>
          )}
        </div>
      </div>
      {!state.errors.mulai && !state.errors.selesai && (
        <p className={petunjukField + " -mt-3"}>
          Jam operasional: 07:00–17:00. Durasi maksimal 3 jam.
        </p>
      )}

      {/* Jumlah orang */}
      <div>
        <label htmlFor="jumlah_orang" className={labelField}>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" aria-hidden />
            Jumlah Orang <span className="text-red-500">*</span>
          </span>
        </label>
        <input
          type="number"
          id="jumlah_orang"
          name="jumlah_orang"
          min="1"
          defaultValue={state.values.jumlah_orang}
          className={kelasInput(!!state.errors.jumlah_orang) + " border"}
          placeholder="Contoh: 25"
        />
        {state.errors.jumlah_orang && (
          <p className={pesanError}>
            <TriangleAlert size={11} aria-hidden />
            {state.errors.jumlah_orang}
          </p>
        )}
      </div>

      {/* Nama peminjam */}
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
          defaultValue={state.values.peminjam}
          maxLength={40}
          className={kelasInput(!!state.errors.peminjam) + " border"}
          placeholder="Nama lengkap Anda"
        />
        {state.errors.peminjam ? (
          <p className={pesanError}>
            <TriangleAlert size={11} aria-hidden />
            {state.errors.peminjam}
          </p>
        ) : (
          <p className={petunjukField}>3–40 karakter.</p>
        )}
      </div>

      {/* Keperluan */}
      <div>
        <label htmlFor="keperluan" className={labelField}>
          <span className="inline-flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400" aria-hidden />
            Keperluan / Tujuan <span className="text-red-500">*</span>
          </span>
        </label>
        <textarea
          id="keperluan"
          name="keperluan"
          rows={3}
          maxLength={120}
          defaultValue={state.values.keperluan}
          className={kelasInput(!!state.errors.keperluan) + " border resize-none"}
          placeholder="Contoh: Praktikum Pemrograman Web kelas XI RPL"
        />
        {state.errors.keperluan ? (
          <p className={pesanError}>
            <TriangleAlert size={11} aria-hidden />
            {state.errors.keperluan}
          </p>
        ) : (
          <p className={petunjukField}>5–120 karakter.</p>
        )}
      </div>

      <button type="submit" disabled={isPending} className={tombol.utama + " w-full mt-2"}>
        {isPending ? "Memproses…" : "Ajukan Peminjaman"}
      </button>
    </form>
  );
}
