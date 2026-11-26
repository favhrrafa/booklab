// Halaman /admin – Dashboard beranda admin

import {
  getStatistikAdmin,
  getAllPeminjamanDenganRuang,
} from "@/lib/db";
import Link from "next/link";
import {
  DoorOpen,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Hourglass,
  LayoutGrid,
} from "lucide-react";
import { chipFilter } from "@/lib/ui";
import DaftarPermohonan from "./DaftarPermohonan";

const STATUS_VALID = ["semua", "menunggu", "disetujui", "ditolak"] as const;
type FilterStatus = (typeof STATUS_VALID)[number];

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const { status: statusParam } = await searchParams;

  const filter: FilterStatus = STATUS_VALID.includes(statusParam as FilterStatus)
    ? (statusParam as FilterStatus)
    : "semua";

  const [statistik, daftarPeminjaman] = await Promise.all([
    getStatistikAdmin(),
    getAllPeminjamanDenganRuang(filter),
  ]);

  const labelFilter: Record<FilterStatus, string> = {
    semua: "Semua",
    menunggu: "Menunggu",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <LayoutGrid size={22} className="text-teal-600" aria-hidden />
          Dashboard Admin
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Selamat datang. Kelola permohonan dan ruang dari sini.
        </p>
      </div>

      {/* ── Kartu Statistik ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total Ruang",
            value: statistik.totalRuang,
            Icon: DoorOpen,
            color: "text-slate-700",
            bg: "bg-slate-100",
          },
          {
            label: "Ruang Aktif",
            value: statistik.ruangAktif,
            Icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Total Pengajuan",
            value: statistik.totalPeminjaman,
            Icon: ClipboardList,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Menunggu",
            value: statistik.menunggu,
            Icon: Hourglass,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Disetujui",
            value: statistik.disetujui,
            Icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Ditolak",
            value: statistik.ditolak,
            Icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5"
          >
            <div
              className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
            >
              <s.Icon size={16} className={s.color} aria-hidden />
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Pintasan ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/admin/ruang"
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-[0_4px_14px_rgba(13,148,136,0.1)] hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <span className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
            <DoorOpen size={18} className="text-teal-600" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">Kelola Ruang</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Tambah, aktifkan, nonaktifkan, atau hapus ruang
            </p>
          </div>
        </Link>
        <Link
          href="/admin?status=menunggu"
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-[0_4px_14px_rgba(217,119,6,0.1)] hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
            <Hourglass size={18} className="text-amber-600" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">
              Permohonan Menunggu
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {statistik.menunggu} permohonan perlu ditinjau
            </p>
          </div>
        </Link>
      </div>

      {/* ── Daftar Permohonan ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <ClipboardList size={16} className="text-teal-600" aria-hidden />
            Daftar Permohonan
          </h2>
        </div>

        {/* Filter status */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_VALID.map((s) => (
            <Link
              key={s}
              href={`/admin?status=${s}`}
              className={chipFilter(filter === s)}
            >
              {labelFilter[s]}
              {s === "menunggu" && statistik.menunggu > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {statistik.menunggu}
                </span>
              )}
            </Link>
          ))}
        </div>

        <DaftarPermohonan
          daftar={daftarPeminjaman}
          labelFilter={labelFilter[filter]}
        />
      </div>
    </div>
  );
}
