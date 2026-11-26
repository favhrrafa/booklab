// Halaman /ruang – Daftar Ruang Aktif dengan filter ?jenis=
// Server Component

import Link from "next/link";
import { getRuangAktif } from "@/lib/db";
import { JenisRuang } from "@/lib/types";
import BadgeJenis from "@/components/BadgeJenis";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { kartu, chipFilter } from "@/lib/ui";

const JENIS_VALID: JenisRuang[] = ["lab", "kelas", "aula"];

const labelJenis: Record<JenisRuang, string> = {
  lab: "Laboratorium",
  kelas: "Kelas",
  aula: "Aula",
};

interface PageProps {
  searchParams: Promise<{ jenis?: string }>;
}

export default async function DaftarRuangPage({ searchParams }: PageProps) {
  const { jenis: jenisParam } = await searchParams;

  const jenisFilter = JENIS_VALID.includes(jenisParam as JenisRuang)
    ? (jenisParam as JenisRuang)
    : null;

  const semuaRuang = await getRuangAktif();
  const ruangTampil = jenisFilter
    ? semuaRuang.filter((r) => r.jenis === jenisFilter)
    : semuaRuang;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Daftar Ruang
        </h1>
        <p className="text-sm text-slate-500">
          Ruang yang tersedia untuk dipinjam. Klik ruang untuk melihat jadwal
          dan mengajukan peminjaman.
        </p>
      </div>

      {/* Filter Jenis */}
      <div className="flex flex-wrap gap-2 mb-7">
        <Link href="/ruang" className={chipFilter(!jenisFilter)}>
          Semua
        </Link>
        {JENIS_VALID.map((j) => (
          <Link
            key={j}
            href={`/ruang?jenis=${j}`}
            className={chipFilter(jenisFilter === j)}
          >
            {labelJenis[j]}
          </Link>
        ))}
      </div>

      {/* Hasil */}
      {ruangTampil.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-base mb-2">Tidak ada ruang</p>
          {jenisFilter && (
            <p className="text-sm text-slate-400">
              untuk jenis{" "}
              <span className="font-medium text-slate-600">
                {labelJenis[jenisFilter]}
              </span>
              .{" "}
              <Link href="/ruang" className="text-teal-600 hover:underline">
                Lihat semua ruang
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruangTampil.map((ruang) => (
            <Link
              key={ruang.id}
              href={`/ruang/${ruang.id}`}
              className={`group ${kartu} p-5 hover:border-teal-300 hover:shadow-[0_4px_12px_rgba(13,148,136,0.1)] transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors leading-snug">
                  {ruang.nama}
                </h2>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin size={11} className="text-slate-400 flex-shrink-0" aria-hidden />
                  {ruang.lokasi}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Users size={11} className="text-slate-400 flex-shrink-0" aria-hidden />
                  Kapasitas {ruang.kapasitas} orang
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 group-hover:underline">
                Lihat detail &amp; jadwal
                <ArrowRight size={11} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
