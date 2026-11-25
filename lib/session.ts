// Manajemen sesi admin: HTTP-only cookie + HMAC-SHA256
// Hanya digunakan di sisi server – tidak pernah diimpor dari "use client"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 jam

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fallback untuk dev lokal – wajib diganti dengan env var di produksi
    return "dummy-dev-secret-ganti-sebelum-deploy";
  }
  return secret;
}

// Buat HMAC-SHA256 dari payload string menggunakan Web Crypto API
async function buatSignature(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Perbandingan constant-time – cegah timing attack
async function verifikasiSignature(payload: string, signature: string): Promise<boolean> {
  const expected = await buatSignature(payload);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

// Format cookie: "base64(payload).hmac"
export async function buatCookieSesi(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_LIFETIME_MS });
  const signature = await buatSignature(payload);
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

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

export async function hapusSesiCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function cekSesiAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;

  const parts = cookie.value.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
    return await verifikasiSignature(Buffer.from(payloadB64, "base64").toString(), signature);
  } catch {
    return false;
  }
}

// Lapisan 3 RBAC: wajib dipanggil di awal setiap Server Action admin
// Melempar error jika tidak terautentikasi – Server Action tidak dilanjutkan
export async function requireAdmin(): Promise<void> {
  const valid = await cekSesiAdmin();
  if (!valid) {
    throw new Error("Akses ditolak. Silakan login terlebih dahulu.");
  }
}

// Lapisan 2 RBAC: dipakai di layout admin – redirect ke /login jika belum login
export async function requireAdminOrRedirect(): Promise<void> {
  const valid = await cekSesiAdmin();
  if (!valid) redirect("/login");
}

// Perbandingan password constant-time – cegah timing attack
export function cocokkanPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (input.length !== adminPassword.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return diff === 0;
}
