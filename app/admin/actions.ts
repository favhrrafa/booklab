"use server";

import { requireAdmin } from "@/lib/session";
import { getPeminjamanById, updateStatusPeminjaman, cekBentrok } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { AdminActionState } from "@/lib/types";

export async function setujuiPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const id = parseInt(formData.get("peminjaman_id") as string, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const data = await getPeminjamanById(id);
  if (!data) return { error: "Peminjaman tidak ditemukan." };
  if (data.status !== "menunggu") return { error: "Hanya peminjaman berstatus menunggu yang dapat disetujui." };

  const adaBentrok = await cekBentrok(data.ruang_id, data.tanggal, data.mulai, data.selesai, data.id);
  if (adaBentrok) {
    return { error: "Tidak dapat menyetujui: jadwal ini bertumpuk dengan peminjaman yang sudah disetujui pada ruang dan tanggal yang sama." };
  }

  await updateStatusPeminjaman(id, "disetujui");
  revalidatePath("/admin");
  revalidatePath("/peminjaman");
  revalidatePath(`/ruang/${data.ruang_id}`);

  return { sukses: "Peminjaman berhasil disetujui." };
}

export async function tolakPeminjaman(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();

  const id = parseInt(formData.get("peminjaman_id") as string, 10);
  if (isNaN(id)) return { error: "ID tidak valid." };

  const alasan = ((formData.get("alasan_tolak") as string) ?? "").trim();
  if (alasan.length < 5) return { error: "Alasan penolakan harus minimal 5 karakter." };

  const data = await getPeminjamanById(id);
  if (!data) return { error: "Peminjaman tidak ditemukan." };
  if (data.status !== "menunggu") return { error: "Hanya peminjaman berstatus menunggu yang dapat ditolak." };

  await updateStatusPeminjaman(id, "ditolak", alasan);
  revalidatePath("/admin");

  return { sukses: "Peminjaman berhasil ditolak." };
}
