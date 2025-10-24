const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);

// Fallback route for frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
