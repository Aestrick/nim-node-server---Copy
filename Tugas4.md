# Laporan Tugas Praktikum 4: Koneksi Database Sequelize

Berikut adalah hasil pengujian endpoint API Presensi setelah dihubungkan ke database MySQL menggunakan Sequelize.

### 1. Endpoint Presensi Check-in
![Hasil Check-in Berhasil](./SS/check-in-berhasil.png)

### 2. Endpoint Presensi Check-out
![Hasil Check-out Berhasil](./SS/check-out-berhasil.png)

### 3. Endpoint Laporan Harian (Sebagai Admin)
![Hasil Laporan Harian Berhasil](./SS/laporan-berhasil-admin.png)

---

## Skenario Error Handling

#### Check-in Gagal (Duplikat)
![Check-in Gagal Duplikat](./SS/check-in-gagal-duplikat.png)

#### Check-out Gagal (Belum Check-in)
![Check-out Gagal Belum Check-in](./SS/check-out-gagal-belum-checkin.png)

#### Laporan Gagal (Sebagai Karyawan)
![Laporan Gagal Forbidden](./SS/laporan-gagal-forbidden.png)

---

### 4. Tampilan Database Setelah Presensi
(Screenshot database-mu akan diletakkan di sini, pastikan filenya ada di dalam folder `SS` juga)
![Tampilan Database](./SS/database-setelah-presensi.png)