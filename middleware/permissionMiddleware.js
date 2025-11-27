// Middleware untuk memeriksa apakah user adalah admin
exports.isAdmin = (req, res, next) => {
  // Cek data user dari TOKEN (bukan dummy lagi)
  // req.user sekarang diisi oleh middleware authenticateToken
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next(); // Lanjutkan karena user adalah admin
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    // Kirim respon error karena tidak punya akses
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
  }
};