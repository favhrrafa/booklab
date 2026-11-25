import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PinjamLab – Peminjaman Ruang & Laboratorium",
  description:
    "Sistem digital pengajuan peminjaman ruang kelas, laboratorium, dan aula sekolah.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          PinjamLab &copy; {new Date().getFullYear()} – Sistem Peminjaman Ruang &amp; Laboratorium
        </footer>
      </body>
    </html>
  );
}
