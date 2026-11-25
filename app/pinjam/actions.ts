"use server";

// Server Action untuk pengajuan peminjaman (/pinjam)
// Urutan validasi: required → ruang aktif → tanggal → waktu → jumlah → teks → bentrok

import { getRuangById, getRuangAktif, cekBentrok, insertPeminjaman } from "@/lib/dummy-data";
import { validasiTanggal, validasiWaktu, validasiTeks, validasiJumlahOrang } from "@/lib/validasi";

export interface FormState {
  errors: {
    ruang_id?: string;
    tanggal?: string;
    mulai?: string;
    selesai?: string;
    jumlah_orang?: string;
    peminjam?: string;
    keperluan?: string;
    umum?: string; // error bentrok atau error server tak terduga
  };
  values: {
    ruang_id: string;
    tanggal: string;
    mulai: string;
    selesai: string;
    jumlah_orang: string;
    peminjam: string;
    keperluan: string;
  };
  sukses?: { id: number };
}

export const initialState: FormState = {
  errors: {},
  values: { ruang_id: "", tanggal: "", mulai: "", selesai: "", jumlah_orang: "", peminjam: "", keperluan: "" },
};

export async function ajukanPeminjaman(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const values = {
    ruang_id:     (formData.get("ruang_id")     as string) ?? "",
    tanggal:      (formData.get("tanggal")       as string) ?? "",
    mulai:        (formData.get("mulai")          as string) ?? "",
    selesai:      (formData.get("selesai")        as string) ?? "",
    jumlah_orang: (formData.get("jumlah_orang")  as string) ?? "",
    peminjam:     (formData.get("peminjam")       as string) ?? "",
    keperluan:    (formData.get("keperluan")      as string) ?? "",
  };

  const errors: FormState["errors"] = {};

  // 1. Validasi ruang
  const ruangId = parseInt(values.ruang_id, 10);
  if (!values.ruang_id || isNaN(ruangId)) {
    errors.ruang_id = "Pilih ruang yang akan dipinjam.";
  } else {
    const ruang = getRuangById(ruangId);
    if (!ruang) {
      errors.ruang_id = "Ruang tidak ditemukan.";
    } else if (!ruang.aktif) {
      // Ruang nonaktif tidak bisa dipinjam
      errors.ruang_id = "Ruang ini sedang nonaktif dan tidak dapat dipinjam.";
    }
  }

  // 2. Validasi tanggal
  if (!values.tanggal) {
    errors.tanggal = "Tanggal harus diisi.";
  } else {
    const errTanggal = validasiTanggal(values.tanggal);
    if (errTanggal) errors.tanggal = errTanggal;
  }

  // 3. Validasi waktu
  if (!values.mulai)   errors.mulai   = "Jam mulai harus diisi.";
  if (!values.selesai) errors.selesai = "Jam selesai harus diisi.";
  if (values.mulai && values.selesai) {
    const errWaktu = validasiWaktu(values.mulai, values.selesai);
    if (errWaktu) {
      if (errWaktu.includes("mulai")) errors.mulai = errWaktu;
      else if (errWaktu.includes("selesai")) errors.selesai = errWaktu;
      else errors.mulai = errWaktu;
    }
  }

  // 4. Validasi jumlah orang
  const jumlahOrang = parseInt(values.jumlah_orang, 10);
  if (!values.jumlah_orang || isNaN(jumlahOrang)) {
    errors.jumlah_orang = "Jumlah orang harus diisi dengan angka.";
  } else if (!errors.ruang_id) {
    const ruang = getRuangById(ruangId);
    if (ruang) {
      const errJumlah = validasiJumlahOrang(jumlahOrang, ruang.kapasitas);
      if (errJumlah) errors.jumlah_orang = errJumlah;
    }
  }

  // 5. Validasi teks
  if (!values.peminjam)  errors.peminjam  = "Nama peminjam harus diisi.";
  if (!values.keperluan) errors.keperluan = "Keperluan harus diisi.";
  if (values.peminjam && values.keperluan) {
    const errTeks = validasiTeks(values.peminjam, values.keperluan);
    if (errTeks.peminjam)  errors.peminjam  = errTeks.peminjam;
    if (errTeks.keperluan) errors.keperluan = errTeks.keperluan;
  }

  if (Object.keys(errors).length > 0) return { errors, values };

  // 6. Cek bentrok dengan jadwal yang sudah disetujui pada ruang dan tanggal yang sama
  if (cekBentrok(ruangId, values.tanggal, values.mulai, values.selesai)) {
    return {
      errors: { umum: "Jadwal yang Anda ajukan bertumpuk dengan peminjaman yang sudah disetujui. Silakan pilih waktu lain." },
      values,
    };
  }

  try {
    const baru = insertPeminjaman({
      ruang_id: ruangId,
      peminjam: values.peminjam.trim(),
      keperluan: values.keperluan.trim(),
      tanggal: values.tanggal,
      mulai: values.mulai,
      selesai: values.selesai,
      jumlah_orang: jumlahOrang,
    });
    return { errors: {}, values, sukses: { id: baru.id } };
  } catch (err) {
    console.error("[ajukanPeminjaman]", err);
    return { errors: { umum: "Terjadi kesalahan saat menyimpan pengajuan. Silakan coba lagi." }, values };
  }
}

export async function getRuangAktifAction() {
  return getRuangAktif();
}
