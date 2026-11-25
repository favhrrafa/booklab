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
