"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Transaksi = {
  id: number; nama_anggota: string; judul: string; tanggal_pinjam: string;
  tanggal_jatuh_tempo: string; tanggal_kembali: string | null; status: string; denda: number;
};
type Anggota = { id: number; nama: string; kelas: string };
type Buku = { id: number; judul: string; stok: number };

// Admin: CRUD transaksi (peminjaman & pengembalian)
export default function AdminTransaksi() {
  const user = useAuth("admin");
  const [data, setData] = useState<Transaksi[]>([]);
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [buku, setBuku] = useState<Buku[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ user_id: "", book_id: "", durasi_hari: "7" });
  const [pesan, setPesan] = useState("");

  async function ambilData() {
    setData(await api(`/borrowings?search=${search}&status=${status}`));
  }
  async function ambilPilihan() {
    setAnggota(await api("/members"));
    setBuku(await api("/books"));
  }

  useEffect(() => {
    if (user) {
      ambilData();
      ambilPilihan();
    }
  }, [user, status]);

  // CREATE: admin meminjamkan buku ke anggota
  async function pinjam(e: React.FormEvent) {
    e.preventDefault();
    try {
      const hasil = await api("/borrowings", "POST", {
        user_id: Number(form.user_id),
        book_id: Number(form.book_id),
        durasi_hari: Number(form.durasi_hari),
      });
      setPesan(hasil.message);
      setForm({ user_id: "", book_id: "", durasi_hari: "7" });
      ambilData();
      ambilPilihan();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  // UPDATE: kembalikan buku
  async function kembalikan(id: number) {
    try {
      const hasil = await api(`/borrowings/${id}/kembali`, "PUT");
      setPesan(`${hasil.message}. Denda: Rp${hasil.denda.toLocaleString("id-ID")}`);
      ambilData();
      ambilPilihan();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  // UPDATE: ubah tanggal jatuh tempo
  async function ubahTempo(id: number) {
    const tgl = prompt("Jatuh tempo baru (format: YYYY-MM-DD)");
    if (!tgl) return;
    try {
      await api(`/borrowings/${id}`, "PUT", { tanggal_jatuh_tempo: tgl + " 23:59:59" });
      setPesan("Jatuh tempo berhasil diubah");
      ambilData();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  // DELETE
  async function hapus(id: number) {
    if (!confirm("Yakin hapus transaksi ini?")) return;
    try {
      await api(`/borrowings/${id}`, "DELETE");
      setPesan("Transaksi berhasil dihapus");
      ambilData();
      ambilPilihan();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  if (!user) return null;

  const field =
    "w-full px-3.5 py-2 rounded-xl bg-[#FFF5F7]/70 border border-[#F66A8A]/25 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#F66A8A] transition";

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">
          Transaksi <span className="text-[#F66A8A]">Peminjaman</span>
        </h1>
        <p className="text-sm text-slate-500">Catat peminjaman baru dan kelola status pengembalian.</p>
      </div>

      {pesan && (
        <div className="flex items-center justify-between bg-[#FCD65D]/35 border border-[#FCD65D] text-slate-800 px-4 py-2.5 rounded-2xl mb-5 text-sm">
          <span>{pesan}</span>
          <button onClick={() => setPesan("")} className="text-xs font-semibold text-[#C5465C] ml-4 cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* Form Input Peminjaman */}
      <form
        onSubmit={pinjam}
        className="bg-white border border-[#F66A8A]/25 rounded-2xl p-5 mb-6 shadow-sm grid md:grid-cols-4 gap-3.5 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Anggota</label>
          <select
            className={field}
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            required
          >
            <option value="">-- pilih anggota --</option>
            {anggota.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nama} {a.kelas && `(${a.kelas})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Buku</label>
          <select
            className={field}
            value={form.book_id}
            onChange={(e) => setForm({ ...form, book_id: e.target.value })}
            required
          >
            <option value="">-- pilih buku --</option>
            {buku.map((b) => (
              <option key={b.id} value={b.id} disabled={b.stok < 1}>
                {b.judul} (stok {b.stok})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Lama pinjam (hari)</label>
          <input
            type="number"
            min={1}
            className={field}
            value={form.durasi_hari}
            onChange={(e) => setForm({ ...form, durasi_hari: e.target.value })}
            required
          />
        </div>

        <button className="w-full py-2 px-5 rounded-xl font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] transition cursor-pointer">
          Pinjamkan
        </button>
      </form>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <input
          className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#F66A8A]/25 text-sm text-slate-800 focus:outline-none focus:border-[#F66A8A]"
          placeholder="Cari nama anggota atau judul buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-xl bg-white border border-[#F66A8A]/25 text-sm text-slate-700 focus:outline-none focus:border-[#F66A8A] sm:w-44"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Semua status</option>
          <option value="dipinjam">Dipinjam</option>
          <option value="dikembalikan">Dikembalikan</option>
        </select>
        <button
          onClick={ambilData}
          className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] transition cursor-pointer"
        >
          Cari
        </button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white border border-[#F66A8A]/25 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF5F7] border-b border-[#F66A8A]/20 text-xs font-semibold text-[#C5465C]">
                <th className="py-3 px-4">Anggota</th>
                <th className="py-3 px-4">Buku</th>
                <th className="py-3 px-3">Tgl Pinjam</th>
                <th className="py-3 px-3">Jatuh Tempo</th>
                <th className="py-3 px-3">Tgl Kembali</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Denda</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F66A8A]/10 text-slate-700">
              {data.map((d) => (
                <tr key={d.id} className="hover:bg-[#FFF5F7]/50">
                  <td className="py-3 px-4 font-medium text-slate-800">{d.nama_anggota}</td>
                  <td className="py-3 px-4">{d.judul}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500">{d.tanggal_pinjam.slice(0, 10)}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-[#C5465C] font-medium">{d.tanggal_jatuh_tempo.slice(0, 10)}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500">{d.tanggal_kembali ? d.tanggal_kembali.slice(0, 10) : "-"}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        d.status === "dipinjam"
                          ? "bg-[#FCD65D]/40 text-slate-800"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">Rp{d.denda.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      {d.status === "dipinjam" && (
                        <button
                          onClick={() => kembalikan(d.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F66A8A] text-white hover:bg-[#C5465C] cursor-pointer"
                        >
                          Kembalikan
                        </button>
                      )}
                      <button
                        onClick={() => ubahTempo(d.id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[#FCD65D]/45 text-slate-800 hover:bg-[#FCD65D]/75 cursor-pointer"
                      >
                        Tempo
                      </button>
                      <button
                        onClick={() => hapus(d.id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[#C5465C]/15 text-[#C5465C] hover:bg-[#C5465C] hover:text-white cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Belum ada data transaksi.
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