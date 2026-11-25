// Halaman Beranda (/) – Server Component

import Link from "next/link";
import { getRuangAktif } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";

export default function BerandaPage() {
  const ruangAktif = getRuangAktif();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl bg-blue-600 px-8 py-14 text-white text-center">
        {/* lingkaran dekoratif */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/40" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-blue-700/50" />

        <div className="relative z-10">
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-500/60 text-xs font-semibold tracking-wide uppercase">
            Sistem Peminjaman Digital
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Pinjam Ruang &amp; Lab
            <br />
            <span className="text-blue-200">Tanpa Bentrok Jadwal</span>
          </h1>
          <p className="text-blue-100 max-w-md mx-auto text-sm sm:text-base mb-8">
            Ajukan peminjaman ruang kelas, laboratorium, atau aula sekolah
            secara digital. Cepat, mudah, dan tervalidasi otomatis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pinjam"
              className="bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              Ajukan Peminjaman
            </Link>
            <Link
              href="/ruang"
              className="bg-blue-500/50 hover:bg-blue-500/70 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm border border-blue-400/50"
            >
              Lihat Daftar Ruang
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-3 gap-4">
        {[
          {
            value: ruangAktif.length.toString(),
            label: "Ruang Tersedia",
            color: "text-blue-600",
          },
          { value: "07:00–17:00", label: "Jam Operasional", color: "text-emerald-600" },
          { value: "Maks. 3 Jam", label: "Durasi Peminjaman", color: "text-violet-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── Daftar Ruang Aktif ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Ruang yang Tersedia
          </h2>
          <Link
            href="/ruang"
            className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Lihat semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruangAktif.map((ruang) => (
            <Link
              key={ruang.id}
              href={`/ruang/${ruang.id}`}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                  {ruang.nama}
                </h3>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <p className="text-xs text-slate-500 mb-1">📍 {ruang.lokasi}</p>
              <p className="text-xs text-slate-500 mb-4">
                👥 {ruang.kapasitas} orang
              </p>
              <span className="text-xs font-medium text-blue-600 group-hover:underline">
                Lihat detail →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Cara Penggunaan ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          Cara Mengajukan Peminjaman
        </h2>
        <ol className="space-y-4">
          {[
            {
              n: "1",
              text: (
                <>
                  Lihat{" "}
                  <Link href="/ruang" className="text-blue-600 hover:underline">
                    daftar ruang
                  </Link>{" "}
                  yang tersedia dan pilih ruang yang sesuai kebutuhan.
                </>
              ),
            },
            {
              n: "2",
              text: (
                <>
                  Isi{" "}
                  <Link href="/pinjam" className="text-blue-600 hover:underline">
                    formulir pengajuan
                  </Link>{" "}
                  dengan lengkap: tanggal, jam, dan keperluan.
                </>
              ),
            },
            {
              n: "3",
              text: (
                <>
                  Simpan <strong>Nomor ID Pengajuan</strong> yang diberikan
                  setelah berhasil mengajukan.
                </>
              ),
            },
            {
              n: "4",
              text: (
                <>
                  Pantau status persetujuan di halaman{" "}
                  <Link href="/cek" className="text-blue-600 hover:underline">
                    Cek Status
                  </Link>{" "}
                  menggunakan ID dan nama Anda.
                </>
              ),
            },
          ].map((step) => (
            <li key={step.n} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {step.n}
              </span>
              <span className="text-sm text-slate-600 leading-relaxed">
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
