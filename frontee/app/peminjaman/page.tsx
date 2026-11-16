"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Buku = {
  id: number; kode_buku: string; judul: string; penulis: string;
  penerbit: string; kategori: string; stok: number;
};

// Siswa: cari buku & pinjam
export default function PeminjamanPage() {
  const user = useAuth("siswa");
  const [buku, setBuku] = useState<Buku[]>([]);
  const [search, setSearch] = useState("");
  const [pesan, setPesan] = useState("");

  async function ambilBuku() {
    const data = await api(`/books?search=${search}`);
    setBuku(data);
  }

  useEffect(() => {
    if (user) ambilBuku();
  }, [user]);

  async function pinjam(id: number) {
    try {
      const data = await api("/borrowings", "POST", { book_id: id });
      setPesan(data.message + " (jatuh tempo 7 hari lagi) ✨");
      ambilBuku(); // refresh supaya stok berubah
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  if (!user) return null;

  return (
    <div className="relative py-8 px-4 max-w-5xl mx-auto">
      {/* Efek cahaya pastel lembut */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-[#F66A8A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#FCD65D]/15 rounded-full blur-3xl -z-10" />

      {/* Header Halaman */}
      <div className="mb-6">
        <span className="inline-block px-3.5 py-1 mb-2 text-xs font-semibold text-[#C5465C] bg-[#F66A8A]/15 rounded-full">
          📚 Katalog Perpustakaan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Peminjaman <span className="text-[#F66A8A]">Buku</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Temukan buku favoritmu dan pinjam hanya dengan satu klik!
        </p>
      </div>

      {/* Bar Pencarian Kapsul */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ambilBuku();
        }}
        className="flex flex-col sm:flex-row gap-2.5 mb-6"
      >
        <input
          className="flex-1 px-5 py-3 rounded-full bg-white border border-[#F66A8A]/30 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all"
          placeholder="🔍 Cari judul, penulis, atau kode buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-7 py-3 rounded-full font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] shadow-md shadow-[#F66A8A]/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Cari Buku
        </button>
      </form>

      {/* Notifikasi / Pesan */}
      {pesan && (
        <div className="flex items-center justify-between bg-[#FCD65D]/30 border border-[#FCD65D]/70 text-slate-800 px-4 py-3 rounded-2xl mb-5 text-sm font-medium shadow-sm">
          <span>🌸 {pesan}</span>
          <button
            onClick={() => setPesan("")}
            className="text-xs font-bold text-[#C5465C] hover:underline ml-3 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Tabel Katalog Buku */}
      <div className="bg-white/95 backdrop-blur-md border border-[#F66A8A]/25 rounded-3xl shadow-xl shadow-[#F66A8A]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F7] border-b border-[#F66A8A]/20 text-xs font-bold uppercase tracking-wider text-[#C5465C]">
                <th className="py-4 px-5">Kode</th>
                <th className="py-4 px-5">Judul Buku</th>
                <th className="py-4 px-5">Penulis</th>
                <th className="py-4 px-5">Kategori</th>
                <th className="py-4 px-5 text-center">Stok</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F66A8A]/10 text-sm text-slate-700">
              {buku.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-[#FFF5F7]/60 transition-colors duration-150"
                >
                  <td className="py-3.5 px-5 font-mono text-xs font-semibold text-slate-500">
                    {b.kode_buku}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-slate-800">
                    {b.judul}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">{b.penulis}</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FCD65D]/35 text-slate-700">
                      {b.kategori}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        b.stok > 0
                          ? "bg-[#F66A8A]/15 text-[#C5465C]"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {b.stok > 0 ? `${b.stok} tersedia` : "Habis"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      disabled={b.stok < 1}
                      onClick={() => pinjam(b.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        b.stok > 0
                          ? "bg-[#F66A8A] text-white hover:bg-[#C5465C] shadow-sm shadow-[#F66A8A]/30 active:scale-95 cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {b.stok > 0 ? "📖 Pinjam" : "Kosong"}
                    </button>
                  </td>
                </tr>
              ))}
              {buku.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    🥺 Wah, buku yang kamu cari belum ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}