// Membatasi akses: hanya admin yang boleh lewat
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Hanya admin yang boleh mengakses' });
  }
  next();
};

module.exports = isAdmin;
