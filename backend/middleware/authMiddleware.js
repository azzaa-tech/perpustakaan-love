// Mengecek apakah user sudah login (punya token yang benar)
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Token dikirim lewat header:  Authorization: Bearer <token>
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Silakan login dulu' });
  }

  const token = header.split(' ')[1];

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data; // isinya: id, nama, role
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = verifyToken;
