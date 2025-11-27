const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// 1. Impor middleware auth baru
const { authenticateToken } = require('../middleware/authMiddleware');
// 2. Impor middleware pengecek admin (dari Praktikum 3)
const { isAdmin } = require('../middleware/permissionMiddleware');

// 3. Ganti 'addUserData' dengan 'authenticateToken'
// Rutenya menjadi: Cek token, JIKA valid, baru cek admin
router.get('/daily', [authenticateToken, isAdmin], reportController.getDailyReport);

module.exports = router;