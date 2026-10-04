// frontend/src/components/Dashboard.jsx

import { useEffect, useState } from "react";
import { getTickets } from "../api/ticketAPI.js";
import TicketList from "./TicketList.jsx";

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} rounded-lg p-4 text-center shadow-sm`}>
      <p className="text-sm text-gray-700">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError("Could not load tickets. Please try again later.");
      })
      // whether the request succeeds or fails, we want to stop the loading state
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const counter = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    // closed and modified ticket today based on the updatedAt timestamp
    closedToday: tickets.filter(
      (t) =>
        t.status === "closed" && new Date(t.updatedAt).toDateString() === today,
    ).length,
  };

  if (loading) return <p className="text-center mt-10">Loading tickets...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Placed Title and welcome message horizontally (flex) */}
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-600">Welcome, {username}!</p>
      </div>

      {/* grid-cols-2: basic two column, md:grid-cols-4: on medium screens and above, four columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tickets"
          value={counter.total}
          color="bg-yellow-200"
        />
        <StatCard
          label="Open Tickets"
          value={counter.open}
          color="bg-orange-200"
        />
        <StatCard
          label="In Progress"
          value={counter.inProgress}
          color="bg-green-200"
        />
        <StatCard
          label="Closed Today"
          value={counter.closedToday}
          color="bg-red-200"
        />
      </div>

      <TicketList tickets={tickets} />
    </div>
  );
}
