// Manajemen sesi admin menggunakan HTTP-only cookie + HMAC-SHA256.
// Hanya digunakan di sisi server (Server Actions, middleware, layout guard).
// Tidak pernah diimpor dari komponen client ("use client").

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 jam

// Ambil SESSION_SECRET dari environment variable
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Untuk mode dummy (sebelum Supabase), gunakan fallback development secret
    // CATATAN: Ganti dengan env var sungguhan sebelum deploy ke produksi!
    return "dummy-dev-secret-ganti-sebelum-deploy";
  }
  return secret;
}

// Buat HMAC-SHA256 signature dari payload string
async function buatSignature(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(getSecret());
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  // Konversi ke hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Verifikasi signature secara constant-time (cegah timing attack)
async function verifikasiSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const expected = await buatSignature(payload);
  if (expected.length !== signature.length) return false;
  // XOR setiap karakter - constant time comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

// Buat nilai cookie sesi: "payload.signature"
export async function buatCookieSesi(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_LIFETIME_MS });
  const signature = await buatSignature(payload);
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

// Set cookie sesi di response
export async function setSesiCookie(): Promise<void> {
  const nilai = await buatCookieSesi();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, nilai, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_MS / 1000,
  });
}

// Hapus cookie sesi (logout)
export async function hapusSesiCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Periksa apakah sesi admin valid
export async function cekSesiAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const parts = cookie.value.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return false; // sesi sudah kadaluarsa
    }
    // Verifikasi bahwa cookie tidak dimanipulasi
    const valid = await verifikasiSignature(
      Buffer.from(payloadB64, "base64").toString(),
      signature
    );
    return valid;
  } catch {
    return false;
  }
}

// Guard: wajib dipanggil di awal setiap Server Action admin.
// Jika tidak terautentikasi, lempar error (tidak lanjut ke DB).
export async function requireAdmin(): Promise<void> {
  const valid = await cekSesiAdmin();
  if (!valid) {
    // Server Action diakses langsung - tolak tanpa redirect
    throw new Error("Akses ditolak. Silakan login terlebih dahulu.");
  }
}

// Guard untuk layout/page: redirect ke /login jika belum login
export async function requireAdminOrRedirect(): Promise<void> {
  const valid = await cekSesiAdmin();
  if (!valid) {
    redirect("/login");
  }
}

// Bandingkan password secara constant-time (cegah timing attack)
export function cocokkanPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123"; // fallback untuk dev dummy
  if (input.length !== adminPassword.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return diff === 0;
}
