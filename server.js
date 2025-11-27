const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Tambahkan ini
const morgan = require("morgan"); // Tambahkan ini
const app = express();
const PORT = 3001;

// Impor router baru
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(helmet()); // Middleware keamanan
app.use(express.json());
app.use(morgan("dev")); // Logger untuk request

app.get("/", (req, res) => {
  res.send("Home Page for API Presensi");
});

// Gunakan router
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});