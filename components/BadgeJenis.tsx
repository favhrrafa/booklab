// Komponen Badge untuk jenis ruang
import { JenisRuang } from "@/lib/types";

interface BadgeJenisProps {
  jenis: JenisRuang;
}

const config: Record<JenisRuang, { label: string; className: string }> = {
  lab: {
    label: "Laboratorium",
    className: "bg-purple-100 text-purple-800 border border-purple-300",
  },
  kelas: {
    label: "Kelas",
    className: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  aula: {
    label: "Aula",
    className: "bg-orange-100 text-orange-800 border border-orange-300",
  },
};

export default function BadgeJenis({ jenis }: BadgeJenisProps) {
  const { label, className } = config[jenis];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
