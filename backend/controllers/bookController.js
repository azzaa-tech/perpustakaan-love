const db = require('../config/db');

// LIHAT SEMUA BUKU (+ pencarian: /api/books?search=laskar)
exports.getBooks = async (req, res) => {
  try {
    const search = req.query.search || '';
    const [rows] = await db.query(
      'SELECT * FROM books WHERE judul LIKE ? OR penulis LIKE ? OR kode_buku LIKE ? OR kategori LIKE ?',
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIHAT 1 BUKU
exports.getBookById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TAMBAH BUKU (admin)
exports.createBook = async (req, res) => {
  try {
    const { kode_buku, judul, penulis, penerbit, tahun_terbit, kategori, stok } = req.body;

    if (!kode_buku || !judul || !penulis) {
      return res.status(400).json({ message: 'Kode buku, judul, dan penulis wajib diisi' });
    }

    await db.query(
      'INSERT INTO books (kode_buku, judul, penulis, penerbit, tahun_terbit, kategori, stok) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [kode_buku, judul, penulis, penerbit, tahun_terbit, kategori, stok || 0]
    );
    res.status(201).json({ message: 'Buku berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UBAH BUKU (admin)
exports.updateBook = async (req, res) => {
  try {
    const { kode_buku, judul, penulis, penerbit, tahun_terbit, kategori, stok } = req.body;

    const [hasil] = await db.query(
      'UPDATE books SET kode_buku=?, judul=?, penulis=?, penerbit=?, tahun_terbit=?, kategori=?, stok=? WHERE id=?',
      [kode_buku, judul, penulis, penerbit, tahun_terbit, kategori, stok, req.params.id]
    );

    if (hasil.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Buku berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HAPUS BUKU (admin)
exports.deleteBook = async (req, res) => {
  try {
    const [hasil] = await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);

    if (hasil.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Buku berhasil dihapus' });
  } catch (error) {
    // Error ini muncul kalau buku masih tercatat di transaksi
    res.status(500).json({ message: 'Buku tidak bisa dihapus, kemungkinan masih ada di data peminjaman' });
  }
};
