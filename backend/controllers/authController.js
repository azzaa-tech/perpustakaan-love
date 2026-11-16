const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// DAFTAR (siswa mendaftar jadi anggota)
exports.register = async (req, res) => {
  try {
    const { nama, username, password, kelas, no_hp } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({ message: 'Nama, username, dan password wajib diisi' });
    }

    // Cek username sudah dipakai atau belum
    const [cek] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (cek.length > 0) {
      return res.status(400).json({ message: 'Username sudah dipakai' });
    }

    // Password diacak dulu sebelum disimpan
    const passwordAcak = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (nama, username, password, role, kelas, no_hp) VALUES (?, ?, ?, 'siswa', ?, ?)",
      [nama, username, passwordAcak, kelas || null, no_hp || null]
    );

    res.status(201).json({ message: 'Pendaftaran berhasil, silakan login' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN (admin dan siswa)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = rows[0];

    // Cocokkan password
    const cocok = await bcrypt.compare(password, user.password);
    if (!cocok) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login berhasil',
      token: token,
      user: { id: user.id, nama: user.nama, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
