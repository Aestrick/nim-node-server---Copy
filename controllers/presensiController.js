const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// --- KONFIGURASI MULTER (UPLOAD FOTO) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan folder 'uploads' ada di root project
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// --- 1. FUNGSI CHECK-IN (FIXED) ---
exports.CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.nama;
    const { latitude, longitude } = req.body;
    
    // Ambil path foto jika ada upload
    const buktiFoto = req.file ? req.file.path : null; 

    const waktuSekarang = new Date();

    // Cek apakah sudah check-in tapi belum check-out
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Ups, kamu sudah check-in hari ini!" });
    }

    // Simpan ke Database
    const newRecord = await Presensi.create({
      userId: userId,
      // HAPUS BARIS 'nama' DI SINI AGAR TIDAK ERROR DATABASE
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
      buktiFoto: buktiFoto // Simpan path foto
    });

    const formattedData = {
        userId: newRecord.userId,
        nama: userName, // Nama diambil dari token untuk respon saja
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, berhasil check-in selfie!`,
      data: formattedData,
    });

  } catch (error) {
    console.error("Error CheckIn:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 2. FUNGSI CHECK-OUT ---
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.nama;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Kamu belum check-in atau sudah check-out sebelumnya.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      nama: userName,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Sampai jumpa ${userName}, berhasil check-out jam ${format(waktuSekarang, "HH:mm:ss", { timeZone })} WIB`,
      data: formattedData,
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- 3. FUNGSI DELETE (Opsional) ---
exports.deletePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    await recordToDelete.destroy();
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- 4. FUNGSI UPDATE (Opsional) ---
exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Data tidak valid", errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};