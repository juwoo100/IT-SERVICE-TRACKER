// backend/middleware/requireAuth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  // Get the token from the Authorization header
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let payload;
  try {
    // Error if token is expired or invalid
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Check if the account exists
  const user = await User.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  // Added the logged-in user information to be available via req.user in the next route.
  req.user = user;
  next();
}
