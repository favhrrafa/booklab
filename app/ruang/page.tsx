// Halaman /ruang – Daftar Ruang Aktif dengan filter ?jenis=
// Server Component: data dibaca server-side

import Link from "next/link";
import { getRuangAktif } from "@/lib/dummy-data";
import { JenisRuang } from "@/lib/types";
import BadgeJenis from "@/components/BadgeJenis";

// Daftar nilai jenis yang diizinkan
const JENIS_VALID: JenisRuang[] = ["lab", "kelas", "aula"];

interface PageProps {
  searchParams: Promise<{ jenis?: string }>;
}

export default async function DaftarRuangPage({ searchParams }: PageProps) {
  const { jenis: jenisParam } = await searchParams;

  // Hanya terima nilai yang valid; jika tidak valid, abaikan filter
  const jenisFilter = JENIS_VALID.includes(jenisParam as JenisRuang)
    ? (jenisParam as JenisRuang)
    : null;

  const semuaRuang = getRuangAktif();
  const ruangTampil = jenisFilter
    ? semuaRuang.filter((r) => r.jenis === jenisFilter)
    : semuaRuang;

  const labelJenis: Record<JenisRuang, string> = {
    lab: "Laboratorium",
    kelas: "Kelas",
    aula: "Aula",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Daftar Ruang Tersedia</h1>

      {/* Filter Jenis */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/ruang"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !jenisFilter
              ? "bg-blue-700 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Semua
        </Link>
        {JENIS_VALID.map((j) => (
          <Link
            key={j}
            href={`/ruang?jenis=${j}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              jenisFilter === j
                ? "bg-blue-700 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelJenis[j]}
          </Link>
        ))}
      </div>

      {/* Hasil */}
      {ruangTampil.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Tidak ada ruang yang tersedia</p>
          {jenisFilter && (
            <p className="text-sm mt-2">
              untuk jenis <strong>{labelJenis[jenisFilter]}</strong>.{" "}
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
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {ruang.nama}
                </h2>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <p className="text-sm text-gray-500 mb-1">📍 {ruang.lokasi}</p>
              <p className="text-sm text-gray-500 mb-3">👥 Kapasitas: {ruang.kapasitas} orang</p>
              <span className="text-xs text-blue-600 font-medium group-hover:underline">
                Lihat detail & jadwal →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
