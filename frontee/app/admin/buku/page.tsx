"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Buku = {
  id: number; kode_buku: string; judul: string; penulis: string;
  penerbit: string; tahun_terbit: string; kategori: string; stok: number;
};

const kosong = { kode_buku: "", judul: "", penulis: "", penerbit: "", tahun_terbit: "", kategori: "", stok: "" };

// Admin: CRUD data buku
export default function AdminBuku() {
  const user = useAuth("admin");
  const [buku, setBuku] = useState<Buku[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(kosong);
  const [editId, setEditId] = useState<number | null>(null);
  const [pesan, setPesan] = useState("");

  async function ambilBuku() {
    setBuku(await api(`/books?search=${search}`));
  }

  useEffect(() => {
    if (user) ambilBuku();
  }, [user]);

  function ubah(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // CREATE & UPDATE
  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      ...form,
      penerbit: form.penerbit || null,
      tahun_terbit: form.tahun_terbit || null,
      kategori: form.kategori || null,
      stok: Number(form.stok) || 0,
    };
    try {
      if (editId) await api(`/books/${editId}`, "PUT", data);
      else await api("/books", "POST", data);
      setPesan(editId ? "Data buku berhasil diperbarui ✨" : "Buku baru berhasil ditambahkan 🌸");
      setForm(kosong);
      setEditId(null);
      ambilBuku();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  function mulaiEdit(b: Buku) {
    setEditId(b.id);
    setForm({
      kode_buku: b.kode_buku, judul: b.judul, penulis: b.penulis,
      penerbit: b.penerbit || "", tahun_terbit: b.tahun_terbit || "",
      kategori: b.kategori || "", stok: String(b.stok),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // DELETE
  async function hapus(id: number) {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      await api(`/books/${id}`, "DELETE");
      setPesan("Buku berhasil dihapus 🗑️");
      ambilBuku();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  if (!user) return null;

  const inputStyle =
    "w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7]/60 border border-[#F66A8A]/25 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all duration-200 text-sm";
  const labelStyle = "block text-xs font-semibold text-slate-600 mb-1.5 ml-1";

  return (
    <div className="relative py-8 px-4 max-w-6xl mx-auto">
      {/* Efek cahaya pastel lembut */}
      <div className="absolute top-0 right-12 w-72 h-72 bg-[#F66A8A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-12 left-12 w-64 h-64 bg-[#FCD65D]/15 rounded-full blur-3xl -z-10" />

      {/* Header Halaman */}
      <div className="mb-6">
        <span className="inline-block px-3.5 py-1 mb-2 text-xs font-semibold text-[#C5465C] bg-[#F66A8A]/15 rounded-full">
          📚 Manajemen Koleksi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Kelola Data <span className="text-[#F66A8A]">Buku</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan koleksi baru, perbarui informasi, atau atur stok buku perpustakaan.
        </p>
      </div>

      {/* Notifikasi / Pesan */}
      {pesan && (
        <div className="flex items-center justify-between bg-[#FCD65D]/30 border border-[#FCD65D]/70 text-slate-800 px-4 py-3 rounded-2xl mb-6 text-sm font-medium shadow-sm">
          <span>🌸 {pesan}</span>
          <button
            onClick={() => setPesan("")}
            className="text-xs font-bold text-[#C5465C] hover:underline ml-3 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Form Tambah / Edit Buku */}
      <form
        onSubmit={simpan}
        className="bg-white/95 backdrop-blur-md border border-[#F66A8A]/25 rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#F66A8A]/5 mb-8"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F66A8A]/15">
          <h2 className="text-base font-extrabold text-slate-800">
            {editId ? "✏️ Edit Data Buku" : "➕ Tambah Buku Baru"}
          </h2>
          {editId && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCD65D]/40 text-slate-800">
              Mode Edit Aktif
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelStyle}>Kode Buku *</label>
            <input
              name="kode_buku"
              className={inputStyle}
              placeholder="Contoh: BK-001"
              value={form.kode_buku}
              onChange={ubah}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelStyle}>Judul Buku *</label>
            <input
              name="judul"
              className={inputStyle}
              placeholder="Masukkan judul lengkap buku"
              value={form.judul}
              onChange={ubah}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>Penulis *</label>
            <input
              name="penulis"
              className={inputStyle}
              placeholder="Nama penulis"
              value={form.penulis}
              onChange={ubah}
              required
            />
          </div>
          <div>
            <label className={labelStyle}>Penerbit</label>
            <input
              name="penerbit"
              className={inputStyle}
              placeholder="Nama penerbit"
              value={form.penerbit}
              onChange={ubah}
            />
          </div>
          <div>
            <label className={labelStyle}>Tahun Terbit</label>
            <input
              name="tahun_terbit"
              type="number"
              className={inputStyle}
              placeholder="Contoh: 2024"
              value={form.tahun_terbit}
              onChange={ubah}
            />
          </div>
          <div>
            <label className={labelStyle}>Kategori</label>
            <input
              name="kategori"
              className={inputStyle}
              placeholder="Fiksi, Sains, dll"
              value={form.kategori}
              onChange={ubah}
            />
          </div>
          <div>
            <label className={labelStyle}>Stok *</label>
            <input
              name="stok"
              type="number"
              className={inputStyle}
              placeholder="0"
              value={form.stok}
              onChange={ubah}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-6">
          <button
            type="submit"
            className="px-7 py-2.5 rounded-full font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] shadow-md shadow-[#F66A8A]/25 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {editId ? "💾 Simpan Perubahan" : "✨ Tambah Buku"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(kosong);
              }}
              className="px-6 py-2.5 rounded-full font-semibold text-sm text-slate-700 bg-[#FCD65D]/40 hover:bg-[#FCD65D]/70 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Bar Pencarian Buku */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ambilBuku();
        }}
        className="flex flex-col sm:flex-row gap-2.5 mb-5"
      >
        <input
          className="flex-1 px-5 py-3 rounded-full bg-white border border-[#F66A8A]/30 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all"
          placeholder="🔍 Cari kode, judul, penulis, atau kategori buku..."
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

      {/* Tabel Data Buku */}
      <div className="bg-white/95 backdrop-blur-md border border-[#F66A8A]/25 rounded-3xl shadow-xl shadow-[#F66A8A]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFF5F7] border-b border-[#F66A8A]/20 text-xs font-bold uppercase tracking-wider text-[#C5465C]">
                <th className="py-4 px-4">Kode</th>
                <th className="py-4 px-4">Judul Buku</th>
                <th className="py-4 px-4">Penulis</th>
                <th className="py-4 px-4">Penerbit</th>
                <th className="py-4 px-4 text-center">Tahun</th>
                <th className="py-4 px-4">Kategori</th>
                <th className="py-4 px-4 text-center">Stok</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F66A8A]/10 text-sm text-slate-700">
              {buku.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-[#FFF5F7]/60 transition-colors duration-150"
                >
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">
                    {b.kode_buku}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {b.judul}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{b.penulis}</td>
                  <td className="py-3.5 px-4 text-slate-500">{b.penerbit || "-"}</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {b.tahun_terbit || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    {b.kategori ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FCD65D]/35 text-slate-700">
                        {b.kategori}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        b.stok > 0
                          ? "bg-[#F66A8A]/15 text-[#C5465C]"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {b.stok}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => mulaiEdit(b)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FCD65D]/40 text-slate-800 hover:bg-[#FCD65D]/75 active:scale-95 transition-all cursor-pointer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => hapus(b.id)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C5465C]/15 text-[#C5465C] hover:bg-[#C5465C] hover:text-white active:scale-95 transition-all cursor-pointer"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {buku.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    📚 Belum ada data buku yang tersimpan.
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