const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Middleware autentikasi JWT untuk semua rute di bawah ini
router.use(authenticateToken);

// --- Rute CHECK-IN (Dengan Upload Foto) ---
// 'image' adalah nama field yang kita set di Frontend (FormData)
router.post(
  '/check-in', 
  presensiController.upload.single('image'), // Middleware upload
  presensiController.CheckIn
);

// --- Rute CHECK-OUT ---
router.post('/check-out', presensiController.CheckOut);

// --- Rute UPDATE (Dengan Validasi) ---
router.put(
  '/:id',
  [
    body('checkIn').optional().isISO8601().toDate().withMessage('Format tanggal checkIn tidak valid'),
    body('checkOut').optional().isISO8601().toDate().withMessage('Format tanggal checkOut tidak valid'),
  ],
  presensiController.updatePresensi
);

// --- Rute DELETE ---
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;