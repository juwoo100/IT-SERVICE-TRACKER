// backend/routes/authRoutes.js

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import requireAuth from "../middleware/requireAuth";

const router = express.Router();

// Put user id to token and sign
function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "id",
  });
}

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body ?? {};
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email is already in use" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.fineOne({
      email: String(email).toLowerCase(),
    }).select("+password");
  } catch (err) {}
});
