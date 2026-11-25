// Halaman /cek – Cek Status Peminjaman
// Server Component pembungkus; form-nya Client Component.

import FormCek from "./FormCek";
import Link from "next/link";

// Tidak di-cache agar selalu fresh (data peminjaman bisa berubah)
export const dynamic = "force-dynamic";

export default function CekPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Cek Status Pengajuan
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Masukkan Nomor ID Pengajuan dan nama peminjam untuk mengetahui status
        permohonan Anda. Keduanya harus cocok persis.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <FormCek />
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Belum punya nomor ID?{" "}
        <Link href="/pinjam" className="text-blue-600 hover:underline">
          Ajukan peminjaman di sini
        </Link>
        .
      </p>
    </div>
  );
}
