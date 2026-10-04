// frontend/src/api/ticketAPI.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null); // Handle cases where response is not JSON
  if (!res.ok) {
    throw new Error(
      data?.message || `API request failed with status ${res.status}`,
    );
  }
  return data;
}

export const getTickets = () => request("/tickets");

export const getTicketById = (ticketId) => request(`/tickets/${ticketId}`);

export const createTicket = (ticketData) =>
  request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });

export const updateTicket = (ticketId, updateData) =>
  request(`/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });

export const deleteTicket = (ticketId) =>
  request(`/tickets/${ticketId}`, {
    method: "DELETE",
  });
