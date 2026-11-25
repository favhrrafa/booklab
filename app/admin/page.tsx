// Halaman /admin – Dashboard permohonan peminjaman.
// Server Component. Filter status via URL ?status=...

import { getPeminjamanByStatus, getRuangById } from "@/lib/dummy-data";
import BadgeStatus from "@/components/BadgeStatus";
import { TombolSetujui, TombolTolak } from "./TombolAksi";
import Link from "next/link";

const STATUS_VALID = ["semua", "menunggu", "disetujui", "ditolak"] as const;
type FilterStatus = (typeof STATUS_VALID)[number];

function formatTanggal(tgl: string): string {
  const d = new Date(tgl + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
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

  // Fallback ke 'semua' jika nilai tidak valid
  const filter: FilterStatus = STATUS_VALID.includes(statusParam as FilterStatus)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Permohonan
        </h1>
        <Link
          href="/admin/ruang"
          className="text-sm text-blue-600 hover:underline"
        >
          Kelola Ruang →
        </Link>
      </div>

      {/* Filter Status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_VALID.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${s}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-blue-700 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFilter[s]}
          </Link>
        ))}
      </div>

      {/* Tabel Peminjaman */}
      {daftarPeminjaman.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>Tidak ada permohonan dengan status &quot;{labelFilter[filter]}&quot;.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {daftarPeminjaman.map((p) => {
            const ruang = getRuangById(p.ruang_id);
            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">
                        #{p.id}
                      </span>
                      <BadgeStatus status={p.status} />
                    </div>
                    <h2 className="font-semibold text-gray-900">
                      {ruang?.nama ?? `Ruang #${p.ruang_id}`}
                    </h2>
                  </div>
                  <div className="text-xs text-gray-400">
                    Diajukan: {formatWaktu(p.dibuat)}
                  </div>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                  <div>
                    <dt className="text-gray-500 text-xs">Peminjam</dt>
                    <dd className="font-medium text-gray-800">{p.peminjam}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs">Tanggal</dt>
                    <dd className="font-medium text-gray-800">
                      {formatTanggal(p.tanggal)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs">Jam</dt>
                    <dd className="font-medium text-gray-800 font-mono">
                      {p.mulai}–{p.selesai}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs">Jumlah</dt>
                    <dd className="font-medium text-gray-800">
                      {p.jumlah_orang} orang
                    </dd>
                  </div>
                </dl>

                <div className="text-sm text-gray-600 mb-3">
                  <span className="text-gray-500 text-xs">Keperluan: </span>
                  {p.keperluan}
                </div>

                {p.alasan_tolak && (
                  <div className="text-sm bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <span className="text-red-600 font-medium">Alasan Tolak: </span>
                    <span className="text-red-700">{p.alasan_tolak}</span>
                  </div>
                )}

                {/* Tombol aksi hanya muncul untuk status menunggu */}
                {p.status === "menunggu" && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
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
