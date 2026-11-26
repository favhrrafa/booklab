"use server";

import { requireAdmin } from "@/lib/session";
import { insertRuang, toggleAktifRuang, deleteRuang } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { JenisRuang, RuangFormState, HapusState } from "@/lib/types";

const JENIS_VALID: JenisRuang[] = ["lab", "kelas", "aula"];

export async function tambahRuang(
  _prevState: RuangFormState,
  formData: FormData
): Promise<RuangFormState> {
  await requireAdmin();

  const values = {
    nama:     ((formData.get("nama")     as string) ?? "").trim(),
    jenis:     (formData.get("jenis")     as string) ?? "",
    kapasitas: (formData.get("kapasitas") as string) ?? "",
    lokasi:   ((formData.get("lokasi")   as string) ?? "").trim(),
  };

  const errors: RuangFormState["errors"] = {};

  if (values.nama.length < 3 || values.nama.length > 40)
    errors.nama = "Nama ruang harus antara 3 sampai 40 karakter.";
  if (!JENIS_VALID.includes(values.jenis as JenisRuang))
    errors.jenis = "Pilih jenis ruang yang valid.";
  const kapasitas = parseInt(values.kapasitas, 10);
  if (isNaN(kapasitas) || kapasitas <= 0)
    errors.kapasitas = "Kapasitas harus bilangan bulat lebih dari 0.";
  if (!values.lokasi)
    errors.lokasi = "Lokasi harus diisi.";

  if (Object.keys(errors).length > 0) return { errors, values };

  try {
    await insertRuang({ nama: values.nama, jenis: values.jenis as JenisRuang, kapasitas, lokasi: values.lokasi });
  } catch (err) {
    if (err instanceof Error && err.message === "DUPLICATE_NAME")
      return { errors: { nama: "Nama ruang sudah digunakan. Gunakan nama yang berbeda." }, values };
    console.error("[tambahRuang]", err);
    return { errors: { umum: "Terjadi kesalahan. Silakan coba lagi." }, values };
  }

  revalidatePath("/admin/ruang");
  revalidatePath("/ruang");
  revalidatePath("/");

  return {
    errors: {},
    values: { nama: "", jenis: "", kapasitas: "", lokasi: "" },
    sukses: `Ruang "${values.nama}" berhasil ditambahkan.`,
  };
}

export async function toggleAktif(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseInt((formData.get("ruang_id") as string) ?? "", 10);
  if (!isNaN(id)) {
    await toggleAktifRuang(id);
    revalidatePath("/admin/ruang");
    revalidatePath("/ruang");
    revalidatePath("/");
  }
}

export async function hapusRuang(
  _prevState: HapusState,
  formData: FormData
): Promise<HapusState> {
  await requireAdmin();
  const id = parseInt((formData.get("ruang_id") as string) ?? "", 10);
  if (isNaN(id)) return { error: "ID ruang tidak valid." };

  const hasil = await deleteRuang(id);

  if (hasil === "has_bookings")
    return { error: "Ruang tidak dapat dihapus karena memiliki riwayat peminjaman. Nonaktifkan saja jika tidak ingin digunakan lagi." };
  if (hasil === "not_found")
    return { error: "Ruang tidak ditemukan." };

  revalidatePath("/admin/ruang");
  revalidatePath("/ruang");
  revalidatePath("/");

  return { sukses: "Ruang berhasil dihapus." };
}
