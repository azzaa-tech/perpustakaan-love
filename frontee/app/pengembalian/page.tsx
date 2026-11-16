"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Pinjam = {
  id: number; judul: string; kode_buku: string; tanggal_pinjam: string;
  tanggal_jatuh_tempo: string; tanggal_kembali: string | null; status: string; denda: number;
};

// Siswa: lihat peminjaman sendiri & kembalikan buku
export default function PengembalianPage() {
  const user = useAuth("siswa");
  const [data, setData] = useState<Pinjam[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pesan, setPesan] = useState("");

  async function ambilData() {
    const hasil = await api(`/borrowings?search=${search}&status=${status}`);
    setData(hasil);
  }

  useEffect(() => {
    if (user) ambilData();
  }, [user, status]);

  async function kembalikan(id: number) {
    try {
      const hasil = await api(`/borrowings/${id}/kembali`, "PUT");
      setPesan(`${hasil.message}. Denda: Rp${hasil.denda.toLocaleString("id-ID")} ✨`);
      ambilData();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  if (!user) return null;

  return (
    <div className="relative py-8 px-4 max-w-5xl mx-auto">
      {/* Efek cahaya pastel lembut */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-[#F66A8A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#FCD65D]/15 rounded-full blur-3xl -z-10" />

      {/* Header Halaman */}
      <div className="mb-6">
        <span className="inline-block px-3.5 py-1 mb-2 text-xs font-semibold text-[#C5465C] bg-[#F66A8A]/15 rounded-full">
          ↩️ Riwayat & Pengembalian
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Pengembalian <span className="text-[#F66A8A]">Buku</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau tenggat waktu bukumu dan kembalikan sebelum jatuh tempo ya!
        </p>
      </div>

      {/* Bar Pencarian & Filter Status */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ambilData();
        }}
        className="flex flex-col sm:flex-row gap-2.5 mb-6"
      >
        <input
          className="flex-1 px-5 py-3 rounded-full bg-white border border-[#F66A8A]/30 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all"
          placeholder="🔍 Cari judul buku yang dipinjam..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-5 py-3 rounded-full bg-white border border-[#F66A8A]/30 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all cursor-pointer sm:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">✨ Semua Status</option>
          <option value="dipinjam">📖 Dipinjam</option>
          <option value="dikembalikan">✅ Dikembalikan</option>
        </select>
        <button
          type="submit"
          className="px-7 py-3 rounded-full font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] shadow-md shadow-[#F66A8A]/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Cari
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

      {/* Tabel Peminjaman */}
      <div className="bg-white/95 backdrop-blur-md border border-[#F66A8A]/25 rounded-3xl shadow-xl shadow-[#F66A8A]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F7] border-b border-[#F66A8A]/20 text-xs font-bold uppercase tracking-wider text-[#C5465C]">
                <th className="py-4 px-5">Judul Buku</th>
                <th className="py-4 px-4">Tgl Pinjam</th>
                <th className="py-4 px-4">Jatuh Tempo</th>
                <th className="py-4 px-4">Tgl Kembali</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4">Denda</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F66A8A]/10 text-sm text-slate-700">
              {data.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-[#FFF5F7]/60 transition-colors duration-150"
                >
                  <td className="py-3.5 px-5 font-bold text-slate-800">
                    {d.judul}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {d.tanggal_pinjam.slice(0, 10)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#C5465C] whitespace-nowrap">
                    {d.tanggal_jatuh_tempo.slice(0, 10)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {d.tanggal_kembali ? d.tanggal_kembali.slice(0, 10) : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        d.status === "dipinjam"
                          ? "bg-[#FCD65D]/40 text-slate-800"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {d.status === "dipinjam" ? "📖 Dipinjam" : "✨ Dikembalikan"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`font-semibold ${
                        d.denda > 0 ? "text-[#C5465C]" : "text-slate-500"
                      }`}
                    >
                      Rp{d.denda.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    {d.status === "dipinjam" ? (
                      <button
                        onClick={() => kembalikan(d.id)}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F66A8A] text-white hover:bg-[#C5465C] shadow-sm shadow-[#F66A8A]/30 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        ↩️ Kembalikan
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    🌸 Belum ada riwayat peminjaman buku.
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