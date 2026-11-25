// Layout admin – lapisan kedua dari tiga lapisan RBAC.
// requireAdminOrRedirect() melakukan verifikasi kriptografis cookie.
// (Lapisan 1: middleware; Lapisan 3: requireAdmin() di tiap Server Action)

import { requireAdminOrRedirect } from "@/lib/session";
import { logoutAdmin } from "@/app/login/actions";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifikasi penuh sesi – redirect ke /login jika tidak valid
  await requireAdminOrRedirect();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg">🔐 PinjamLab Admin</span>
            <nav className="hidden sm:flex gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded text-sm hover:bg-blue-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/ruang"
                className="px-3 py-1.5 rounded text-sm hover:bg-blue-800 transition-colors"
              >
                Kelola Ruang
              </Link>
            </nav>
          </div>

          {/* Tombol Keluar */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      {/* Konten halaman admin */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
