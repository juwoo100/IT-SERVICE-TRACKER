// backend/routes/ticketRoutes.js

import Ticket from "../models/Ticket.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const CREATE_FIELDS = [
  "username",
  "title",
  "description",
  "status",
  "category",
  "reportTo",
];
const UPDATE_FIELDS = [
  "title",
  "description",
  "status",
  "category",
  "reportTo",
];

// Pick only the allowed fields from the request body
function pickFields(body, allowed) {
  const data = {};
  if (!body) return data;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
}

function handleError(err, res) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
}

// Validate all routes with :ticketId
router.param("ticketId", (req, res, next, ticketId) => {
  if (!mongoose.isObjectIdOrHexString(ticketId)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }
  next();
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    handleError(err, res);
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const ticket = await Ticket.create(pickFields(req.body, CREATE_FIELDS));
    res.status(201).json({ message: "Ticket created", ticket });
  } catch (err) {
    handleError(err, res);
  }
});

// READ ONE
router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    handleError(err, res);
  }
});

// UPDATE
router.put("/:ticketId", async (req, res) => {
  const updates = pickFields(req.body, UPDATE_FIELDS);
  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update" });
  }
  try {
    const updated = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updated) return res.status(404).json({ message: "Ticket not found" });
    res.json(updated);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE
router.delete("/:ticketId", async (req, res) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.ticketId);
    if (!deleted) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
