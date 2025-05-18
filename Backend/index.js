require("dotenv").config();
const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const apiErrorHandler = require("./errors/apiErrorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Middleware JSON
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

// Error Handler
app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/* okee
adomoamda */