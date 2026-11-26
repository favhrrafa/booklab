import Navbar from "@/components/Navbar";

export default function PublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-400">
        PinjamLab &copy; {new Date().getFullYear()} &mdash; Sistem Peminjaman
        Ruang &amp; Laboratorium
      </footer>
    </>
  );
}
