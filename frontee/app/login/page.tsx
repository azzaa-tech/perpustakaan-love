"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// Satu pintu login: pilih "Pengguna" atau "Admin"
export default function LoginPage() {
  const router = useRouter();
  const [peran, setPeran] = useState<"siswa" | "admin">("siswa"); // tab yang dipilih
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");   // khusus pengguna
  const [form, setForm] = useState({ nama: "", username: "", password: "", kelas: "", no_hp: "" });
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  function ubah(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Ganti tab Pengguna / Admin
  function pilihPeran(p: "siswa" | "admin") {
    setPeran(p);
    setMode("masuk");
    setError("");
    setSukses("");
    setForm({ nama: "", username: "", password: "", kelas: "", no_hp: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSukses("");

    try {
      // --- DAFTAR (hanya pengguna) ---
      if (mode === "daftar") {
        await api("/auth/register", "POST", form);
        setSukses("Pendaftaran berhasil! Silakan masuk dengan username dan password tadi. ✨");
        setMode("masuk");
        setForm({ ...form, nama: "", kelas: "", no_hp: "", password: "" });
        return;
      }

      // --- MASUK ---
      const data = await api("/auth/login", "POST", {
        username: form.username,
        password: form.password,
      });

      // Cek: akun harus sesuai dengan tab yang dipilih
      if (data.user.role !== peran) {
        setError(
          peran === "admin"
            ? "Akun ini bukan admin. Silakan masuk lewat tab Pengguna."
            : "Akun ini adalah admin. Silakan masuk lewat tab Admin."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const inputStyle =
    "w-full px-4 py-2.5 rounded-2xl bg-[#FFF5F7]/60 border border-[#F66A8A]/25 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#F66A8A] focus:ring-4 focus:ring-[#F66A8A]/15 transition-all duration-200 text-sm";
  const labelStyle = "block text-xs font-semibold text-slate-600 mb-1.5 ml-1";

  return (
    <div className="relative flex justify-center items-center py-10 px-4">
      {/* Efek cahaya pastel lembut */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#F66A8A]/15 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-6 right-1/3 w-48 h-48 bg-[#FCD65D]/20 rounded-full blur-2xl -z-10" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-7 sm:p-8 rounded-3xl border border-[#F66A8A]/25 shadow-xl shadow-[#F66A8A]/10">
        {/* Segmented Control Tab Pengguna / Admin */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#FFF5F7] border border-[#F66A8A]/15 rounded-full mb-6">
          <button
            type="button"
            onClick={() => pilihPeran("siswa")}
            className={`py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              peran === "siswa"
                ? "bg-[#F66A8A] text-white shadow-sm shadow-[#F66A8A]/30"
                : "text-slate-600 hover:text-[#C5465C]"
            }`}
          >
            👤 Pengguna
          </button>
          <button
            type="button"
            onClick={() => pilihPeran("admin")}
            className={`py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              peran === "admin"
                ? "bg-[#F66A8A] text-white shadow-sm shadow-[#F66A8A]/30"
                : "text-slate-600 hover:text-[#C5465C]"
            }`}
          >
            🛠️ Admin
          </button>
        </div>

        {/* Judul */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 mb-2 text-[11px] font-semibold text-[#C5465C] bg-[#FCD65D]/35 rounded-full">
            {peran === "admin" ? "🌸 Area Pengelola" : "❤︎ Our love"}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {peran === "admin"
              ? "Login Admin"
              : mode === "masuk"
              ? "Selamat Datang Kembali!"
              : "Buat Akun Baru"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {peran === "admin"
              ? "Masuk untuk mengelola buku dan transaksi"
              : mode === "masuk"
              ? "Masukkan username dan password kamu"
              : "Lengkapi data dirimu untuk mulai meminjam buku"}
          </p>
        </div>

        {/* Alert Error & Sukses */}
        {error && (
          <div className="bg-[#C5465C]/10 border border-[#C5465C]/25 text-[#C5465C] px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}
        {sukses && (
          <div className="bg-[#FCD65D]/30 border border-[#FCD65D]/60 text-slate-800 px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium">
            {sukses}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kolom tambahan hanya muncul saat pengguna mendaftar */}
          {peran === "siswa" && mode === "daftar" && (
            <div>
              <label className={labelStyle}>Nama Lengkap</label>
              <input
                name="nama"
                className={inputStyle}
                placeholder="Masukkan nama lengkap"
                value={form.nama}
                onChange={ubah}
                required
              />
            </div>
          )}

          <div>
            <label className={labelStyle}>Username</label>
            <input
              name="username"
              className={inputStyle}
              placeholder="Masukkan username"
              value={form.username}
              onChange={ubah}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              className={inputStyle}
              placeholder="••••••••"
              value={form.password}
              onChange={ubah}
              required
            />
          </div>

          {peran === "siswa" && mode === "daftar" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Kelas</label>
                <input
                  name="kelas"
                  className={inputStyle}
                  placeholder="Contoh: XII RPL 2"
                  value={form.kelas}
                  onChange={ubah}
                  required
                />
              </div>
              <div>
                <label className={labelStyle}>No. HP</label>
                <input
                  name="no_hp"
                  className={inputStyle}
                  placeholder="08xxxxxxxxxx"
                  value={form.no_hp}
                  onChange={ubah}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-full font-semibold text-sm text-white bg-[#F66A8A] hover:bg-[#C5465C] shadow-lg shadow-[#F66A8A]/25 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {mode === "daftar" ? "Daftar Sekarang ✨" : "Masuk Sekarang 🌸"}
          </button>
        </form>

        {/* Pindah antara Masuk dan Daftar (hanya untuk pengguna) */}
        {peran === "siswa" && (
          <p className="text-xs text-slate-500 text-center mt-6">
            {mode === "masuk" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              className="text-[#C5465C] hover:text-[#F66A8A] font-bold underline underline-offset-4 cursor-pointer transition"
              onClick={() => {
                setMode(mode === "masuk" ? "daftar" : "masuk");
                setError("");
                setSukses("");
              }}
            >
              {mode === "masuk" ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}