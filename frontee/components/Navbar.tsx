"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@/lib/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Cek ulang data login setiap pindah halaman
  useEffect(() => {
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null);
  }, [pathname]);

  function logout() {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  }

  // Menu default saat belum login: hanya Daftar dan Login
  let menu = [
    { nama: "Daftar", href: "/register" }, // Sesuaikan jika route-nya "/daftar"
    { nama: "Login", href: "/login" },
  ];

  if (user?.role === "siswa") {
    menu = [
      { nama: "Dashboard", href: "/dashboard" },
      { nama: "Peminjaman", href: "/peminjaman" },
      { nama: "Pengembalian", href: "/pengembalian" },
    ];
  }
  if (user?.role === "admin") {
    menu = [
      { nama: "Dashboard", href: "/admin" },
      { nama: "Data Buku", href: "/admin/buku" },
      { nama: "Transaksi", href: "/admin/transaksi" },
      { nama: "Anggota", href: "/admin/anggota" },
    ];
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-10">
      <nav className="max-w-5xl mx-auto bg-[#FFDDDD]/90 backdrop-blur-md border border-[#F66A8A]/25 shadow-lg shadow-[#F66A8A]/10 rounded-full px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/"}
            className="font-extrabold text-lg text-[#C5465C] flex items-center gap-2 tracking-tight hover:opacity-85 transition"
          >
            <span>❤︎ Our</span>
            <span className="text-[#F66A8A]">Archieve</span>
          </Link>

          <div className="flex flex-wrap items-center gap-1.5">
            {menu.map((m) => {
              const isActive = pathname === m.href;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#F66A8A] text-white font-semibold shadow-sm shadow-[#F66A8A]/30"
                      : "text-slate-600 font-medium hover:bg-[#F66A8A]/15 hover:text-[#C5465C]"
                  }`}
                >
                  {m.nama}
                </Link>
              );
            })}

            {user && (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-[#F66A8A]/20">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCD65D]/35 text-slate-700">
                  🌸 {user.nama} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-full text-sm bg-[#C5465C] text-white font-medium hover:bg-[#a8384c] active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}