"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DoorOpen, LayoutGrid, LogOut, Shield } from "lucide-react";

interface Props {
  logoutAction: () => Promise<void>;
}

export default function NavbarAdmin({ logoutAction }: Props) {
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

  const linkKelas = (href: string) => {
    const aktif =
      href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(href);
    return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      aktif
        ? "bg-teal-50 text-teal-700"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;
  };

  return (
    <div className="sticky top-0 z-40" onMouseEnter={() => setVisible(true)}>
      <header
        className={`bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand + nav */}
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Shield size={14} aria-hidden />
              </span>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                Pinjam<span className="text-teal-600">Lab</span>
                <span className="ml-1.5 text-slate-400 font-normal">Admin</span>
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link href="/admin" className={linkKelas("/admin")}>
                <LayoutGrid size={14} aria-hidden />
                Dashboard
              </Link>
              <Link href="/admin/ruang" className={linkKelas("/admin/ruang")}>
                <DoorOpen size={14} aria-hidden />
                Kelola Ruang
              </Link>
            </nav>
          </div>

          {/* Logout — server action dikirim lewat prop */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 hover:border-red-200"
            >
              <LogOut size={13} aria-hidden />
              Keluar
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}
