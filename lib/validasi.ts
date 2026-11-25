// Fungsi-fungsi validasi server untuk aturan bisnis PRD.
// Semua validasi dijalankan di sisi server (Server Action).

// Konversi HH:MM ke menit (untuk perbandingan waktu)
function keMinit(waktu: string): number {
  const [jam, menit] = waktu.split(":").map(Number);
  return jam * 60 + menit;
}

// Validasi format dan kebenaran tanggal YYYY-MM-DD
export function validasiTanggal(tanggal: string): string | null {
  // Harus sesuai format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return "Format tanggal tidak valid.";
  }

  // Round-trip check: cegah tanggal tidak ada seperti 2026-02-30
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  const d = new Date(tahun, bulan - 1, hari);
  if (
    d.getFullYear() !== tahun ||
    d.getMonth() + 1 !== bulan ||
    d.getDate() !== hari
  ) {
    return "Tanggal tidak valid (misalnya 31 Februari tidak ada).";
  }

  // "Hari ini" dihitung dari string tanggal di zona Asia/Jakarta
  // agar tidak terpengaruh offset UTC server Vercel
  const hariIniStr = new Date()
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
  // sv-SE menghasilkan format YYYY-MM-DD yang konsisten

  if (tanggal < hariIniStr) {
    return "Tanggal tidak boleh di masa lalu.";
  }

  // Maksimal 60 hari ke depan
  const batasD = new Date(hariIniStr);
  batasD.setDate(batasD.getDate() + 60);
  const batasStr = batasD.toISOString().slice(0, 10);
  if (tanggal > batasStr) {
    return "Tanggal maksimal 60 hari ke depan dari sekarang.";
  }

  // Tidak boleh Sabtu (6) atau Minggu (0)
  // Dihitung dari string agar tidak ada timezone shift
  const hariKe = new Date(tanggal + "T00:00:00").getDay();
  if (hariKe === 0 || hariKe === 6) {
    return "Peminjaman tidak bisa di hari Sabtu atau Minggu.";
  }

  return null; // lolos
}

// Validasi waktu dan durasi
export function validasiWaktu(mulai: string, selesai: string): string | null {
  const menitMulai = keMinit(mulai);
  const menitSelesai = keMinit(selesai);
  const JAM_BUKA = keMinit("07:00"); // 420 menit
  const JAM_TUTUP = keMinit("17:00"); // 1020 menit

  if (menitMulai < JAM_BUKA) {
    return "Jam mulai tidak boleh sebelum pukul 07:00.";
  }
  if (menitSelesai > JAM_TUTUP) {
    return "Jam selesai tidak boleh lewat pukul 17:00.";
  }
  if (menitSelesai <= menitMulai) {
    return "Jam selesai harus setelah jam mulai.";
  }
  // Durasi maksimal 3 jam = 180 menit
  if (menitSelesai - menitMulai > 180) {
    return "Durasi peminjaman maksimal 3 jam.";
  }

  return null;
}

// Validasi teks peminjam dan keperluan
export function validasiTeks(
  peminjam: string,
  keperluan: string
): { peminjam?: string; keperluan?: string } {
  const errors: { peminjam?: string; keperluan?: string } = {};

  const p = peminjam.trim();
  if (p.length < 3 || p.length > 40) {
    errors.peminjam = "Nama peminjam harus antara 3 sampai 40 karakter.";
  }

  const k = keperluan.trim();
  if (k.length < 5 || k.length > 120) {
    errors.keperluan = "Keperluan harus antara 5 sampai 120 karakter.";
  }

  return errors;
}

// Validasi jumlah orang
export function validasiJumlahOrang(
  jumlahOrang: number,
  kapasitas: number
): string | null {
  if (!Number.isInteger(jumlahOrang) || jumlahOrang <= 0) {
    return "Jumlah orang harus bilangan bulat lebih dari 0.";
  }
  if (jumlahOrang > kapasitas) {
    return `Jumlah orang melebihi kapasitas ruang (maks. ${kapasitas} orang).`;
  }
  return null;
}
