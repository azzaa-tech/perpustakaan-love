-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 16 Nov 2026 pada 16.06
-- Versi server: 8.4.3
-- Versi PHP: 8.5.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `peminjaman`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `kode_buku` varchar(30) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `penulis` varchar(100) NOT NULL,
  `penerbit` varchar(100) DEFAULT NULL,
  `tahun_terbit` year DEFAULT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `books`
--

INSERT INTO `books` (`id`, `kode_buku`, `judul`, `penulis`, `penerbit`, `tahun_terbit`, `kategori`, `stok`, `created_at`) VALUES
(1, 'BK-001', 'Langkah pulang', 'Andrea', 'Erlangga', '2005', 'Novel', 4, '2026-11-16 11:07:39'),
(2, 'BK-004', 'Matematika Kelas XII', 'Tim Kemdikbud', 'Kemdikbud', '2022', 'Pelajaran', 10, '2026-11-16 11:07:39'),
(3, 'BK-102', 'matahari telah terbit', 'anwar', 'erlangga', '2008', 'novel', 10, '2026-11-16 15:03:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `tanggal_pinjam` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tanggal_jatuh_tempo` datetime NOT NULL,
  `tanggal_kembali` datetime DEFAULT NULL,
  `status` enum('dipinjam','dikembalikan') NOT NULL DEFAULT 'dipinjam',
  `denda` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `book_id`, `tanggal_pinjam`, `tanggal_jatuh_tempo`, `tanggal_kembali`, `status`, `denda`, `created_at`) VALUES
(1, 3, 1, '2026-11-16 23:00:48', '2026-11-23 23:00:48', NULL, 'dipinjam', 0, '2026-11-16 15:00:48'),
(2, 2, 2, '2026-11-16 23:01:17', '2026-11-24 23:01:17', '2026-11-16 23:28:44', 'dikembalikan', 0, '2026-11-16 15:01:17'),
(3, 2, 1, '2026-11-16 23:02:19', '2026-11-23 23:02:19', '2026-11-16 23:28:45', 'dikembalikan', 0, '2026-11-16 15:02:19'),
(4, 2, 1, '2026-11-16 23:55:19', '2026-11-23 23:55:19', '2026-11-16 23:55:54', 'dikembalikan', 0, '2026-11-16 15:55:19'),
(5, 2, 2, '2026-11-16 23:55:25', '2026-11-23 23:55:25', '2026-11-16 23:55:44', 'dikembalikan', 0, '2026-11-16 15:55:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','siswa') NOT NULL DEFAULT 'siswa',
  `kelas` varchar(20) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `username`, `password`, `role`, `kelas`, `no_hp`, `created_at`) VALUES
(1, 'adney', 'admin1', '$2a$10$bavzQVnw1Fpm51qNwDXRiexXpuEX/qWGM66XNGDEqX.cWgSSf4PIG', 'admin', NULL, NULL, '2026-11-16 11:04:41'),
(2, 'Ahmad Fauzan', 'fauzan', '$2a$10$iZsBnCCKrzy.9z8YM.rUS.o7AlL1UT5t1DZj2HO1GcDlp9Rw69Cn6', 'siswa', 'XII RPL 2', '081345678901', '2026-11-16 11:04:41'),
(3, 'Salsabila Al-Zahir', 'azzha', '$2b$10$HivhALMZMhBQyIybLqMM3.EY9KL6Og2BrI38Fsix.8cdKjzwR6R9W', 'siswa', 'XII RPL 4', NULL, '2026-11-16 14:10:16'),
(4, 'administator', 'admin', '$2a$10$sAYLemwlL8N9UPNBo7VElukPe2mLW6R39b2cE.Cr5QhaZOrg5ru.2', 'admin', NULL, NULL, '2026-11-16 14:14:21'),
(5, 'Azzhlene azhael', 'azel', '$2b$10$HeHSL67mgts1JaNKsxdMVOH5BI68DSBEThgKAWI.BfiGQmZCymyv2', 'siswa', 'XII RPL 4', '0854367879', '2026-11-16 15:04:17');

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_buku` (`kode_buku`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_trx_user` (`user_id`),
  ADD KEY `fk_trx_book` (`book_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_trx_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
