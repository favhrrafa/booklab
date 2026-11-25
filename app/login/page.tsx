// Halaman /login – Server Component pembungkus form login admin.

import FormLogin from "./FormLogin";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">PL</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Masuk sebagai Admin</h1>
          <p className="text-sm text-slate-500 mt-1">
            Khusus admin sarana-prasarana.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
