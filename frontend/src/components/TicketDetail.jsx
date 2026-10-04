// frontend/src/components/TicketDetail.jsx

import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTicketById, updateTicket, deleteTicket } from "../api/ticketAPI.js";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

export default function TicketDetail() {
  const { ticketId } = useParams();
  const vavigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTicketById(ticketId)
      .then(setTicket)
      .catch((err) => {
        console.error("Error fetching ticket:", err);
        setError("Could not load this ticket.");
      });
  }, [ticketId]);

  async function handleStatusChange(e) {
    setSaving(true);
    try {
      const updated = await updateTicket(ticketId, { status: e.target.value });
      setTicket(updated);
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket status: ${err.message}");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await deleteTicket(ticketId);
      vavigate("/dashboard");
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert("Failed to delete ticket: ${err.message}");
    }
  }

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!ticket) return <p className="text-center mt-10">Loading ...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
        Back to Dashboard
      </Link>

      <h2 className="text-2xl font-bold mt-2 mb-4">{ticket.title}</h2>
      <p className="mb-2 text-gray-700">{ticket.description}</p>

      <ul className="text-gray-600 mt-4 space-y-2">
        <li>
          <b>Status:</b>
          <select
            value={ticket.status}
            onChange={handleStatusChange}
            disabled={saving}
            className="border border-gray-300 rounded-md p-1"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </li>
        <li>
          <b>Category:</b> {ticket.category}
        </li>
        <li>
          <b>Reported by:</b> {ticket.username}
        </li>
        <li>
          <b>Report To:</b> {ticket.reportTo}
        </li>
        <li>
          <b>Created:</b> {new Date(ticket.createdAt).toLocaleDateString()}
        </li>
        <li>
          <b>Last updated:</b> {new Date(ticket.updatedAt).toLocaleDateString()}
        </li>
      </ul>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Delete ticket
      </button>
    </div>
  );
}
