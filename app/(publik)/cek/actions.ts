"use server";

import { getPeminjamanById } from "@/lib/db";
import type { CekState } from "@/lib/types";

export async function cekStatusPeminjaman(
  _prevState: CekState,
  formData: FormData
): Promise<CekState> {
  const idStr         = (formData.get("id")       as string)?.trim() ?? "";
  const peminjamInput = (formData.get("peminjam") as string)?.trim() ?? "";
  const values = { id: idStr, peminjam: peminjamInput };

  if (!idStr || !peminjamInput) {
    return { submitted: true, found: false, error: "ID pengajuan dan nama peminjam harus diisi.", values };
  }

  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) {
    return { submitted: true, found: false, error: "Data tidak ditemukan. Periksa kembali ID dan nama Anda.", values };
  }

  const data = await getPeminjamanById(id);

  if (!data || data.peminjam !== peminjamInput) {
    return { submitted: true, found: false, error: "Data tidak ditemukan. Periksa kembali ID dan nama Anda.", values };
  }

  return { submitted: true, found: true, status: data.status, alasan_tolak: data.alasan_tolak, values };
}
