import { StatusPeminjaman } from "@/lib/types";

interface BadgeStatusProps {
  status: StatusPeminjaman;
}

const config: Record<
  StatusPeminjaman,
  { label: string; dot: string; className: string }
> = {
  menunggu: {
    label: "Menunggu",
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  disetujui: {
    label: "Disetujui",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  ditolak: {
    label: "Ditolak",
    dot: "bg-red-500",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

export default function BadgeStatus({ status }: BadgeStatusProps) {
  const { label, dot, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
