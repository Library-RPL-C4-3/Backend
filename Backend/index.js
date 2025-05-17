require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const apiErrorHandler = require("./errors/apiErrorHandler");

const PORT = process.env.PORT || 5000;

if (isNaN(PORT)) {
  console.error("PORT environment variable is invalid or missing.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
