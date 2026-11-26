// Layout admin – lapisan 2 RBAC, verifikasi cookie sesi sebelum render

import { requireAdminOrRedirect } from "@/lib/session";
import { logoutAdmin } from "@/app/login/actions";
import Link from "next/link";
import { DoorOpen, LayoutGrid, LogOut, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminOrRedirect();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Shield size={14} className="text-white" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Admin
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LayoutGrid size={14} aria-hidden />
                Dashboard
              </Link>
              <Link
                href="/admin/ruang"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <DoorOpen size={14} aria-hidden />
                Kelola Ruang
              </Link>
            </nav>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              <LogOut size={13} aria-hidden />
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
