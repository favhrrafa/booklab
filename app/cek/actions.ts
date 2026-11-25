"use server";

// Server Action untuk cek status peminjaman (/cek).
// Keamanan: ID + nama harus cocok persis (case-sensitive).
// Jika salah satu tidak cocok, tampilkan pesan generik – tidak bocorkan info.

import { getPeminjamanById } from "@/lib/dummy-data";
import { StatusPeminjaman } from "@/lib/types";

export interface CekState {
  submitted: boolean;
  found: boolean;
  status?: StatusPeminjaman;
  alasan_tolak?: string | null;
  error?: string;
  values: {
    id: string;
    peminjam: string;
  };
}

export const cekInitialState: CekState = {
  submitted: false,
  found: false,
  values: { id: "", peminjam: "" },
};

export async function cekStatusPeminjaman(
  _prevState: CekState,
  formData: FormData
): Promise<CekState> {
  const idStr = (formData.get("id") as string)?.trim() ?? "";
  const peminjamInput = (formData.get("peminjam") as string)?.trim() ?? "";

  const values = { id: idStr, peminjam: peminjamInput };

  if (!idStr || !peminjamInput) {
    return {
      submitted: true,
      found: false,
      error: "ID pengajuan dan nama peminjam harus diisi.",
      values,
    };
  }

  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) {
    return {
      submitted: true,
      found: false,
      error: "Data tidak ditemukan. Periksa kembali ID dan nama Anda.",
      values,
    };
  }

  // Cari peminjaman berdasarkan ID
  const data = getPeminjamanById(id);

  // Jika tidak ada atau nama tidak cocok persis (case-sensitive), tampilkan pesan generik
  // Pesan sama untuk kedua kasus agar tidak bocorkan apakah ID ada atau tidak
  if (!data || data.peminjam !== peminjamInput) {
    return {
      submitted: true,
      found: false,
      error: "Data tidak ditemukan. Periksa kembali ID dan nama Anda.",
      values,
    };
  }

  // Data ditemukan – kembalikan hanya status dan alasan_tolak (tidak ada data pribadi lain)
  return {
    submitted: true,
    found: true,
    status: data.status,
    alasan_tolak: data.alasan_tolak,
    values,
  };
}
