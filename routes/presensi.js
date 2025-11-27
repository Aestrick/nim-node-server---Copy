const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
// 1. Impor middleware auth baru
const { authenticateToken } = require('../middleware/authMiddleware');

// 2. HAPUS 'addUserData' dan GANTI dengan 'authenticateToken'
router.use(authenticateToken); 

// Rute-rute ini sekarang dilindungi
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put('/:id', presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;