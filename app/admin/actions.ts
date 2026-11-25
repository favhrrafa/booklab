"use server";

// Server Actions untuk dashboard admin: approve & reject peminjaman
// requireAdmin() dipanggil di AWAL – lapisan 3 RBAC (Server Action adalah public POST endpoint)

import { requireAdmin } from "@/lib/session";
import { getPeminjamanById, updateStatusPeminjaman, cekBentrok } from "@/lib/dummy-data";
import { revalidatePath } from "next/cache";

export interface AdminActionState {
  error?: string;
  sukses?: string;
}

// Setujui peminjaman: re-check bentrok dulu agar race condition tercover
export async function setujuiPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const id = parseInt(formData.get("peminjaman_id") as string, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const data = getPeminjamanById(id);
  if (!data) return { error: "Peminjaman tidak ditemukan." };

  // Hanya peminjaman berstatus 'menunggu' yang bisa disetujui
  if (data.status !== "menunggu") {
    return { error: "Hanya peminjaman berstatus menunggu yang dapat disetujui." };
  }

  // Re-check bentrok sebelum approve (excludeId = diri sendiri agar tidak self-conflict)
  if (cekBentrok(data.ruang_id, data.tanggal, data.mulai, data.selesai, data.id)) {
    return { error: "Tidak dapat menyetujui: jadwal ini bertumpuk dengan peminjaman yang sudah disetujui pada ruang dan tanggal yang sama." };
  }

  updateStatusPeminjaman(id, "disetujui");
  revalidatePath("/admin");
  revalidatePath("/peminjaman");
  revalidatePath(`/ruang/${data.ruang_id}`);

  return { sukses: "Peminjaman berhasil disetujui." };
}

// Tolak peminjaman: alasan wajib minimal 5 karakter
export async function tolakPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const id = parseInt(formData.get("peminjaman_id") as string, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const alasan = ((formData.get("alasan_tolak") as string) ?? "").trim();
  if (alasan.length < 5) {
    return { error: "Alasan penolakan harus minimal 5 karakter." };
  }

  const data = getPeminjamanById(id);
  if (!data) return { error: "Peminjaman tidak ditemukan." };

  if (data.status !== "menunggu") {
    return { error: "Hanya peminjaman berstatus menunggu yang dapat ditolak." };
  }

  updateStatusPeminjaman(id, "ditolak", alasan);
  revalidatePath("/admin");

  return { sukses: "Peminjaman berhasil ditolak." };
}
