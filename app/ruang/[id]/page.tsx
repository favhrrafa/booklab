// Halaman /ruang/[id] – Detail Ruang + Jadwal yang Disetujui
// Server Component. Privasi: tidak menampilkan nama peminjam.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getRuangById, getPeminjamanDisetujuiByRuang } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";

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

  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) notFound();

  const ruang = getRuangById(id);
  if (!ruang) notFound();

  const jadwal = getPeminjamanDisetujuiByRuang(ruang.id);
  const hariIni = new Date().toISOString().slice(0, 10);
  const jadwalMendatang = jadwal.filter((j) => j.tanggal >= hariIni);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href="/ruang" className="hover:text-blue-600 transition-colors">
          Daftar Ruang
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{ruang.nama}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Info Ruang (kiri/atas) ── */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <BadgeJenis jenis={ruang.jenis} />
              {!ruang.aktif && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                  Nonaktif
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2 mb-4">
              {ruang.nama}
            </h1>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Lokasi
                </dt>
                <dd className="text-slate-700 font-medium mt-0.5">
                  {ruang.lokasi}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Kapasitas
                </dt>
                <dd className="text-slate-700 font-medium mt-0.5">
                  {ruang.kapasitas} orang
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Status
                </dt>
                <dd className="mt-0.5">
                  {ruang.aktif ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Nonaktif
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            {ruang.aktif && (
              <Link
                href={`/pinjam?ruang_id=${ruang.id}`}
                className="mt-5 block w-full text-center bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ajukan Peminjaman
              </Link>
            )}

            {!ruang.aktif && (
              <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Ruang ini sedang nonaktif dan tidak dapat dipinjam saat ini.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Jadwal Disetujui (kanan/bawah) ── */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1">
              Jadwal Peminjaman Disetujui
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Nama peminjam tidak ditampilkan untuk menjaga privasi.
            </p>

            {jadwalMendatang.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm">
                  Belum ada jadwal yang disetujui untuk ruang ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide pr-4">
                        Tanggal
                      </th>
                      <th className="pb-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide pr-4">
                        Mulai
                      </th>
                      <th className="pb-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                        Selesai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {jadwalMendatang.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pr-4 text-slate-700">
                          {formatTanggal(j.tanggal)}
                        </td>
                        <td className="py-3 pr-4 font-mono text-slate-700">
                          {j.mulai}
                        </td>
                        <td className="py-3 font-mono text-slate-700">
                          {j.selesai}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
