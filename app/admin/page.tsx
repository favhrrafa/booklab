// Halaman /admin – Dashboard beranda admin

import {
  getStatistikAdmin,
  getAllPeminjamanDenganRuang,
} from "@/lib/db";
import BadgeStatus from "@/components/BadgeStatus";
import { TombolSetujui, TombolTolak } from "./TombolAksi";
import Link from "next/link";
import {
  DoorOpen,
  CalendarDays,
  Clock,
  Users,
  User,
  FileText,
  Hash,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Hourglass,
  LayoutGrid,
} from "lucide-react";
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
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
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
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 hover:shadow-[0_4px_12px_rgba(13,148,136,0.08)] transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
            <DoorOpen size={18} className="text-teal-600" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Kelola Ruang</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Tambah, aktifkan, nonaktifkan, atau hapus ruang
            </p>
          </div>
        </Link>
        <Link
          href="/admin?status=menunggu"
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-[0_4px_12px_rgba(217,119,6,0.08)] transition-all group"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
            <Hourglass size={18} className="text-amber-600" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-slate-800 text-sm">
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

        {daftarPeminjaman.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] py-20 text-center">
            <ClipboardList size={36} className="mx-auto mb-3 text-slate-200" aria-hidden />
            <p className="text-slate-400 text-sm">
              Tidak ada permohonan dengan status &quot;{labelFilter[filter]}&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {daftarPeminjaman.map((p) => (
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
                      {p.nama_ruang}
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
                  <FileText
                    size={13}
                    className="text-slate-400 mt-0.5 flex-shrink-0"
                    aria-hidden
                  />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
