// frontend/src/api/ticketAPI.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null); // Handle cases where response is not JSON
  if (!res.ok) {
    throw new Error(
      data?.message || `API request failed with status ${res.status}`,
    );
  }
  return data;
}

// Auth
export const login = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const register = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const getMe = () => request("/auth/me");

// Tickets
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
