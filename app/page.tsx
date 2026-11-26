// Halaman beranda (/)

import Link from "next/link";
import { getRuangAktif } from "@/lib/dummy-data";
import BadgeJenis from "@/components/BadgeJenis";
import {
  MapPin,
  Users,
  Clock,
  CalendarPlus,
  DoorOpen,
  Search,
  ArrowRight,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import { kartu } from "@/lib/ui";

export default function BerandaPage() {
  const ruangAktif = getRuangAktif();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 px-8 py-16 text-white text-center">
        {/* lingkaran dekorasi */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-black/10" />
        {/* ikon dekorasi sudut */}
        <ClipboardList
          size={96}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-6 right-6 text-white/5 hidden sm:block"
          aria-hidden
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm border border-white/20">
            <DoorOpen size={12} aria-hidden />
            Sistem Peminjaman Digital
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Pinjam Ruang &amp; Lab
            <br />
            <span className="text-teal-200">Tanpa Bentrok Jadwal</span>
          </h1>
          <p className="text-teal-100 max-w-md mx-auto text-sm sm:text-base mb-9">
            Ajukan peminjaman ruang kelas, laboratorium, atau aula sekolah
            secara digital. Cepat, mudah, dan tervalidasi otomatis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pinjam"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-50 transition-colors text-sm shadow-sm"
            >
              <CalendarPlus size={16} aria-hidden />
              Ajukan Peminjaman
            </Link>
            <Link
              href="/ruang"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm border border-white/25 backdrop-blur-sm"
            >
              <DoorOpen size={16} aria-hidden />
              Lihat Daftar Ruang
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Statistik ─── */}
      <section className="grid grid-cols-3 gap-4">
        {[
          {
            Icon: DoorOpen,
            value: ruangAktif.length.toString(),
            label: "Ruang Tersedia",
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            Icon: Clock,
            value: "07:00–17:00",
            label: "Jam Operasional",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            Icon: Users,
            value: "Maks. 3 Jam",
            label: "Durasi Peminjaman",
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${kartu} p-5 text-center`}
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3`}>
              <s.Icon size={18} className={s.color} aria-hidden />
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ─── Daftar ruang aktif ─── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Ruang yang Tersedia
          </h2>
          <Link
            href="/ruang"
            className="inline-flex items-center gap-1 text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors"
          >
            Lihat semua
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruangAktif.map((ruang) => (
            <Link
              key={ruang.id}
              href={`/ruang/${ruang.id}`}
              className={`group ${kartu} p-5 hover:border-teal-300 hover:shadow-[0_4px_12px_rgba(13,148,136,0.1)] transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors leading-snug">
                  {ruang.nama}
                </h3>
                <BadgeJenis jenis={ruang.jenis} />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                <MapPin size={11} className="text-slate-400 flex-shrink-0" aria-hidden />
                {ruang.lokasi}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                <Users size={11} className="text-slate-400 flex-shrink-0" aria-hidden />
                {ruang.kapasitas} orang
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 group-hover:underline">
                Lihat detail
                <ArrowRight size={11} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Langkah-langkah ─── */}
      <section className={`${kartu} p-8`}>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={18} className="text-teal-600" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-800">
            Cara Mengajukan Peminjaman
          </h2>
        </div>
        <ol className="space-y-4">
          {[
            {
              Icon: DoorOpen,
              text: (
                <>
                  Lihat{" "}
                  <Link href="/ruang" className="text-teal-600 hover:underline">
                    daftar ruang
                  </Link>{" "}
                  yang tersedia dan pilih ruang yang sesuai.
                </>
              ),
            },
            {
              Icon: CalendarPlus,
              text: (
                <>
                  Isi{" "}
                  <Link href="/pinjam" className="text-teal-600 hover:underline">
                    formulir pengajuan
                  </Link>{" "}
                  dengan lengkap: tanggal, jam, dan keperluan.
                </>
              ),
            },
            {
              Icon: ClipboardList,
              text: (
                <>
                  Simpan <strong>Nomor ID Pengajuan</strong> yang diberikan
                  setelah berhasil mengajukan.
                </>
              ),
            },
            {
              Icon: Search,
              text: (
                <>
                  Pantau status di halaman{" "}
                  <Link href="/cek" className="text-teal-600 hover:underline">
                    Cek Status
                  </Link>{" "}
                  menggunakan ID dan nama Anda.
                </>
              ),
            },
          ].map(({ Icon, text }, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center mt-0.5">
                <Icon size={15} strokeWidth={2.5} aria-hidden />
              </span>
              <span className="text-sm text-slate-600 leading-relaxed pt-1.5">
                {text}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
