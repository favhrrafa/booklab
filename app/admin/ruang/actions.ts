"use server";

// Server Actions untuk manajemen ruang (/admin/ruang).
// requireAdmin() dipanggil di AWAL setiap action – lapisan 3 RBAC.

import { requireAdmin } from "@/lib/session";
import {
  insertRuang,
  toggleAktifRuang,
  deleteRuang,
} from "@/lib/dummy-data";
import { JenisRuang } from "@/lib/types";
import { revalidatePath } from "next/cache";

export interface RuangFormState {
  errors: {
    nama?: string;
    jenis?: string;
    kapasitas?: string;
    lokasi?: string;
    umum?: string;
  };
  values: {
    nama: string;
    jenis: string;
    kapasitas: string;
    lokasi: string;
  };
  sukses?: string;
}

export const ruangInitialState: RuangFormState = {
  errors: {},
  values: { nama: "", jenis: "", kapasitas: "", lokasi: "" },
};

const JENIS_VALID: JenisRuang[] = ["lab", "kelas", "aula"];

// Action: Tambah ruang baru
export async function tambahRuang(
  _prevState: RuangFormState,
  formData: FormData
): Promise<RuangFormState> {
  await requireAdmin();

  const values = {
    nama: ((formData.get("nama") as string) ?? "").trim(),
    jenis: (formData.get("jenis") as string) ?? "",
    kapasitas: (formData.get("kapasitas") as string) ?? "",
    lokasi: ((formData.get("lokasi") as string) ?? "").trim(),
  };

  const errors: RuangFormState["errors"] = {};

  // Validasi nama
  if (values.nama.length < 3 || values.nama.length > 40) {
    errors.nama = "Nama ruang harus antara 3 sampai 40 karakter.";
  }

  // Validasi jenis
  if (!JENIS_VALID.includes(values.jenis as JenisRuang)) {
    errors.jenis = "Pilih jenis ruang yang valid.";
  }

  // Validasi kapasitas
  const kapasitas = parseInt(values.kapasitas, 10);
  if (isNaN(kapasitas) || kapasitas <= 0) {
    errors.kapasitas = "Kapasitas harus bilangan bulat lebih dari 0.";
  }

  // Validasi lokasi
  if (!values.lokasi) {
    errors.lokasi = "Lokasi harus diisi.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  try {
    insertRuang({
      nama: values.nama,
      jenis: values.jenis as JenisRuang,
      kapasitas,
      lokasi: values.lokasi,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "DUPLICATE_NAME") {
      return {
        errors: { nama: "Nama ruang sudah digunakan. Gunakan nama yang berbeda." },
        values,
      };
    }
    console.error("[tambahRuang]", err);
    return {
      errors: { umum: "Terjadi kesalahan. Silakan coba lagi." },
      values,
    };
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

// Action: Toggle aktif/nonaktif ruang
export async function toggleAktif(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseInt((formData.get("ruang_id") as string) ?? "", 10);
  if (!isNaN(id)) {
    toggleAktifRuang(id);
    revalidatePath("/admin/ruang");
    revalidatePath("/ruang");
    revalidatePath("/");
  }
}

// Action: Hapus ruang
export interface HapusState {
  error?: string;
  sukses?: string;
}

export async function hapusRuang(
  _prevState: HapusState,
  formData: FormData
): Promise<HapusState> {
  await requireAdmin();
  const id = parseInt((formData.get("ruang_id") as string) ?? "", 10);
  if (isNaN(id)) return { error: "ID ruang tidak valid." };

  const hasil = deleteRuang(id);

  if (hasil === "has_bookings") {
    return {
      error:
        "Ruang tidak dapat dihapus karena memiliki riwayat peminjaman. Nonaktifkan ruang saja jika tidak ingin digunakan lagi.",
    };
  }
  if (hasil === "not_found") {
    return { error: "Ruang tidak ditemukan." };
  }

  revalidatePath("/admin/ruang");
  revalidatePath("/ruang");
  revalidatePath("/");

  return { sukses: "Ruang berhasil dihapus." };
}
