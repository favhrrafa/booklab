// Validasi aturan bisnis di sisi server (PRD §5.1)
// Semua fungsi dipanggil dari Server Actions, tidak pernah dari client

// Konversi "HH:MM" ke menit total
function keMinit(waktu: string): number {
  const [jam, menit] = waktu.split(":").map(Number);
  return jam * 60 + menit;
}

// Validasi tanggal: format YYYY-MM-DD, tidak lampau, ≤60 hari, bukan akhir pekan
// "Hari ini" dihitung di zona Asia/Jakarta agar tidak terpengaruh UTC server Vercel
export function validasiTanggal(tanggal: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return "Format tanggal tidak valid.";
  }

  // Round-trip check: cegah tanggal tidak ada seperti 2026-02-30
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  const d = new Date(tahun, bulan - 1, hari);
  if (d.getFullYear() !== tahun || d.getMonth() + 1 !== bulan || d.getDate() !== hari) {
    return "Tanggal tidak valid.";
  }

  // sv-SE menghasilkan format YYYY-MM-DD yang konsisten untuk perbandingan string
  const hariIniStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });

  if (tanggal < hariIniStr) {
    return "Tanggal tidak boleh di masa lalu.";
  }

  const batasD = new Date(hariIniStr);
  batasD.setDate(batasD.getDate() + 60);
  const batasStr = batasD.toISOString().slice(0, 10);
  if (tanggal > batasStr) {
    return "Tanggal maksimal 60 hari ke depan.";
  }

  // Cek hari kerja dari string tanggal agar tidak ada timezone shift
  const hariKe = new Date(tanggal + "T00:00:00").getDay();
  if (hariKe === 0 || hariKe === 6) {
    return "Peminjaman tidak bisa di hari Sabtu atau Minggu.";
  }

  return null;
}

// Validasi jam operasional (07:00–17:00), selesai > mulai, durasi ≤3 jam
export function validasiWaktu(mulai: string, selesai: string): string | null {
  const menitMulai = keMinit(mulai);
  const menitSelesai = keMinit(selesai);
  const JAM_BUKA = keMinit("07:00");
  const JAM_TUTUP = keMinit("17:00");

  if (menitMulai < JAM_BUKA) return "Jam mulai tidak boleh sebelum pukul 07:00.";
  if (menitSelesai > JAM_TUTUP) return "Jam selesai tidak boleh lewat pukul 17:00.";
  if (menitSelesai <= menitMulai) return "Jam selesai harus setelah jam mulai.";
  if (menitSelesai - menitMulai > 180) return "Durasi peminjaman maksimal 3 jam.";

  return null;
}

// Validasi panjang teks peminjam (3–40) dan keperluan (5–120)
export function validasiTeks(
  peminjam: string,
  keperluan: string
): { peminjam?: string; keperluan?: string } {
  const errors: { peminjam?: string; keperluan?: string } = {};

  if (peminjam.trim().length < 3 || peminjam.trim().length > 40) {
    errors.peminjam = "Nama peminjam harus antara 3 sampai 40 karakter.";
  }
  if (keperluan.trim().length < 5 || keperluan.trim().length > 120) {
    errors.keperluan = "Keperluan harus antara 5 sampai 120 karakter.";
  }

  return errors;
}

// Validasi jumlah orang: harus > 0 dan tidak melebihi kapasitas ruang
export function validasiJumlahOrang(jumlahOrang: number, kapasitas: number): string | null {
  if (!Number.isInteger(jumlahOrang) || jumlahOrang <= 0) {
    return "Jumlah orang harus bilangan bulat lebih dari 0.";
  }
  if (jumlahOrang > kapasitas) {
    return `Jumlah orang melebihi kapasitas ruang (maks. ${kapasitas} orang).`;
  }
  return null;
}
