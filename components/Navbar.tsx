"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DoorOpen, ClipboardList, CalendarPlus, Search, Home } from "lucide-react";

const tautan = [
  { href: "/",           label: "Beranda",      Icon: Home },
  { href: "/ruang",      label: "Ruang",        Icon: DoorOpen },
  { href: "/peminjaman", label: "Jadwal",        Icon: ClipboardList },
  { href: "/pinjam",     label: "Ajukan Pinjam", Icon: CalendarPlus },
  { href: "/cek",        label: "Cek Status",    Icon: Search },
];

function isAktif(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY <= 10) {
          setVisible(true);
        } else if (currentY > lastScrollY.current) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40" onMouseEnter={() => setVisible(true)}>
      <header
        className={`bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2.5 flex-shrink-0"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <DoorOpen size={16} strokeWidth={2.5} aria-hidden />
            </span>
            <span>Pinjam<span className="text-teal-600">Lab</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {tautan.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isAktif(href, pathname)
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} strokeWidth={2.2} aria-hidden />
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav */}
          <nav className="flex sm:hidden items-center gap-0.5">
            {tautan.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className={`p-2 rounded-lg transition-colors ${
                  isAktif(href, pathname)
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden />
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
