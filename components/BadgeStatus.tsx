// Komponen Badge untuk status peminjaman
// Menggunakan teks + warna agar aksesibel (tidak warna saja)

import { StatusPeminjaman } from "@/lib/types";

interface BadgeStatusProps {
  status: StatusPeminjaman;
}

const config: Record<StatusPeminjaman, { label: string; className: string }> = {
  menunggu: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  },
  disetujui: {
    label: "Disetujui",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
  ditolak: {
    label: "Ditolak",
    className: "bg-red-100 text-red-800 border border-red-300",
  },
};

export default function BadgeStatus({ status }: BadgeStatusProps) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
