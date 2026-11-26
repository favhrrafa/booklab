// Tipe data utama sesuai skema database

export type JenisRuang = "lab" | "kelas" | "aula";
export type StatusPeminjaman = "menunggu" | "disetujui" | "ditolak";

export interface Ruang {
  id: number;
  nama: string;
  jenis: JenisRuang;
  kapasitas: number;
  lokasi: string;
  aktif: boolean;
}

export interface Peminjaman {
  id: number;
  ruang_id: number;
  peminjam: string;
  keperluan: string;
  tanggal: string; // YYYY-MM-DD
  mulai: string;   // HH:MM
  selesai: string; // HH:MM
  jumlah_orang: number;
  status: StatusPeminjaman;
  alasan_tolak: string | null;
  dibuat: string; // ISO timestamp
}

// Tipe untuk tampilan publik – tidak memuat data pribadi peminjam
export interface JadwalPublik {
  id: number;
  ruang_id: number;
  nama_ruang: string;
  tanggal: string;
  mulai: string;
  selesai: string;
}

// ── Form states (dipakai di client component, tidak boleh di-export dari "use server") ──

export interface LoginState {
  error?: string;
}

export interface FormState {
  errors: {
    ruang_id?: string;
    tanggal?: string;
    mulai?: string;
    selesai?: string;
    jumlah_orang?: string;
    peminjam?: string;
    keperluan?: string;
    umum?: string;
  };
  values: {
    ruang_id: string;
    tanggal: string;
    mulai: string;
    selesai: string;
    jumlah_orang: string;
    peminjam: string;
    keperluan: string;
  };
  sukses?: { id: number };
}

export interface CekState {
  submitted: boolean;
  found: boolean;
  status?: StatusPeminjaman;
  alasan_tolak?: string | null;
  error?: string;
  values: { id: string; peminjam: string };
}

export interface AdminActionState {
  error?: string;
  sukses?: string;
}

export interface RuangFormState {
  errors: { nama?: string; jenis?: string; kapasitas?: string; lokasi?: string; umum?: string };
  values: { nama: string; jenis: string; kapasitas: string; lokasi: string };
  sukses?: string;
}

export interface HapusState {
  error?: string;
  sukses?: string;
}
