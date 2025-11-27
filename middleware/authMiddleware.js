const jwt = require('jsonwebtoken');
// Pastikan SECRET ini SAMA PERSIS dengan yang ada di authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = (req, res, next) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  // Header akan terlihat seperti: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Jika tidak ada token, kirim error
  if (token == null) {
    return res.status(401).json({ message: "Akses ditolak: Token tidak ada." });
  }

  // 3. Verifikasi token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Jika token tidak valid atau kadaluwarsa
      return res.status(403).json({ message: "Akses ditolak: Token tidak valid." });
    }
    
    // 4. Jika token valid, simpan data user ke req.user
    // Ini adalah pengganti middleware dummy kita!
    req.user = user;
    next(); // Lanjutkan ke controller
  });
};