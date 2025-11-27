const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const { validationResult } = require('express-validator'); // Untuk updatePresensi

// --- 1. FUNGSI CHECK-IN (Dengan Geolocation) ---
exports.CheckIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.nama;
    
    // Ambil data lokasi dari body request
    const { latitude, longitude } = req.body;

    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Ups, kamu sudah check-in hari ini!" });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
      // Simpan koordinat ke database
      latitude: latitude,
      longitude: longitude,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: newRecord.latitude,
      longitude: newRecord.longitude,
      checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, berhasil check-in di lokasi (${latitude}, ${longitude})!`,
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
      nama: recordToUpdate.nama,
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

// --- 3. FUNGSI DELETE ---
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Cek kepemilikan (opsional, tergantung kebutuhan admin)
    // if (recordToDelete.userId !== userId) { ... }

    await recordToDelete.destroy();
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- 4. FUNGSI UPDATE ---
exports.updatePresensi = async (req, res) => {
  // Cek error validasi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Data tidak valid", errors: errors.array() });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message: "Request body tidak berisi data yang valid untuk diupdate.",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};