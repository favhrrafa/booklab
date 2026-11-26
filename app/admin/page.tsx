// Halaman /admin – dashboard permohonan, filter via ?status=

import { getPeminjamanByStatus, getRuangById } from "@/lib/dummy-data";
import BadgeStatus from "@/components/BadgeStatus";
import { TombolSetujui, TombolTolak } from "./TombolAksi";
import Link from "next/link";
import { DoorOpen, CalendarDays, Clock, Users, User, FileText, Hash } from "lucide-react";
import { chipFilter } from "@/lib/ui";

const STATUS_VALID = ["semua", "menunggu", "disetujui", "ditolak"] as const;
type FilterStatus = (typeof STATUS_VALID)[number];

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

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams;

  const filter: FilterStatus = STATUS_VALID.includes(
    statusParam as FilterStatus
  )
    ? (statusParam as FilterStatus)
    : "semua";

  const daftarPeminjaman = getPeminjamanByStatus(filter);

  const labelFilter: Record<FilterStatus, string> = {
    semua: "Semua",
    menunggu: "Menunggu",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard Permohonan
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {daftarPeminjaman.length} permohonan
            {filter !== "semua" ? ` · ${labelFilter[filter]}` : ""}
          </p>
        </div>
        <Link
          href="/admin/ruang"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
        >
          <DoorOpen size={15} aria-hidden />
          Kelola Ruang
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_VALID.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${s}`}
            className={chipFilter(filter === s)}
          >
            {labelFilter[s]}
          </Link>
        ))}
      </div>

      {daftarPeminjaman.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] py-20 text-center">
          <p className="text-slate-400">
            Tidak ada permohonan dengan status &quot;{labelFilter[filter]}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {daftarPeminjaman.map((p) => {
            const ruang = getRuangById(p.ruang_id);
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
                      <Hash size={10} aria-hidden />
                      {p.id}
                    </span>
                    <BadgeStatus status={p.status} />
                    <span className="font-semibold text-slate-800 text-sm">
                      {ruang?.nama ?? `Ruang #${p.ruang_id}`}
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
                    <dd className="font-medium text-slate-800">
                      {p.jumlah_orang} orang
                    </dd>
                  </div>
                </dl>

                <div className="bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm text-slate-600 mb-3 flex items-start gap-2">
                  <FileText size={13} className="text-slate-400 mt-0.5 flex-shrink-0" aria-hidden />
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
            );
          })}
        </div>
      )}
    </div>
  );
}
