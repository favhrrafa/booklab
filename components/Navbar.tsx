"use client";

// Navbar publik – hanya berisi tautan ke halaman publik.
// Tautan ke /admin TIDAK ada di sini (admin akses langsung via /login).

import Link from "next/link";
import { usePathname } from "next/navigation";

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/ruang", label: "Daftar Ruang" },
  { href: "/peminjaman", label: "Jadwal" },
  { href: "/pinjam", label: "Ajukan Pinjam" },
  { href: "/cek", label: "Cek Status" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo / Nama Aplikasi */}
        <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight">
          PinjamLab
        </Link>

        {/* Navigasi */}
        <nav className="flex flex-wrap gap-1">
          {tautan.map((t) => {
            const aktif = t.href === "/"
              ? pathname === "/"
              : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  aktif
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
