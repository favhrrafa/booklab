// Halaman /login – Server Component pembungkus form login admin.

import FormLogin from "./FormLogin";

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Khusus admin sarana-prasarana.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
