"use server";

// Server Actions untuk fitur admin login & logout.

import { redirect } from "next/navigation";
import { cocokkanPassword, setSesiCookie, hapusSesiCookie } from "@/lib/session";

export interface LoginState {
  error?: string;
}

// Action login admin
export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = (formData.get("password") as string) ?? "";

  // Bandingkan password secara constant-time (cegah timing attack)
  const cocok = cocokkanPassword(password);

  if (!cocok) {
    return { error: "Kata sandi salah. Silakan coba lagi." };
  }

  // Password benar – buat sesi cookie
  await setSesiCookie();

  // Redirect ke dashboard admin
  redirect("/admin");
}

// Action logout admin
export async function logoutAdmin(): Promise<void> {
  await hapusSesiCookie();
  redirect("/login");
}
