// Halaman /peminjaman – Jadwal Publik Semua Ruang (hanya yang disetujui)
// Server Component. Privasi: TIDAK menampilkan nama peminjam atau keperluan.

import { getPeminjamanDisetujui, getRuangById } from "@/lib/dummy-data";
import { CalendarDays, DoorOpen, Clock } from "lucide-react";
import { kartu } from "@/lib/ui";

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
  const hariIni = new Date().toISOString().slice(0, 10);
  const jadwalMendatang = jadwal.filter((j) => j.tanggal >= hariIni);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Jadwal Peminjaman
        </h1>
        <p className="text-sm text-slate-500">
          Jadwal yang sudah{" "}
          <span className="font-medium text-emerald-600">disetujui</span>{" "}
          admin. Nama peminjam tidak ditampilkan untuk menjaga privasi.
        </p>
      </div>

      {jadwalMendatang.length === 0 ? (
        <div className={`${kartu} py-20 text-center`}>
          <CalendarDays size={40} className="mx-auto mb-3 text-slate-300" aria-hidden />
          <p className="text-slate-400">
            Belum ada jadwal peminjaman yang disetujui.
          </p>
        </div>
      ) : (
        <div className={`${kartu} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={11} aria-hidden />
                      Tanggal
                    </span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      <DoorOpen size={11} aria-hidden />
                      Ruang
                    </span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} aria-hidden />
                      Mulai
                    </span>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} aria-hidden />
                      Selesai
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jadwalMendatang.map((j) => {
                  const ruang = getRuangById(j.ruang_id);
                  return (
                    <tr
                      key={j.id}
                      className="hover:bg-teal-50/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-slate-600">
                        {formatTanggal(j.tanggal)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {ruang?.nama ?? `Ruang #${j.ruang_id}`}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {j.mulai}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {j.selesai}
                      </td>
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
