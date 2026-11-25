// Halaman /admin/ruang – Manajemen Ruang.
// Server Component: data dibaca dari dummy data.

import { getAllRuang } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";
import FormTambahRuang from "./FormTambahRuang";
import { TombolToggleAktif, TombolHapus } from "./TombolRuang";

export default function AdminRuangPage() {
  const semuaRuang = getAllRuang();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Ruang</h1>

      {/* Form Tambah Ruang */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tambah Ruang Baru
        </h2>
        <FormTambahRuang />
      </div>

      {/* Daftar Semua Ruang */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Semua Ruang ({semuaRuang.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {semuaRuang.map((ruang) => (
            <div
              key={ruang.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900">{ruang.nama}</span>
                  <BadgeJenis jenis={ruang.jenis} />
                  {!ruang.aktif && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full border border-gray-300">
                      Nonaktif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  📍 {ruang.lokasi} · 👥 Kapasitas {ruang.kapasitas} orang
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-2">
                <TombolToggleAktif ruang={ruang} />
                <TombolHapus ruang={ruang} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
