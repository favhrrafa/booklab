import { JenisRuang } from "@/lib/types";
import { FlaskConical, Building2, LayoutGrid } from "lucide-react";

interface BadgeJenisProps {
  jenis: JenisRuang;
}

const config: Record<
  JenisRuang,
  { label: string; className: string; Icon: React.ElementType }
> = {
  lab: {
    label: "Lab",
    Icon: FlaskConical,
    className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  },
  kelas: {
    label: "Kelas",
    Icon: Building2,
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  aula: {
    label: "Aula",
    Icon: LayoutGrid,
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

export default function BadgeJenis({ jenis }: BadgeJenisProps) {
  const { label, className, Icon } = config[jenis];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
    >
      <Icon size={10} strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  );
}
