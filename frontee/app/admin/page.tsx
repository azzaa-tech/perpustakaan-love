"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

// Dashboard admin -> ringkasan + pilih menu
export default function DashboardAdmin() {
  const user = useAuth("admin");
  const [jumlah, setJumlah] = useState({ buku: 0, anggota: 0, dipinjam: 0 });

  useEffect(() => {
    if (!user) return;
    async function ambil() {
      const buku = await api("/books");
      const anggota = await api("/members");
      const pinjam = await api("/borrowings?status=dipinjam");
      setJumlah({ buku: buku.length, anggota: anggota.length, dipinjam: pinjam.length });
    }
    ambil();
  }, [user]);

  if (!user) return null;

  const statistik = [
    { label: "Judul Buku", nilai: jumlah.buku, ikon: "📚", bg: "bg-[#FFF5F7]", border: "border-[#F66A8A]/25", teks: "text-[#F66A8A]" },
    { label: "Total Anggota", nilai: jumlah.anggota, ikon: "👥", bg: "bg-[#FFFBEB]", border: "border-[#FCD65D]/60", teks: "text-[#C5465C]" },
    { label: "Sedang Dipinjam", nilai: jumlah.dipinjam, ikon: "📖", bg: "bg-[#FFF5F7]", border: "border-[#F66A8A]/25", teks: "text-[#F66A8A]" },
  ];

  const menu = [
    { ikon: "📚", judul: "Kelola Data Buku", isi: "Tambah, ubah, dan hapus koleksi buku perpustakaan.", href: "/admin/buku" },
    { ikon: "🔁", judul: "Transaksi Peminjaman", isi: "Pantau peminjaman & proses pengembalian buku.", href: "/admin/transaksi" },
    { ikon: "👥", judul: "Kelola Anggota", isi: "Tambah, ubah, dan atur data siswa anggota.", href: "/admin/anggota" },
  ];

  return (
    <div className="relative py-8 px-4 max-w-5xl mx-auto">
      {/* Efek cahaya pastel lembut */}
      <div className="absolute top-0 left-12 w-72 h-72 bg-[#F66A8A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-6 right-12 w-64 h-64 bg-[#FCD65D]/15 rounded-full blur-3xl -z-10" />

      {/* Banner Sapaan Admin */}
      <div className="bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFFBEB] border border-[#F66A8A]/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <span className="inline-block px-3.5 py-1 mb-2.5 text-xs font-semibold text-[#C5465C] bg-[#F66A8A]/15 rounded-full">
          🛠️ Panel Pengelola
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
          Dashboard <span className="text-[#F66A8A]">Admin</span> ✨
        </h1>
        <p className="text-sm text-slate-600">
          Halo, <span className="font-semibold text-[#C5465C]">{user.nama}</span>! Berikut ringkasan aktivitas perpustakaan hari ini.
        </p>
      </div>

      {/* Kartu Statistik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statistik.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className="w-11 h-11 mx-auto mb-3 rounded-2xl bg-white shadow-xs flex items-center justify-center text-xl">
              {s.ikon}
            </div>
            <p className={`text-3xl sm:text-4xl font-extrabold ${s.teks} mb-1`}>
              {s.nilai}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Kartu Menu Navigasi Admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {menu.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group bg-white border border-[#F66A8A]/25 rounded-3xl p-6 shadow-lg shadow-[#F66A8A]/5 hover:border-[#F66A8A] hover:shadow-xl hover:shadow-[#F66A8A]/15 hover:-translate-y-1 transition-all duration-200 block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F7] border border-[#F66A8A]/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-[#F66A8A] group-hover:text-white transition-all duration-200">
              {m.ikon}
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 group-hover:text-[#C5465C] mb-1.5 transition-colors">
              {m.judul}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {m.isi}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F66A8A] group-hover:translate-x-1 transition-transform">
              Buka Menu →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}