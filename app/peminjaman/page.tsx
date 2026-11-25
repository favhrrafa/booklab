// Halaman /peminjaman – Jadwal Publik Semua Ruang (hanya yang disetujui)
// Server Component.
// Privasi: TIDAK menampilkan nama peminjam atau keperluan.
// Catatan: dynamic = "force-dynamic" tidak kompatibel dengan cacheComponents (Next.js 16).
// Data dummy di-render server-side setiap request; saat migrasi ke Supabase,
// gunakan cache opt-out melalui konfigurasi fetch atau revalidate.

import { getPeminjamanDisetujui, getRuangById } from "@/lib/dummy-data";

function formatTanggal(tgl: string): string {
  const d = new Date(tgl + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JadwalPublikPage() {
  const jadwal = getPeminjamanDisetujui();

  // Filter hanya jadwal hari ini ke depan
  const hariIni = new Date().toISOString().slice(0, 10);
  const jadwalMendatang = jadwal.filter((j) => j.tanggal >= hariIni);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Jadwal Peminjaman</h1>
      <p className="text-sm text-gray-500 mb-6">
        Menampilkan seluruh jadwal yang sudah <strong>disetujui</strong> admin.
        Nama peminjam tidak ditampilkan untuk menjaga privasi.
      </p>

      {jadwalMendatang.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Belum ada jadwal peminjaman yang disetujui.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ruang</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Jam Mulai</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Jam Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jadwalMendatang.map((j) => {
                  const ruang = getRuangById(j.ruang_id);
                  return (
                    <tr key={j.id} className="hover:bg-gray-50 text-gray-700">
                      <td className="px-4 py-3">{formatTanggal(j.tanggal)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {ruang?.nama ?? `Ruang #${j.ruang_id}`}
                      </td>
                      <td className="px-4 py-3 font-mono">{j.mulai}</td>
                      <td className="px-4 py-3 font-mono">{j.selesai}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
