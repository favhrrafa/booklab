"use client";

// Wrapper client untuk daftar permohonan dengan fitur "Muat lebih banyak"

import { useState } from "react";
import BadgeStatus from "@/components/BadgeStatus";
import { TombolSetujui, TombolTolak } from "./TombolAksi";
import {
  CalendarDays,
  Clock,
  Users,
  User,
  FileText,
  Hash,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

import type { StatusPeminjaman } from "@/lib/types";

const BATAS_AWAL = 5;

function formatTanggal(tgl: string): string {
  return new Date(tgl + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatWaktu(dibuat: string): string {
  return new Date(dibuat).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Peminjaman {
  id: number;
  nama_ruang: string;
  status: StatusPeminjaman;
  dibuat: string;
  peminjam: string;
  tanggal: string;
  mulai: string;
  selesai: string;
  jumlah_orang: number;
  keperluan: string;
  alasan_tolak?: string | null;
}

interface Props {
  daftar: Peminjaman[];
  labelFilter: string;
}

export default function DaftarPermohonan({ daftar, labelFilter }: Props) {
  const [tampilSemua, setTampilSemua] = useState(false);

  const tampil = tampilSemua ? daftar : daftar.slice(0, BATAS_AWAL);
  const sisa = daftar.length - BATAS_AWAL;

  if (daftar.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] py-20 text-center">
        <ClipboardList size={36} className="mx-auto mb-3 text-slate-200" aria-hidden />
        <p className="text-slate-400 text-sm">
          Tidak ada permohonan dengan status &quot;{labelFilter}&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tampil.map((p) => (
        <div
          key={p.id}
          className="group bg-white border border-slate-200 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 transition-all duration-200 hover:border-teal-200 hover:shadow-[0_4px_16px_rgba(13,148,136,0.09)] hover:-translate-y-0.5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
                <Hash size={10} aria-hidden />
                {p.id}
              </span>
              <BadgeStatus status={p.status} />
              <span className="font-semibold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                {p.nama_ruang}
              </span>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">
              {formatWaktu(p.dibuat)}
            </span>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-sm mb-4">
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <User size={10} aria-hidden />
                Peminjam
              </dt>
              <dd className="font-medium text-slate-800">{p.peminjam}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <CalendarDays size={10} aria-hidden />
                Tanggal
              </dt>
              <dd className="font-medium text-slate-800">
                {formatTanggal(p.tanggal)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <Clock size={10} aria-hidden />
                Jam
              </dt>
              <dd className="font-medium text-slate-800 font-mono">
                {p.mulai}–{p.selesai}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <Users size={10} aria-hidden />
                Jumlah
              </dt>
              <dd className="font-medium text-slate-800">{p.jumlah_orang} orang</dd>
            </div>
          </dl>

          <div className="bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm text-slate-600 mb-3 flex items-start gap-2">
            <FileText
              size={13}
              className="text-slate-400 mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mr-1.5">
                Keperluan:
              </span>
              {p.keperluan}
            </span>
          </div>

          {p.alasan_tolak && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-sm text-red-700 mb-3">
              <span className="text-xs text-red-400 font-medium uppercase tracking-wide">
                Alasan Tolak:{" "}
              </span>
              {p.alasan_tolak}
            </div>
          )}

          {p.status === "menunggu" && (
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
              <TombolSetujui peminjamanId={p.id} />
              <TombolTolak peminjamanId={p.id} />
            </div>
          )}
        </div>
      ))}

      {/* Tombol muat lebih banyak */}
      {!tampilSemua && sisa > 0 && (
        <button
          onClick={() => setTampilSemua(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-200 text-sm text-slate-500 font-medium hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/40 transition-all duration-200"
        >
          <ChevronDown size={15} aria-hidden />
          Muat {sisa} permohonan lainnya
        </button>
      )}
    </div>
  );
}
