'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. BUAT TABEL USERS DULUAN
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('mahasiswa', 'admin'),
        allowNull: false,
        defaultValue: 'mahasiswa'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 2. BARU BUAT TABEL PRESENSIS (Setelah Users Jadi)
    await queryInterface.createTable('Presensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ini merujuk ke nama tabel di atas (harus sama persis 'Users')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      checkIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      checkOut: {
        allowNull: true,
        type: Sequelize.DATE
      },
      // Kolom Lokasi (Praktikum 9)
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      // Kolom Foto (Praktikum 10)
      buktiFoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus Presensis dulu baru Users (kebalikan dari up)
    await queryInterface.dropTable('Presensis');
    await queryInterface.dropTable('Users');
  }
};