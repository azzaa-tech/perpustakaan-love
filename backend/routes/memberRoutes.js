const express = require('express');
const router = express.Router();
const member = require('../controllers/memberController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/roleMiddleware');

// Semua route kelola anggota khusus admin
router.get('/', verifyToken, isAdmin, member.getMembers);
router.get('/:id', verifyToken, isAdmin, member.getMemberById);
router.post('/', verifyToken, isAdmin, member.createMember);
router.put('/:id', verifyToken, isAdmin, member.updateMember);
router.delete('/:id', verifyToken, isAdmin, member.deleteMember);

module.exports = router;
