"use client";

// Navbar publik – hanya berisi tautan ke halaman publik.
// Tautan ke /admin TIDAK ada di sini (admin akses langsung via /login).

import Link from "next/link";
import { usePathname } from "next/navigation";

const tautan = [
  { href: "/ruang", label: "Ruang" },
  { href: "/peminjaman", label: "Jadwal" },
  { href: "/pinjam", label: "Ajukan Pinjam" },
  { href: "/cek", label: "Cek Status" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            PL
          </span>
          <span>PinjamLab</span>
        </Link>

        {/* Navigasi */}
        <nav className="hidden sm:flex items-center gap-1">
          {tautan.map((t) => {
            const aktif = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  aktif
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav */}
        <nav className="flex sm:hidden items-center gap-1">
          {tautan.map((t) => {
            const aktif = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  aktif
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
