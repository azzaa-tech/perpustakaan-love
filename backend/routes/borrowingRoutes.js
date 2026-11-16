const express = require('express');
const router = express.Router();
const borrowing = require('../controllers/borrowingController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/roleMiddleware');

// Admin & siswa
router.get('/', verifyToken, borrowing.getBorrowings);
router.get('/:id', verifyToken, borrowing.getBorrowingById);
router.post('/', verifyToken, borrowing.createBorrowing);          // pinjam
router.put('/:id/kembali', verifyToken, borrowing.returnBorrowing); // kembalikan

// Khusus admin
router.put('/:id', verifyToken, isAdmin, borrowing.updateBorrowing);
router.delete('/:id', verifyToken, isAdmin, borrowing.deleteBorrowing);

module.exports = router;
