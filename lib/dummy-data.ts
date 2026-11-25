// Data in-memory sementara sebelum migrasi ke Supabase
// Saat migrasi: ganti file ini dengan dua Supabase client helpers

import { Ruang, Peminjaman } from "./types";

// 6 ruang: campuran lab/kelas/aula, 1 nonaktif
export const dummyRuang: Ruang[] = [
  { id: 1, nama: "Lab Komputer 1", jenis: "lab",   kapasitas: 36,  lokasi: "Gedung A Lantai 1", aktif: true },
  { id: 2, nama: "Lab Komputer 2", jenis: "lab",   kapasitas: 32,  lokasi: "Gedung A Lantai 2", aktif: true },
  { id: 3, nama: "Kelas 10A",      jenis: "kelas", kapasitas: 34,  lokasi: "Gedung B Lantai 1", aktif: true },
  { id: 4, nama: "Kelas 11B",      jenis: "kelas", kapasitas: 30,  lokasi: "Gedung B Lantai 2", aktif: true },
  { id: 5, nama: "Aula Utama",     jenis: "aula",  kapasitas: 200, lokasi: "Gedung C",           aktif: true },
  { id: 6, nama: "Lab Fisika",     jenis: "lab",   kapasitas: 28,  lokasi: "Gedung A Lantai 3", aktif: false },
];

// Geser tanggal ke hari kerja berikutnya jika jatuh di weekend
function getWeekday(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getWeekdayBack(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const tgl1 = getWeekday(3);
const tgl2 = getWeekday(5);
const tgl3 = getWeekday(7);
const tgl4 = getWeekday(10);
const tglLalu = getWeekdayBack(2);

export const dummyPeminjaman: Peminjaman[] = [
  // Lab Komputer 1 – dua jadwal menempel (disetujui)
  { id: 1, ruang_id: 1, peminjam: "Budi Santoso",  keperluan: "Praktikum Pemrograman Web kelas XI RPL",          tanggal: tgl1, mulai: "08:00", selesai: "10:00", jumlah_orang: 30, status: "disetujui", alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, ruang_id: 1, peminjam: "Sari Dewi",     keperluan: "Ujian Praktik Basis Data kelas XII RPL",          tanggal: tgl1, mulai: "10:00", selesai: "12:00", jumlah_orang: 32, status: "disetujui", alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 2).toISOString() },
  // Lab Komputer 1 – dua pengajuan bertumpuk (menunggu) – admin tidak bisa approve keduanya
  { id: 3, ruang_id: 1, peminjam: "Ahmad Fauzi",   keperluan: "Pelatihan desain grafis untuk ekstrakurikuler",   tanggal: tgl1, mulai: "09:00", selesai: "11:00", jumlah_orang: 20, status: "menunggu",  alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 4, ruang_id: 1, peminjam: "Rina Susanti",  keperluan: "Pertemuan kelompok belajar programming",          tanggal: tgl1, mulai: "09:30", selesai: "11:30", jumlah_orang: 15, status: "menunggu",  alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 1).toISOString() },
  // Lab Komputer 2 – disetujui
  { id: 5, ruang_id: 2, peminjam: "Pak Hendra",    keperluan: "Rapat koordinasi panitia pensi dengan presentasi multimedia", tanggal: tgl2, mulai: "13:00", selesai: "15:00", jumlah_orang: 25, status: "disetujui", alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 6, ruang_id: 2, peminjam: "Lina Marlina",  keperluan: "Tryout online kelas XII",                         tanggal: tgl3, mulai: "07:00", selesai: "10:00", jumlah_orang: 32, status: "menunggu",  alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 1).toISOString() },
  // Aula Utama – menunggu
  { id: 7, ruang_id: 5, peminjam: "OSIS Sekolah",  keperluan: "Upacara peringatan hari pahlawan dan pementasan seni budaya siswa", tanggal: tgl4, mulai: "07:00", selesai: "10:00", jumlah_orang: 180, status: "menunggu", alasan_tolak: null, dibuat: new Date(Date.now() - 86400000 * 1).toISOString() },
  // Kelas 10A – ditolak (historis)
  { id: 8, ruang_id: 3, peminjam: "Dian Puspita",  keperluan: "Bimbingan belajar matematika kelas X",            tanggal: tglLalu, mulai: "14:00", selesai: "16:00", jumlah_orang: 20, status: "ditolak", alasan_tolak: "Ruang sudah dijadwalkan untuk kegiatan remedial oleh guru matematika.", dibuat: new Date(Date.now() - 86400000 * 5).toISOString() },
];

// Counter auto-increment untuk insert dummy
let nextRuangId = 7;
let nextPeminjamanId = 9;

export function getAllRuang(): Ruang[] {
  return [...dummyRuang];
}

export function getRuangAktif(): Ruang[] {
  return dummyRuang.filter((r) => r.aktif);
}

export function getRuangById(id: number): Ruang | undefined {
  return dummyRuang.find((r) => r.id === id);
}

export function getAllPeminjaman(): Peminjaman[] {
  return [...dummyPeminjaman].sort(
    (a, b) => new Date(b.dibuat).getTime() - new Date(a.dibuat).getTime()
  );
}

export function getPeminjamanById(id: number): Peminjaman | undefined {
  return dummyPeminjaman.find((p) => p.id === id);
}

export function getPeminjamanByRuangId(ruangId: number): Peminjaman[] {
  return dummyPeminjaman.filter((p) => p.ruang_id === ruangId);
}

export function getPeminjamanDisetujui(): Peminjaman[] {
  return dummyPeminjaman
    .filter((p) => p.status === "disetujui")
    .sort((a, b) => a.tanggal !== b.tanggal ? a.tanggal.localeCompare(b.tanggal) : a.mulai.localeCompare(b.mulai));
}

export function getPeminjamanDisetujuiByRuang(ruangId: number): Peminjaman[] {
  return dummyPeminjaman
    .filter((p) => p.ruang_id === ruangId && p.status === "disetujui")
    .sort((a, b) => a.tanggal !== b.tanggal ? a.tanggal.localeCompare(b.tanggal) : a.mulai.localeCompare(b.mulai));
}

export function getPeminjamanByStatus(
  status: "semua" | "menunggu" | "disetujui" | "ditolak"
): Peminjaman[] {
  const all = getAllPeminjaman();
  if (status === "semua") return all;
  return all.filter((p) => p.status === status);
}

// Cek bentrok: mulai_baru < selesai_lama AND selesai_baru > mulai_lama
// excludeId digunakan saat admin re-check sebelum approve (kecualikan diri sendiri)
export function cekBentrok(
  ruangId: number,
  tanggal: string,
  mulai: string,
  selesai: string,
  excludeId?: number
): boolean {
  const jadwalDisetujui = dummyPeminjaman.filter(
    (p) => p.ruang_id === ruangId && p.tanggal === tanggal && p.status === "disetujui" && p.id !== excludeId
  );
  return jadwalDisetujui.some((p) => mulai < p.selesai && selesai > p.mulai);
}

export function insertPeminjaman(
  data: Omit<Peminjaman, "id" | "status" | "alasan_tolak" | "dibuat">
): Peminjaman {
  const newPeminjaman: Peminjaman = {
    ...data,
    id: nextPeminjamanId++,
    status: "menunggu",
    alasan_tolak: null,
    dibuat: new Date().toISOString(),
  };
  dummyPeminjaman.push(newPeminjaman);
  return newPeminjaman;
}

export function updateStatusPeminjaman(
  id: number,
  status: "disetujui" | "ditolak",
  alasanTolak?: string
): boolean {
  const idx = dummyPeminjaman.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  dummyPeminjaman[idx].status = status;
  dummyPeminjaman[idx].alasan_tolak = alasanTolak ?? null;
  return true;
}

export function insertRuang(data: Omit<Ruang, "id" | "aktif">): Ruang {
  const existing = dummyRuang.find((r) => r.nama.toLowerCase() === data.nama.toLowerCase());
  if (existing) throw new Error("DUPLICATE_NAME");
  const newRuang: Ruang = { ...data, id: nextRuangId++, aktif: true };
  dummyRuang.push(newRuang);
  return newRuang;
}

export function toggleAktifRuang(id: number): boolean {
  const idx = dummyRuang.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  dummyRuang[idx].aktif = !dummyRuang[idx].aktif;
  return true;
}

// Ruang yang pernah dipinjam (status apapun) tidak boleh dihapus
export function deleteRuang(id: number): "ok" | "has_bookings" | "not_found" {
  const idx = dummyRuang.findIndex((r) => r.id === id);
  if (idx === -1) return "not_found";
  if (dummyPeminjaman.some((p) => p.ruang_id === id)) return "has_bookings";
  dummyRuang.splice(idx, 1);
  return "ok";
}
