// Halaman /admin/ruang – manajemen ruang

import { getAllRuang } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";
import FormTambahRuang from "./FormTambahRuang";
import { TombolToggleAktif, TombolHapus } from "./TombolRuang";
import { Plus, DoorOpen, MapPin, Users } from "lucide-react";
import { kartu } from "@/lib/ui";

export default function AdminRuangPage() {
  const semuaRuang = getAllRuang();
  const aktif = semuaRuang.filter((r) => r.aktif).length;
  const nonaktif = semuaRuang.length - aktif;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Kelola Ruang
        </h1>
        <p className="text-sm text-slate-400">
          {semuaRuang.length} ruang total · {aktif} aktif · {nonaktif} nonaktif
        </p>
      </div>

      <div className="space-y-6">
        <div className={`${kartu} p-6`}>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-5 flex items-center gap-1.5">
            <Plus size={14} className="text-teal-600" aria-hidden />
            Tambah Ruang Baru
          </h2>
          <FormTambahRuang />
        </div>

        <div className={`${kartu} overflow-hidden`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <DoorOpen size={14} className="text-teal-600" aria-hidden />
              Semua Ruang
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {semuaRuang.length} ruang
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {semuaRuang.map((ruang) => (
              <div
                key={ruang.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-slate-800 text-sm">
                      {ruang.nama}
                    </span>
                    <BadgeJenis jenis={ruang.jenis} />
                    {!ruang.aktif && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={10} aria-hidden />
                      {ruang.lokasi}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={10} aria-hidden />
                      Kapasitas {ruang.kapasitas} orang
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <TombolToggleAktif ruang={ruang} />
                  <TombolHapus ruang={ruang} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
