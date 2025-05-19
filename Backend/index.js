require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");



const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const apiErrorHandler = require("./errors/apiErrorHandler");
const loanRoutes = require("./routes/loanRoutes");
const authRoutes = require("./routes/authRoutes");
const penaltyRoutes = require("./routes/penaltyRoutes");
const { checkAndApplyPenalties } = require("./services/penaltyService");

//cron scheduler
cron.schedule("0 1 * * *", async () => {
  console.log("[CRON] Mengecek denda keterlambatan...");
  try {
    const result = await checkAndApplyPenalties();
    console.log("[CRON] Denda diterapkan:", result);
  } catch (err) {
    console.error("[CRON] Gagal menghitung denda:", err.message);
  }
});



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware JSON
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/penalties", penaltyRoutes);

// Error Handler 
app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
