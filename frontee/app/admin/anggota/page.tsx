"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

type Anggota = { id: number; nama: string; username: string; kelas: string; no_hp: string };

const kosong = { nama: "", username: "", password: "", kelas: "", no_hp: "" };

// Admin: CRUD anggota (siswa)
export default function AdminAnggota() {
  const user = useAuth("admin");
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(kosong);
  const [editId, setEditId] = useState<number | null>(null);
  const [pesan, setPesan] = useState("");

  async function ambilAnggota() {
    setAnggota(await api(`/members?search=${search}`));
  }

  useEffect(() => {
    if (user) ambilAnggota();
  }, [user]);

  function ubah(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) await api(`/members/${editId}`, "PUT", form);
      else await api("/members", "POST", form);
      setPesan(editId ? "Anggota berhasil diubah" : "Anggota berhasil ditambahkan");
      setForm(kosong);
      setEditId(null);
      ambilAnggota();
    } catch (err) {
      setPesan((err as Error).message);
    }
  }

  function mulaiEdit(a: Anggota) {
    setEditId(a.id);
    setForm({ nama: a.nama, username: a.username, password: "", kelas: a.kelas || "", no_hp: a.no_hp || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function hapus(id: number) {
    if (!confirm("Yakin hapus anggota ini?")) return;
    try {
      await api(`/members/${id}`, "DELETE");
      setPesan("Anggota berhasil dihapus");
      ambilAnggota();
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
          Kelola <span className="text-[#F66A8A]">Anggota</span>
        </h1>
        <p className="text-sm text-slate-500">Tambah akun siswa baru atau perbarui data anggota perpustakaan.</p>
      </div>

      {pesan && (
        <div className="flex items-center justify-between bg-[#FCD65D]/35 border border-[#FCD65D] text-slate-800 px-4 py-2.5 rounded-2xl mb-5 text-sm">
          <span>{pesan}</span>
          <button onClick={() => setPesan("")} className="text-xs font-semibold text-[#C5465C] ml-4 cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* Form Input Anggota */}
      <form
        onSubmit={simpan}
        className="bg-white border border-[#F66A8A]/25 rounded-2xl p-5 mb-6 shadow-sm grid md:grid-cols-3 gap-3.5"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nama</label>
          <input name="nama" className={field} value={form.nama} onChange={ubah} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
          <input name="username" className={field} value={form.username} onChange={ubah} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Password {editId && <span className="font-normal text-slate-400">(kosongkan jika tidak diganti)</span>}
          </label>
          <input
            name="password"
            type="password"
            className={field}
            value={form.password}
            onChange={ubah}
            required={!editId}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas</label>
          <input name="kelas" className={field} placeholder="Contoh: XII RPL 2" value={form.kelas} onChange={ubah} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">No. HP</label>
          <input name="no_hp" className={field} placeholder="08xxxxxxxxxx" value={form.no_hp} onChange={ubah} />
        </div>
        <div className="flex items-end gap-2">
          <button className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] transition cursor-pointer">
            {editId ? "Simpan Perubahan" : "Tambah Anggota"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(kosong);
              }}
              className="px-4 py-2 rounded-xl font-semibold text-sm text-slate-700 bg-[#FCD65D]/45 hover:bg-[#FCD65D]/75 transition cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ambilAnggota();
        }}
        className="flex gap-2.5 mb-4"
      >
        <input
          className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#F66A8A]/25 text-sm text-slate-800 focus:outline-none focus:border-[#F66A8A]"
          placeholder="Cari nama, username, atau kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] transition cursor-pointer"
        >
          Cari
        </button>
      </form>

      {/* Tabel Data Anggota */}
      <div className="bg-white border border-[#F66A8A]/25 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF5F7] border-b border-[#F66A8A]/20 text-xs font-semibold text-[#C5465C]">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">No. HP</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F66A8A]/10 text-slate-700">
              {anggota.map((a) => (
                <tr key={a.id} className="hover:bg-[#FFF5F7]/50">
                  <td className="py-3 px-4 font-medium text-slate-800">{a.nama}</td>
                  <td className="py-3 px-4 text-slate-600">{a.username}</td>
                  <td className="py-3 px-4">
                    {a.kelas ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FCD65D]/40 text-slate-800">
                        {a.kelas}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{a.no_hp || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => mulaiEdit(a)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[#FCD65D]/45 text-slate-800 hover:bg-[#FCD65D]/75 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => hapus(a.id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[#C5465C]/15 text-[#C5465C] hover:bg-[#C5465C] hover:text-white cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {anggota.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data anggota.
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