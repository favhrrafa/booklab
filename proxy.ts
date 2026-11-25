// proxy.ts – pengganti middleware.ts di Next.js 16.
// Perlindungan rute /admin* (lapisan pertama dari tiga lapisan RBAC).
// Jika tidak terautentikasi, redirect ke /login.
// Jika sudah login dan membuka /login, redirect ke /admin.

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

// Verifikasi ringan di proxy: cukup cek keberadaan cookie.
// Verifikasi kriptografis penuh ada di layout guard & Server Actions (lapisan 2 & 3).
// Proxy harus tetap ringan agar tidak memperlambat semua request.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get(COOKIE_NAME);
  const adaCookie = !!cookie?.value;

  // Proteksi rute /admin dan semua sub-rutenya
  if (pathname.startsWith("/admin")) {
    if (!adaCookie) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login dan mencoba membuka /login, arahkan ke /admin
  if (pathname === "/login" && adaCookie) {
    const adminUrl = new URL("/admin", req.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan proxy hanya untuk rute admin dan login
  matcher: ["/admin/:path*", "/login"],
};
