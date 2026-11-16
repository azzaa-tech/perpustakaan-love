import Link from "next/link";

export default function Beranda() {
  return (
    <section className="relative overflow-hidden py-32 px-6 ">

      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-5 text-xs font-semibold tracking-wide text-[#C5465C] bg-[#F66A8A]/15 border border-[#F66A8A]/25 rounded-full">
          🌸 Sistem Perpustakaan Digital
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-800 mb-4 leading-tight">
          Perpustakaan Sekolah{" "}
          <span className="text-[#F66A8A] underline decoration-[#FCD65D] decoration-wavy decoration-2 underline-offset-8">
            Digital
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 mb-9 max-w-lg mx-auto leading-relaxed">
          Pinjam, baca, dan kembalikan buku favoritmu dengan mudah dari mana saja, tanpa perlu antre! 📚✨
        </p>

        <div className="flex justify-center items-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-white bg-[#F66A8A] hover:bg-[#C5465C] shadow-lg shadow-[#F66A8A]/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            Masuk / Daftar ✨
          </Link>
        </div>
      </div>
    </section>
  );
}