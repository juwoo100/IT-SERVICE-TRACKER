const API_BASE_URL = 'http://localhost:5000';


export async function getTickets() {
    const res = await fetch(`${API_BASE_URL}/tickets`);
    if (!res.ok) {
        throw new Error('Failed to fetch tickets');
    }
    const data = await res.json(); // [ {title: ..., description: ...}, ... ]
    return data;
}

export async function getTicketById(ticketId) {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ticket with id: ${ticketId}`);
    }
    const data = await res.json();
    return data;
}

export async function createTicket(ticketData) {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
    });
    if (!res.ok) {
        throw new Error('Failed to create ticket');
    }
    return res.json();
}

export async function updateTicket(ticketId, updateData) {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });
    if (!res.ok) {
        throw new Error(`Failed to update ticket by Id: ${ticketId}`);
    }
    return res.json();
}

export async function deleteTicket(ticketId) {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error(`Failed to delete ticket by Id: ${ticketId}`);
    }
    return res.json();
}