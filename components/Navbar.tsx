"use client";

// Navbar publik – tidak ada tautan ke /admin (admin akses via /login langsung)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen, ClipboardList, CalendarPlus, Search } from "lucide-react";

const tautan = [
  { href: "/ruang", label: "Ruang", Icon: DoorOpen },
  { href: "/peminjaman", label: "Jadwal", Icon: ClipboardList },
  { href: "/pinjam", label: "Ajukan Pinjam", Icon: CalendarPlus },
  { href: "/cek", label: "Cek Status", Icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
            <DoorOpen size={16} strokeWidth={2.5} aria-hidden />
          </span>
          <span>
            Pinjam<span className="text-teal-600">Lab</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {tautan.map(({ href, label, Icon }) => {
            const aktif = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  aktif
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} strokeWidth={2.2} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav */}
        <nav className="flex sm:hidden items-center gap-0.5">
          {tautan.map(({ href, label, Icon }) => {
            const aktif = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className={`p-2 rounded-lg transition-colors ${
                  aktif
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
