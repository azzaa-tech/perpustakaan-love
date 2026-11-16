// Controller untuk tabel "transactions" (peminjaman & pengembalian)
const db = require('../config/db');

// Query dasar: gabungkan data peminjaman + nama anggota + judul buku
const queryDasar = `
  SELECT t.*, u.nama AS nama_anggota, b.judul, b.kode_buku
  FROM transactions t
  JOIN users u ON u.id = t.user_id
  JOIN books b ON b.id = t.book_id
`;

// LIHAT SEMUA PEMINJAMAN (+ pencarian: ?search=laskar&status=dipinjam)
// Admin melihat semua, siswa hanya melihat miliknya sendiri
exports.getBorrowings = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';

    let sql = queryDasar + ' WHERE (u.nama LIKE ? OR b.judul LIKE ? OR b.kode_buku LIKE ?)';
    const params = [`%${search}%`, `%${search}%`, `%${search}%`];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }
    if (req.user.role === 'siswa') {
      sql += ' AND t.user_id = ?';
      params.push(req.user.id);
    }

    const [rows] = await db.query(sql + ' ORDER BY t.id DESC', params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIHAT 1 PEMINJAMAN
exports.getBorrowingById = async (req, res) => {
  try {
    const [rows] = await db.query(queryDasar + ' WHERE t.id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }
    // Siswa tidak boleh melihat punya orang lain
    if (req.user.role === 'siswa' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Ini bukan data peminjaman kamu' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PINJAM BUKU
// Siswa: kirim { book_id }
// Admin : kirim { book_id, user_id }
exports.createBorrowing = async (req, res) => {
  try {
    const book_id = req.body.book_id;
    const durasi = req.body.durasi_hari || 7; // default 7 hari

    // Kalau siswa, otomatis pakai id dia sendiri
    const user_id = req.user.role === 'admin' ? req.body.user_id : req.user.id;

    if (!book_id || !user_id) {
      return res.status(400).json({ message: 'Data belum lengkap (book_id / user_id)' });
    }

    // Cek buku & stok
    const [buku] = await db.query('SELECT * FROM books WHERE id = ?', [book_id]);
    if (buku.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    if (buku[0].stok < 1) {
      return res.status(400).json({ message: 'Stok buku habis' });
    }

    // Simpan peminjaman
    await db.query(
      'INSERT INTO transactions (user_id, book_id, tanggal_jatuh_tempo) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))',
      [user_id, book_id, durasi]
    );

    // Kurangi stok buku
    await db.query('UPDATE books SET stok = stok - 1 WHERE id = ?', [book_id]);

    res.status(201).json({ message: 'Peminjaman berhasil' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// KEMBALIKAN BUKU (denda Rp1.000 per hari terlambat)
exports.returnBorrowing = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }

    const data = rows[0];

    if (req.user.role === 'siswa' && data.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Ini bukan data peminjaman kamu' });
    }
    if (data.status === 'dikembalikan') {
      return res.status(400).json({ message: 'Buku sudah dikembalikan' });
    }

    // Hitung denda: selisih hari terlambat x 1000
    await db.query(
      `UPDATE transactions
       SET status = 'dikembalikan',
           tanggal_kembali = NOW(),
           denda = GREATEST(DATEDIFF(CURDATE(), DATE(tanggal_jatuh_tempo)), 0) * 1000
       WHERE id = ?`,
      [data.id]
    );

    // Tambah lagi stok buku
    await db.query('UPDATE books SET stok = stok + 1 WHERE id = ?', [data.book_id]);

    const [hasil] = await db.query('SELECT denda FROM transactions WHERE id = ?', [data.id]);
    res.json({ message: 'Buku berhasil dikembalikan', denda: hasil[0].denda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UBAH JATUH TEMPO (admin)  body: { "tanggal_jatuh_tempo": "2026-12-31 23:59:59" }
exports.updateBorrowing = async (req, res) => {
  try {
    const [hasil] = await db.query(
      'UPDATE transactions SET tanggal_jatuh_tempo = ? WHERE id = ?',
      [req.body.tanggal_jatuh_tempo, req.params.id]
    );
    if (hasil.affectedRows === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }
    res.json({ message: 'Data peminjaman berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HAPUS PEMINJAMAN (admin)
exports.deleteBorrowing = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
    }

    // Kalau buku belum dikembalikan, stok dikembalikan dulu
    if (rows[0].status === 'dipinjam') {
      await db.query('UPDATE books SET stok = stok + 1 WHERE id = ?', [rows[0].book_id]);
    }

    await db.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Data peminjaman berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
