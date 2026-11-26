// Halaman /login – Server Component pembungkus form login admin.

import FormLogin from "./FormLogin";
import { Shield, DoorOpen } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-600/20">
            <DoorOpen size={26} className="text-white" aria-hidden />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Masuk sebagai Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Khusus admin sarana-prasarana.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-6">
          <FormLogin />
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield size={12} aria-hidden />
          Halaman ini dilindungi dan terverifikasi server.
        </p>
      </div>
    </div>
  );
}
