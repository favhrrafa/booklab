// Lapisan akses database — pengganti lib/dummy-data.ts
// Semua fungsi bersifat async dan hanya boleh dipanggil dari server
// (Server Components, Server Actions, Route Handlers).

import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { Ruang, Peminjaman, JenisRuang, StatusPeminjaman } from "./types";

// ─────────────────────────────────────────────
// RUANG
// ─────────────────────────────────────────────

/** Ambil semua ruang (admin — service_role) */
export async function getAllRuang(): Promise<Ruang[]> {
  const { data, error } = await supabaseAdmin
    .from("ruang")
    .select("*")
    .order("id");
  if (error) throw new Error(`getAllRuang: ${error.message}`);
  return data as Ruang[];
}

/** Ambil semua ruang aktif (publik — anon key, hanya SELECT) */
export async function getRuangAktif(): Promise<Ruang[]> {
  const { data, error } = await supabase
    .from("ruang")
    .select("*")
    .eq("aktif", true)
    .order("nama");
  if (error) throw new Error(`getRuangAktif: ${error.message}`);
  return data as Ruang[];
}

/** Ambil satu ruang berdasarkan id (publik) */
export async function getRuangById(id: number): Promise<Ruang | null> {
  const { data, error } = await supabase
    .from("ruang")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`getRuangById: ${error.message}`);
  }
  return data as Ruang;
}

/** Tambah ruang baru (admin — service_role) */
export async function insertRuang(
  data: Omit<Ruang, "id" | "aktif">
): Promise<Ruang> {
  const { data: inserted, error } = await supabaseAdmin
    .from("ruang")
    .insert({ ...data, aktif: true })
    .select()
    .single();
  if (error) {
    // Kode 23505 = unique_violation (nama duplikat)
    if (error.code === "23505") throw new Error("DUPLICATE_NAME");
    throw new Error(`insertRuang: ${error.message}`);
  }
  return inserted as Ruang;
}

/** Toggle status aktif/nonaktif ruang (admin — service_role) */
export async function toggleAktifRuang(id: number): Promise<boolean> {
  // Baca status saat ini terlebih dahulu
  const { data: ruang, error: readErr } = await supabaseAdmin
    .from("ruang")
    .select("aktif")
    .eq("id", id)
    .single();
  if (readErr || !ruang) return false;

  const { error } = await supabaseAdmin
    .from("ruang")
    .update({ aktif: !ruang.aktif })
    .eq("id", id);
  if (error) throw new Error(`toggleAktifRuang: ${error.message}`);
  return true;
}

/** Hapus ruang (admin — service_role)
 *  Mengembalikan "ok" | "has_bookings" | "not_found"
 */
export async function deleteRuang(
  id: number
): Promise<"ok" | "has_bookings" | "not_found"> {
  // Cek apakah ruang punya riwayat peminjaman
  const { count, error: cekErr } = await supabaseAdmin
    .from("peminjaman")
    .select("id", { count: "exact", head: true })
    .eq("ruang_id", id);
  if (cekErr) throw new Error(`deleteRuang (cek): ${cekErr.message}`);
  if ((count ?? 0) > 0) return "has_bookings";

  const { error } = await supabaseAdmin.from("ruang").delete().eq("id", id);
  if (error) {
    // FK RESTRICT dari DB sebagai fallback (kode 23503)
    if (error.code === "23503") return "has_bookings";
    if (error.code === "PGRST116") return "not_found";
    throw new Error(`deleteRuang: ${error.message}`);
  }
  return "ok";
}

// ─────────────────────────────────────────────
// PEMINJAMAN
// ─────────────────────────────────────────────

/** Ambil semua peminjaman, diurutkan terbaru dulu (admin) */
export async function getAllPeminjaman(): Promise<Peminjaman[]> {
  const { data, error } = await supabaseAdmin
    .from("peminjaman")
    .select("*")
    .order("dibuat", { ascending: false });
  if (error) throw new Error(`getAllPeminjaman: ${error.message}`);
  return data as Peminjaman[];
}

/** Ambil peminjaman berdasarkan status (admin) */
export async function getPeminjamanByStatus(
  status: "semua" | StatusPeminjaman
): Promise<Peminjaman[]> {
  let query = supabaseAdmin
    .from("peminjaman")
    .select("*")
    .order("dibuat", { ascending: false });
  if (status !== "semua") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`getPeminjamanByStatus: ${error.message}`);
  return data as Peminjaman[];
}

/** Ambil satu peminjaman berdasarkan id (server) */
export async function getPeminjamanById(
  id: number
): Promise<Peminjaman | null> {
  const { data, error } = await supabaseAdmin
    .from("peminjaman")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getPeminjamanById: ${error.message}`);
  }
  return data as Peminjaman;
}

/** Ambil jadwal disetujui semua ruang (publik — tanpa nama peminjam) */
export async function getPeminjamanDisetujui(): Promise<Peminjaman[]> {
  const { data, error } = await supabaseAdmin
    .from("peminjaman")
    .select("id, ruang_id, tanggal, mulai, selesai")
    .eq("status", "disetujui")
    .order("tanggal")
    .order("mulai");
  if (error) throw new Error(`getPeminjamanDisetujui: ${error.message}`);
  return data as Peminjaman[];
}

/** Ambil jadwal disetujui untuk satu ruang (publik — tanpa nama peminjam) */
export async function getPeminjamanDisetujuiByRuang(
  ruangId: number
): Promise<Peminjaman[]> {
  const { data, error } = await supabaseAdmin
    .from("peminjaman")
    .select("id, ruang_id, tanggal, mulai, selesai")
    .eq("ruang_id", ruangId)
    .eq("status", "disetujui")
    .order("tanggal")
    .order("mulai");
  if (error) throw new Error(`getPeminjamanDisetujuiByRuang: ${error.message}`);
  return data as Peminjaman[];
}

/** Cek bentrok jadwal dengan peminjaman yang sudah disetujui.
 *  excludeId: kecualikan ID tertentu (dipakai saat re-check sebelum approve).
 *  Kondisi bertumpuk: mulai_baru < selesai_lama AND selesai_baru > mulai_lama
 */
export async function cekBentrok(
  ruangId: number,
  tanggal: string,
  mulai: string,
  selesai: string,
  excludeId?: number
): Promise<boolean> {
  let query = supabaseAdmin
    .from("peminjaman")
    .select("id", { count: "exact", head: true })
    .eq("ruang_id", ruangId)
    .eq("tanggal", tanggal)
    .eq("status", "disetujui")
    .lt("mulai", selesai)   // mulai_lama < selesai_baru
    .gt("selesai", mulai);  // selesai_lama > mulai_baru

  if (excludeId !== undefined) {
    query = query.neq("id", excludeId);
  }

  const { count, error } = await query;
  if (error) throw new Error(`cekBentrok: ${error.message}`);
  return (count ?? 0) > 0;
}

/** Insert pengajuan baru (server) */
export async function insertPeminjaman(
  data: Omit<Peminjaman, "id" | "status" | "alasan_tolak" | "dibuat">
): Promise<Peminjaman> {
  const { data: inserted, error } = await supabaseAdmin
    .from("peminjaman")
    .insert({ ...data, status: "menunggu", alasan_tolak: null })
    .select()
    .single();
  if (error) throw new Error(`insertPeminjaman: ${error.message}`);
  return inserted as Peminjaman;
}

/** Update status peminjaman: disetujui atau ditolak (admin) */
export async function updateStatusPeminjaman(
  id: number,
  status: "disetujui" | "ditolak",
  alasanTolak?: string
): Promise<boolean> {
  const payload: Record<string, unknown> = { status };
  if (status === "ditolak") payload.alasan_tolak = alasanTolak ?? null;

  const { error } = await supabaseAdmin
    .from("peminjaman")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(`updateStatusPeminjaman: ${error.message}`);
  return true;
}

// ─────────────────────────────────────────────
// JOINED QUERIES
// ─────────────────────────────────────────────

export type PeminjamanDenganRuang = Peminjaman & { nama_ruang: string };

/** Statistik ringkasan untuk dashboard admin */
export async function getStatistikAdmin(): Promise<{
  totalRuang: number;
  ruangAktif: number;
  totalPeminjaman: number;
  menunggu: number;
  disetujui: number;
  ditolak: number;
}> {
  const [ruangRes, peminjamanRes] = await Promise.all([
    supabaseAdmin.from("ruang").select("aktif"),
    supabaseAdmin.from("peminjaman").select("status"),
  ]);
  if (ruangRes.error) throw new Error(`getStatistik ruang: ${ruangRes.error.message}`);
  if (peminjamanRes.error) throw new Error(`getStatistik peminjaman: ${peminjamanRes.error.message}`);

  const ruangData = ruangRes.data as { aktif: boolean }[];
  const peminjamanData = peminjamanRes.data as { status: string }[];

  return {
    totalRuang:      ruangData.length,
    ruangAktif:      ruangData.filter((r) => r.aktif).length,
    totalPeminjaman: peminjamanData.length,
    menunggu:        peminjamanData.filter((p) => p.status === "menunggu").length,
    disetujui:       peminjamanData.filter((p) => p.status === "disetujui").length,
    ditolak:         peminjamanData.filter((p) => p.status === "ditolak").length,
  };
}

export async function getAllPeminjamanDenganRuang(
  status?: "semua" | StatusPeminjaman
): Promise<PeminjamanDenganRuang[]> {
  let query = supabaseAdmin
    .from("peminjaman")
    .select("*, ruang(nama)")
    .order("dibuat", { ascending: false });
  if (status && status !== "semua") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`getAllPeminjamanDenganRuang: ${error.message}`);
  return (data as unknown as Array<Peminjaman & { ruang: { nama: string } | { nama: string }[] }>).map((p) => ({
    ...p,
    nama_ruang: Array.isArray(p.ruang)
      ? (p.ruang[0]?.nama ?? `Ruang #${p.ruang_id}`)
      : (p.ruang?.nama ?? `Ruang #${p.ruang_id}`),
  }));
}

/** Ambil jadwal disetujui semua ruang beserta nama ruang (halaman publik /peminjaman) */
export async function getPeminjamanDisetujuiDenganRuang(): Promise<
  Array<Pick<Peminjaman, "id" | "ruang_id" | "tanggal" | "mulai" | "selesai"> & { nama_ruang: string }>
> {
  const { data, error } = await supabaseAdmin
    .from("peminjaman")
    .select("id, ruang_id, tanggal, mulai, selesai, ruang(nama)")
    .eq("status", "disetujui")
    .order("tanggal")
    .order("mulai");
  if (error) throw new Error(`getPeminjamanDisetujuiDenganRuang: ${error.message}`);
  return (
    data as unknown as Array<
      Pick<Peminjaman, "id" | "ruang_id" | "tanggal" | "mulai" | "selesai"> & {
        ruang: { nama: string } | { nama: string }[];
      }
    >
  ).map((p) => {
    const namaRuang = Array.isArray(p.ruang)
      ? (p.ruang[0]?.nama ?? `Ruang #${p.ruang_id}`)
      : (p.ruang?.nama ?? `Ruang #${p.ruang_id}`);
    return { ...p, nama_ruang: namaRuang };
  });
}
