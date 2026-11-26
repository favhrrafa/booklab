// Layout admin – lapisan 2 RBAC, verifikasi cookie sesi sebelum render

import { requireAdminOrRedirect } from "@/lib/session";
import { logoutAdmin } from "@/app/(publik)/login/actions";
import NavbarAdmin from "./NavbarAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminOrRedirect();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarAdmin logoutAction={logoutAdmin} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
