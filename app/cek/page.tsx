// Halaman /cek – Cek Status Peminjaman
// Server Component pembungkus; form-nya Client Component.

import FormCek from "./FormCek";
import Link from "next/link";
import { kartu } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default function CekPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Cek Status Pengajuan
        </h1>
        <p className="text-sm text-slate-500">
          Masukkan Nomor ID dan nama peminjam untuk melihat status permohonan
          Anda.
        </p>
      </div>

      <div className={`${kartu} p-6 sm:p-8`}>
        <FormCek />
      </div>

      <p className="mt-5 text-xs text-slate-400 text-center">
        Belum punya nomor ID?{" "}
        <Link href="/pinjam" className="text-teal-600 hover:underline">
          Ajukan peminjaman di sini
        </Link>
        .
      </p>
    </div>
  );
}
