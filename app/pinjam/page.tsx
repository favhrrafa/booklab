// Halaman /pinjam – Server Component pembungkus form.
// Mengambil daftar ruang aktif di server lalu merender FormPinjam (Client Component).

import { getRuangAktif } from "@/lib/dummy-data";
import FormPinjam from "./FormPinjam";

interface PageProps {
  searchParams: Promise<{ ruang_id?: string }>;
}

export default async function PinjamPage({ searchParams }: PageProps) {
  const { ruang_id } = await searchParams;
  const ruangList = getRuangAktif();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Ajukan Peminjaman Ruang
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Isi formulir di bawah ini untuk mengajukan peminjaman. Setelah berhasil,
        Anda akan mendapatkan Nomor ID pengajuan – simpan nomor tersebut untuk
        mengecek status persetujuan.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <FormPinjam ruangList={ruangList} ruangIdAwal={ruang_id} />
      </div>
    </div>
  );
}
