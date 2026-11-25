// Halaman Beranda (/) – Server Component
// Menampilkan ringkasan aplikasi dan daftar ruang aktif

import Link from "next/link";
import { getRuangAktif } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";

export default function BerandaPage() {
  const ruangAktif = getRuangAktif();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-blue-700 rounded-2xl text-white mb-10 px-6">
        <h1 className="text-4xl font-bold mb-3">PinjamLab</h1>
        <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto">
          Ajukan peminjaman ruang kelas, laboratorium, atau aula sekolah secara
          digital. Cepat, mudah, dan tanpa bentrok jadwal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pinjam"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ajukan Peminjaman
          </Link>
          <Link
            href="/ruang"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Lihat Daftar Ruang
          </Link>
        </div>
      </section>

      {/* Info Singkat */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {ruangAktif.length}
          </div>
          <div className="text-sm text-gray-500">Ruang Tersedia</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">07:00–17:00</div>
          <div className="text-sm text-gray-500">Jam Operasional</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">Maks. 3 Jam</div>
          <div className="text-sm text-gray-500">Durasi Peminjaman</div>
        </div>
      </section>

      {/* Daftar Ruang Aktif */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ruang yang Tersedia</h2>
          <Link href="/ruang" className="text-sm text-blue-600 hover:underline">
            Lihat semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruangAktif.map((ruang) => (
            <Link
              key={ruang.id}
              href={`/ruang/${ruang.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {ruang.nama}
                </h3>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <p className="text-sm text-gray-500 mb-1">📍 {ruang.lokasi}</p>
              <p className="text-sm text-gray-500">👥 Kapasitas: {ruang.kapasitas} orang</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cara Penggunaan */}
      <section className="mt-12 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cara Penggunaan</h2>
        <ol className="space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">1</span>
            <span>Lihat <Link href="/ruang" className="text-blue-600 hover:underline">daftar ruang</Link> yang tersedia dan pilih ruang yang sesuai kebutuhan.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">2</span>
            <span>Isi <Link href="/pinjam" className="text-blue-600 hover:underline">formulir pengajuan</Link> dengan lengkap, termasuk tanggal, jam, dan keperluan.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">3</span>
            <span>Simpan <strong>Nomor ID Pengajuan</strong> yang diberikan setelah berhasil mengajukan.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">4</span>
            <span>Pantau status persetujuan di halaman <Link href="/cek" className="text-blue-600 hover:underline">Cek Status</Link> menggunakan ID pengajuan dan nama peminjam.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}
