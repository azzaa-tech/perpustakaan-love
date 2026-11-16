const express = require('express');
const router = express.Router();
const book = require('../controllers/bookController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/roleMiddleware');

// Semua user yang login boleh melihat & mencari buku
router.get('/', verifyToken, book.getBooks);
router.get('/:id', verifyToken, book.getBookById);

// Hanya admin yang boleh tambah, ubah, hapus
router.post('/', verifyToken, isAdmin, book.createBook);
router.put('/:id', verifyToken, isAdmin, book.updateBook);
router.delete('/:id', verifyToken, isAdmin, book.deleteBook);

module.exports = router;
