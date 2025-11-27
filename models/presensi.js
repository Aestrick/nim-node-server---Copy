'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi dari UCP (Praktikum Sebelumnya)
      // Satu data Presensi adalah milik satu User (belongsTo)
      Presensi.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true, // Boleh null (kosong) pas awal check-in
    },
    // --- TAMBAHAN BARU UNTUK PRAKTIKUM 9 (GEOLOCATION) ---
    latitude: {
      type: DataTypes.DECIMAL(10, 8), // Tipe data desimal untuk koordinat
      allowNull: true, // Boleh null jika user menolak akses lokasi
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8), // Tipe data desimal untuk koordinat
      allowNull: true,
    }
    // ------------------------------------------------------
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};