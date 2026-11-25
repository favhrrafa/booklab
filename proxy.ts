// proxy.ts – pengganti middleware.ts di Next.js 16
// Lapisan 1 RBAC: proteksi rute /admin* dan redirect /login jika sudah login

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adaCookie = !!req.cookies.get(COOKIE_NAME)?.value;

  // Blokir /admin/* jika tidak ada cookie sesi
  if (pathname.startsWith("/admin") && !adaCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika sudah login dan membuka /login, langsung ke /admin
  if (pathname === "/login" && adaCookie) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
