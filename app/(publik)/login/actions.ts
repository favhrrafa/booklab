"use server";

import { redirect } from "next/navigation";
import { cocokkanPassword, setSesiCookie, hapusSesiCookie } from "@/lib/session";
import type { LoginState } from "@/lib/types";

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

export async function logoutAdmin(): Promise<void> {
  await hapusSesiCookie();
  redirect("/login");
}
