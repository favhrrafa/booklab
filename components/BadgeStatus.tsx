import { StatusPeminjaman } from "@/lib/types";
import { Clock, BadgeCheck, XCircle } from "lucide-react";

interface BadgeStatusProps {
  status: StatusPeminjaman;
}

const config: Record<
  StatusPeminjaman,
  { label: string; Icon: React.ElementType; className: string }
> = {
  menunggu: {
    label: "Menunggu",
    Icon: Clock,
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  disetujui: {
    label: "Disetujui",
    Icon: BadgeCheck,
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  ditolak: {
    label: "Ditolak",
    Icon: XCircle,
    className: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

export default function BadgeStatus({ status }: BadgeStatusProps) {
  const { label, className, Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <Icon size={11} strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  );
}
