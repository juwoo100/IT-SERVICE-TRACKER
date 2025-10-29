import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTicketById } from '../api/ticketApi.js';

export default function TicketDetail() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        getTicketById(ticketId)
            .then((data) => setTicket(data))
            .catch(err => console.log((err)=>'Error fetching ticket:', err));
    }, [ticketId]);
    if (!ticket) {
        return <p className="text-center mt-10">Loading ...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>
            <p className="mb-2 text-gray-700">{ticket.description}</p>

            <ul className="text-gray-600 mt-4 space-y-1">
                <li>
                    <b>Status:</b> {ticket.status}
                </li>
                <li>
                    <b>Category:</b> {ticket.category || 'general'}
                </li>
                <li>
                    <b>Created:</b> {new Date(ticket.createDate).toLocalDateString()}
                </li>
                <li>
                    <b>Report To:</b> {ticket.reportTo || 'admin'}
                </li>
            </ul>
        </div>
    );
}