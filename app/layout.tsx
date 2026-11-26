import type { Metadata } from "next";
import React from "react";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
