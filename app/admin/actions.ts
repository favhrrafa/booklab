"use server";

// Server Actions untuk dashboard admin: approve & reject peminjaman.
// requireAdmin() dipanggil di AWAL setiap action – lapisan 3 RBAC.

import { requireAdmin } from "@/lib/session";
import {
  getPeminjamanById,
  updateStatusPeminjaman,
  cekBentrok,
} from "@/lib/dummy-data";
import { revalidatePath } from "next/cache";

export interface AdminActionState {
  error?: string;
  sukses?: string;
}

// Action: Setujui peminjaman
export async function setujuiPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  // Lapisan 3 RBAC: tolak jika bukan admin terautentikasi
  await requireAdmin();

  const idStr = formData.get("peminjaman_id") as string;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const data = getPeminjamanById(id);
  if (!data) return { error: "Peminjaman tidak ditemukan." };

  // Hanya peminjaman berstatus 'menunggu' yang bisa disetujui
  if (data.status !== "menunggu") {
    return { error: "Hanya peminjaman berstatus menunggu yang dapat disetujui." };
  }

  // Re-check bentrok sebelum approve (cegah race condition)
  // Exclude diri sendiri dari pengecekan (excludeId = data.id)
  const adaBentrok = cekBentrok(
    data.ruang_id,
    data.tanggal,
    data.mulai,
    data.selesai,
    data.id
  );

  if (adaBentrok) {
    return {
      error:
        "Tidak dapat menyetujui: jadwal ini bertumpuk dengan peminjaman yang sudah disetujui pada ruang dan tanggal yang sama.",
    };
  }

  updateStatusPeminjaman(id, "disetujui");
  revalidatePath("/admin");
  revalidatePath("/peminjaman");
  revalidatePath(`/ruang/${data.ruang_id}`);

  return { sukses: "Peminjaman berhasil disetujui." };
}

// Action: Tolak peminjaman
export async function tolakPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const idStr = formData.get("peminjaman_id") as string;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const alasanRaw = (formData.get("alasan_tolak") as string) ?? "";
  const alasan = alasanRaw.trim();

  // Alasan penolakan minimal 5 karakter
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
