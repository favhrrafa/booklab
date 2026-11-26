// Halaman /ruang/[id] – detail ruang dan jadwal disetujui
// Privasi: tidak menampilkan nama peminjam

import { notFound } from "next/navigation";
import Link from "next/link";
import { getRuangById, getPeminjamanDisetujuiByRuang } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";
import {
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Clock,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import { kartu } from "@/lib/ui";

function formatTanggal(tgl: string): string {
  return new Date(tgl + "T00:00:00").toLocaleDateString("id-ID", {
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
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/ruang" className="hover:text-teal-600 transition-colors">
          Daftar Ruang
        </Link>
        <ChevronRight size={14} className="text-slate-300" aria-hidden />
        <span className="text-slate-700 font-medium">{ruang.nama}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ─── Kartu info ruang ─── */}
        <div className="md:col-span-1 space-y-4">
          <div className={`${kartu} p-6`}>
            <div className="flex items-center gap-2 mb-1">
              <BadgeJenis jenis={ruang.jenis} />
              {!ruang.aktif && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                  <XCircle size={10} aria-hidden />
                  Nonaktif
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-3 mb-5 tracking-tight">
              {ruang.nama}
            </h1>

            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-slate-400 mt-0.5 flex-shrink-0" aria-hidden />
                <div>
                  <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                    Lokasi
                  </dt>
                  <dd className="text-slate-700 font-medium mt-0.5">
                    {ruang.lokasi}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={15} className="text-slate-400 mt-0.5 flex-shrink-0" aria-hidden />
                <div>
                  <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                    Kapasitas
                  </dt>
                  <dd className="text-slate-700 font-medium mt-0.5">
                    {ruang.kapasitas} orang
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {ruang.aktif ? (
                  <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden />
                ) : (
                  <XCircle size={15} className="text-slate-400 mt-0.5 flex-shrink-0" aria-hidden />
                )}
                <div>
                  <dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                    Status
                  </dt>
                  <dd
                    className={`font-medium mt-0.5 text-sm ${ruang.aktif ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    {ruang.aktif ? "Aktif" : "Nonaktif"}
                  </dd>
                </div>
              </div>
            </dl>

            {ruang.aktif ? (
              <Link
                href={`/pinjam?ruang_id=${ruang.id}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-teal-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors text-sm"
              >
                <CalendarPlus size={15} aria-hidden />
                Ajukan Peminjaman
              </Link>
            ) : (
              <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Ruang ini sedang nonaktif dan tidak dapat dipinjam.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Jadwal disetujui ─── */}
        <div className="md:col-span-2">
          <div className={`${kartu} p-6`}>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-teal-600" aria-hidden />
              <h2 className="text-base font-semibold text-slate-800">
                Jadwal Peminjaman Disetujui
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Nama peminjam tidak ditampilkan untuk menjaga privasi.
            </p>

            {jadwalMendatang.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CalendarDays size={36} className="mx-auto mb-3 opacity-30" aria-hidden />
                <p className="text-sm">
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
                        <span className="inline-flex items-center gap-1">
                          <Clock size={11} aria-hidden />
                          Mulai
                        </span>
                      </th>
                      <th className="pb-3 text-left text-xs text-slate-400 font-medium uppercase tracking-wide">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={11} aria-hidden />
                          Selesai
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {jadwalMendatang.map((j) => (
                      <tr
                        key={j.id}
                        className="hover:bg-teal-50/40 transition-colors"
                      >
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
