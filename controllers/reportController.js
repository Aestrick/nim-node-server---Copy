// Impor model Presensi DAN User
const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    
    let options = {
        where: {},
        order: [['checkIn', 'DESC']],
        // INI PERBAIKANNYA:
        // Kita suruh Sequelize sekalian ambil data User (JOIN table)
        // 'as: user' harus sama dengan yang kita tulis di models/presensi.js
        include: [{
            model: User,
            as: 'user',
            attributes: ['nama', 'email'] // Kita cuma butuh nama & email
        }]
    };

    // Filter by Nama (Cari berdasarkan nama di tabel User, bukan tabel Presensi)
    // Karena 'nama' ada di tabel User, logic filternya agak beda dikit kalo mau advanced,
    // tapi untuk UCP simpel, kita lewati dulu filter nama user relasi biar ga error.
    // Atau kalau mau filter nama user, logic include-nya harus diubah dikit.
    // Tapi biar aman dan jalan dulu namanya muncul, pake kode ini aja:

    // Filter Tanggal (Tetap sama)
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    } else if (tanggalMulai) {
      options.where.checkIn = {
        [Op.gte]: new Date(tanggalMulai),
      };
    }

    console.log("Controller: Mengambil data laporan harian...");
    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};