// Halaman /ruang – Daftar Ruang Aktif dengan filter ?jenis=
// Server Component

import Link from "next/link";
import { getRuangAktif } from "@/lib/dummy-data";
import { JenisRuang } from "@/lib/types";
import BadgeJenis from "@/components/BadgeJenis";

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

  const semuaRuang = getRuangAktif();
  const ruangTampil = jenisFilter
    ? semuaRuang.filter((r) => r.jenis === jenisFilter)
    : semuaRuang;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Daftar Ruang
        </h1>
        <p className="text-sm text-slate-500">
          Ruang yang tersedia untuk dipinjam. Klik ruang untuk melihat jadwal
          dan mengajukan peminjaman.
        </p>
      </div>

      {/* Filter Jenis */}
      <div className="flex flex-wrap gap-2 mb-7">
        <Link
          href="/ruang"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !jenisFilter
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
          }`}
        >
          Semua
        </Link>
        {JENIS_VALID.map((j) => (
          <Link
            key={j}
            href={`/ruang?jenis=${j}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              jenisFilter === j
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
            }`}
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
              <Link href="/ruang" className="text-blue-600 hover:underline">
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
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                  {ruang.nama}
                </h2>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">📍</span>
                  {ruang.lokasi}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">👥</span>
                  Kapasitas {ruang.kapasitas} orang
                </p>
              </div>
              <span className="text-xs font-medium text-blue-600 group-hover:underline">
                Lihat detail &amp; jadwal →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
