// Tipe data utama sesuai skema database PRD

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
  tanggal: string; // format YYYY-MM-DD
  mulai: string;   // format HH:MM
  selesai: string; // format HH:MM
  jumlah_orang: number;
  status: StatusPeminjaman;
  alasan_tolak: string | null;
  dibuat: string; // ISO timestamp
}

// Tipe untuk tampilan publik (tanpa data pribadi)
export interface JadwalPublik {
  id: number;
  ruang_id: number;
  nama_ruang: string;
  tanggal: string;
  mulai: string;
  selesai: string;
}
