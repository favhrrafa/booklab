import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PinjamLab – Peminjaman Ruang & Laboratorium",
  description:
    "Sistem digital pengajuan peminjaman ruang kelas, laboratorium, dan aula sekolah.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-400">
          PinjamLab &copy; {new Date().getFullYear()} &mdash; Sistem Peminjaman
          Ruang &amp; Laboratorium
        </footer>
      </body>
    </html>
  );
}
