const db = require('../config/db');
const bcrypt = require('bcrypt');

// LIHAT SEMUA ANGGOTA (+ pencarian: /api/members?search=fauzan)
exports.getMembers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const [rows] = await db.query(
      "SELECT id, nama, username, kelas, no_hp, created_at FROM users WHERE role = 'siswa' AND (nama LIKE ? OR username LIKE ? OR kelas LIKE ?)",
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIHAT 1 ANGGOTA
exports.getMemberById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, username, kelas, no_hp, created_at FROM users WHERE id = ? AND role = 'siswa'",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TAMBAH ANGGOTA (admin)
exports.createMember = async (req, res) => {
  try {
    const { nama, username, password, kelas, no_hp } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({ message: 'Nama, username, dan password wajib diisi' });
    }

    const passwordAcak = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (nama, username, password, role, kelas, no_hp) VALUES (?, ?, ?, 'siswa', ?, ?)",
      [nama, username, passwordAcak, kelas, no_hp]
    );
    res.status(201).json({ message: 'Anggota berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UBAH ANGGOTA (admin) - password boleh dikosongkan kalau tidak diganti
exports.updateMember = async (req, res) => {
  try {
    const { nama, username, password, kelas, no_hp } = req.body;

    await db.query(
      "UPDATE users SET nama=?, username=?, kelas=?, no_hp=? WHERE id=? AND role='siswa'",
      [nama, username, kelas, no_hp, req.params.id]
    );

    if (password) {
      const passwordAcak = await bcrypt.hash(password, 10);
      await db.query('UPDATE users SET password=? WHERE id=?', [passwordAcak, req.params.id]);
    }

    res.json({ message: 'Anggota berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HAPUS ANGGOTA (admin)
exports.deleteMember = async (req, res) => {
  try {
    const [hasil] = await db.query("DELETE FROM users WHERE id = ? AND role = 'siswa'", [req.params.id]);

    if (hasil.affectedRows === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }
    res.json({ message: 'Anggota berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Anggota tidak bisa dihapus, kemungkinan masih punya data peminjaman' });
  }
};
