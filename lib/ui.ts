// Token kelas Tailwind bersama – satu tempat untuk mengubah tema visual.
// Tema: teal (nuansa lab/sains), bersih dan modern.

// Kartu / panel dasar
export const kartu =
  "bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out";

// Judul halaman
export const judulHalaman = "text-2xl font-bold text-slate-900 tracking-tight";
export const subJudulHalaman = "text-sm text-slate-500 mt-1";

// Tombol
export const tombol = {
  utama:
    "inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  sekunder:
    "inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold rounded-xl px-5 py-2.5 text-sm border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  kecil:
    "inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg px-3.5 py-1.5 transition-colors disabled:opacity-50",
  sukses:
    "inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg px-3.5 py-1.5 hover:bg-emerald-700 transition-colors disabled:opacity-50",
  bahaya:
    "inline-flex items-center justify-center gap-1.5 bg-white text-red-600 text-xs font-semibold rounded-lg px-3.5 py-1.5 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50",
  aksiKecil:
    "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium px-3 py-1.5 transition-colors",
};

// Input / select / textarea – berubah merah bila ada error field
export function kelasInput(adaError: boolean): string {
  const dasar =
    "w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/25";
  return adaError
    ? `${dasar} border-red-300 bg-red-50/40 focus:border-red-400`
    : `${dasar} border-slate-200 bg-white hover:border-slate-300 focus:border-teal-500`;
}

// Label dan pesan error field
export const labelField =
  "block text-sm font-medium text-slate-700 mb-1.5";
export const pesanError = "mt-1.5 text-xs text-red-600 flex items-center gap-1";
export const petunjukField = "mt-1.5 text-xs text-slate-400";

// Alert (error / sukses / peringatan) – ikon lucide dipasang pemanggilnya
export const alert = {
  error:
    "flex gap-2.5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700",
  sukses:
    "flex gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700",
  peringatan:
    "flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700",
};

// Chip filter (dipakai /ruang dan /admin)
export function chipFilter(aktif: boolean): string {
  return aktif
    ? "px-4 py-1.5 rounded-full text-sm font-medium bg-teal-600 text-white shadow-sm transition-colors"
    : "px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700 transition-colors";
}
