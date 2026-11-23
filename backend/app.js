// backend/app.js

import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import requireAuth from "./middleware/requireAuth.js";

const app = express();

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

export default app;
