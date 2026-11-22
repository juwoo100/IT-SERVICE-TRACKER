// backend/server.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes.js";
import connectDB from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import requireAuth from "./middleware/requireAuth.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tickets", requireAuth, ticketRoutes); // Only logged in user can access to Ticket API

app.get("/", (req, res) => {
  res.json({ message: "Backend server is running" });
});

// 404: Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Middleware for error handling
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON" });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
