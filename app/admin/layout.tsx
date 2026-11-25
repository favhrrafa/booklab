// Layout admin – lapisan kedua dari tiga lapisan RBAC.
// requireAdminOrRedirect() melakukan verifikasi kriptografis cookie sesi.

import { requireAdminOrRedirect } from "@/lib/session";
import { logoutAdmin } from "@/app/login/actions";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminOrRedirect();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Admin */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2 group">
              <span className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                PL
              </span>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Admin
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/ruang"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Kelola Ruang
              </Link>
            </nav>
          </div>

          {/* Logout */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
