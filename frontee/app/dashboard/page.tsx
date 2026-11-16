"use client";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

// Dashboard siswa -> pilih menu
export default function DashboardSiswa() {
  const user = useAuth("siswa");
  if (!user) return null;

  return (
    <div className="relative py-8 px-4 max-w-4xl mx-auto">
      {/* Dekorasi cahaya pastel lembut di latar belakang */}
      <div className="absolute top-0 left-10 w-64 h-64 bg-[#F66A8A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#FCD65D]/15 rounded-full blur-3xl -z-10" />

      {/* Header Sapaan */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFFBEB] border border-[#F66A8A]/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold text-[#C5465C] bg-[#F66A8A]/15 rounded-full">
          🌸 Ruang Baca Siswa
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-1.5">
          Halo, <span className="text-[#F66A8A]">{user.nama}</span>! 👋✨
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Mau baca buku seru apa hari ini? Pilih menu di bawah untuk mulai.
        </p>
      </div>

      {/* Kartu Pilihan Menu */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Card Peminjaman */}
        <Link
          href="/peminjaman"
          className="group relative bg-white border border-[#F66A8A]/25 rounded-3xl p-6 sm:p-7 shadow-lg shadow-[#F66A8A]/5 hover:border-[#F66A8A] hover:shadow-xl hover:shadow-[#F66A8A]/15 hover:-translate-y-1 transition-all duration-200 block overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFF5F7] border border-[#F66A8A]/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-[#F66A8A] group-hover:text-white transition-all duration-200">
            📖
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-[#C5465C] mb-1.5 transition-colors">
            Peminjaman Buku
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Cari judul favoritmu di katalog dan pinjam bukunya dengan cepat.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F66A8A] group-hover:translate-x-1 transition-transform">
            Mulai Pinjam →
          </span>
        </Link>

        {/* Card Pengembalian */}
        <Link
          href="/pengembalian"
          className="group relative bg-white border border-[#FCD65D]/60 rounded-3xl p-6 sm:p-7 shadow-lg shadow-[#FCD65D]/10 hover:border-[#F66A8A] hover:shadow-xl hover:shadow-[#F66A8A]/15 hover:-translate-y-1 transition-all duration-200 block overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FCD65D]/25 border border-[#FCD65D]/50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-[#FCD65D] transition-all duration-200">
            ↩
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-[#C5465C] mb-1.5 transition-colors">
            Pengembalian Buku
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Cek daftar buku yang sedang kamu pinjam dan kembalikan tepat waktu.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C5465C] group-hover:translate-x-1 transition-transform">
            Lihat Pinjaman →
          </span>
        </Link>
      </div>
    </div>
  );
}