// backend/models/Ticket.js

import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },
    category: {
      type: String,
      enum: ["general", "hardware", "software", "network", "account", "other"],
      default: "general",
    },
    reportTo: {
      type: String,
      required: true,
      enum: ["admin", "support"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
