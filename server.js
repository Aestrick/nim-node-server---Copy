const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path"); // <-- 1. Tambah ini

const app = express();
const PORT = 3001;

const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Opsional: kalau gambar ga muncul nanti
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Tambahan untuk form-data
app.use(morgan("dev"));

// 2. Buka akses folder uploads agar bisa diakses browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Home Page for API Presensi");
});

app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});