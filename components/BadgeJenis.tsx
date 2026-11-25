import { JenisRuang } from "@/lib/types";

interface BadgeJenisProps {
  jenis: JenisRuang;
}

const config: Record<JenisRuang, { label: string; className: string }> = {
  lab: {
    label: "Lab",
    className: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  },
  kelas: {
    label: "Kelas",
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  aula: {
    label: "Aula",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

export default function BadgeJenis({ jenis }: BadgeJenisProps) {
  const { label, className } = config[jenis];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
