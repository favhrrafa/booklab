"use server";

import { redirect } from "next/navigation";
import { cocokkanPassword, setSesiCookie, hapusSesiCookie } from "@/lib/session";

export interface LoginState {
  error?: string;
}

// Login admin: bandingkan password constant-time lalu buat cookie sesi
export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = (formData.get("password") as string) ?? "";

  if (!cocokkanPassword(password)) {
    return { error: "Kata sandi salah. Silakan coba lagi." };
  }

  await setSesiCookie();
  redirect("/admin");
}

// Logout: hapus cookie lalu redirect ke halaman login
export async function logoutAdmin(): Promise<void> {
  await hapusSesiCookie();
  redirect("/login");
}
