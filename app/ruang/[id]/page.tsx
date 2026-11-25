// Halaman /ruang/[id] – Detail Ruang + Jadwal yang Disetujui
// Server Component: data dibaca server-side.
// Privasi: hanya menampilkan ruang_id, tanggal, mulai, selesai – TIDAK ada nama peminjam.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getRuangById, getPeminjamanDisetujuiByRuang } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";

// Format tanggal ke bahasa Indonesia
function formatTanggal(tgl: string): string {
  const d = new Date(tgl + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailRuangPage({ params }: PageProps) {
  const { id: idStr } = await params;

  // id harus berupa angka positif
  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) {
    notFound();
  }

  const ruang = getRuangById(id);
  if (!ruang) {
    notFound();
  }

  // Jadwal yang sudah disetujui – hanya kolom non-pribadi
  const jadwal = getPeminjamanDisetujuiByRuang(ruang.id);

  // Filter: tampilkan hanya jadwal hari ini ke depan agar lebih relevan
  const hariIni = new Date().toISOString().slice(0, 10);
  const jadwalMendatang = jadwal.filter((j) => j.tanggal >= hariIni);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/ruang" className="hover:underline text-blue-600">
          Daftar Ruang
        </Link>{" "}
        / <span className="text-gray-700">{ruang.nama}</span>
      </nav>

      {/* Info Ruang */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{ruang.nama}</h1>
          <div className="flex items-center gap-2">
            <BadgeJenis jenis={ruang.jenis} />
            {!ruang.aktif && (
              <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-300">
                Nonaktif
              </span>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Lokasi</dt>
            <dd className="font-medium text-gray-800">📍 {ruang.lokasi}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Kapasitas</dt>
            <dd className="font-medium text-gray-800">👥 {ruang.kapasitas} orang</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className={`font-medium ${ruang.aktif ? "text-green-700" : "text-gray-600"}`}>
              {ruang.aktif ? "✅ Aktif – dapat dipinjam" : "🚫 Nonaktif – tidak dapat dipinjam"}
            </dd>
          </div>
        </dl>

        {ruang.aktif && (
          <div className="mt-4">
            <Link
              href={`/pinjam?ruang_id=${ruang.id}`}
              className="inline-block bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              Ajukan Peminjaman Ruang Ini
            </Link>
          </div>
        )}
      </div>

      {/* Jadwal Disetujui (tanpa data pribadi) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Jadwal Peminjaman Disetujui
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Hanya menampilkan jadwal yang sudah disetujui. Nama peminjam tidak
          ditampilkan untuk menjaga privasi.
        </p>

        {jadwalMendatang.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            Belum ada jadwal peminjaman yang disetujui.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Tanggal</th>
                  <th className="pb-2 pr-4 font-medium">Mulai</th>
                  <th className="pb-2 font-medium">Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jadwalMendatang.map((j) => (
                  <tr key={j.id} className="text-gray-700">
                    <td className="py-2 pr-4">{formatTanggal(j.tanggal)}</td>
                    <td className="py-2 pr-4 font-mono">{j.mulai}</td>
                    <td className="py-2 font-mono">{j.selesai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
