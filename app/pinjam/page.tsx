// Halaman /pinjam – Server Component pembungkus form.

import { getRuangAktif } from "@/lib/dummy-data";
import FormPinjam from "./FormPinjam";
import { kartu } from "@/lib/ui";

interface PageProps {
  searchParams: Promise<{ ruang_id?: string }>;
}

export default async function PinjamPage({ searchParams }: PageProps) {
  const { ruang_id } = await searchParams;
  const ruangList = getRuangAktif();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
          Ajukan Peminjaman
        </h1>
        <p className="text-sm text-slate-500">
          Isi formulir di bawah. Setelah berhasil, simpan Nomor ID pengajuan
          untuk memantau status persetujuan.
        </p>
      </div>

      <div className={`${kartu} p-6 sm:p-8`}>
        <FormPinjam ruangList={ruangList} ruangIdAwal={ruang_id} />
      </div>
    </div>
  );
}
