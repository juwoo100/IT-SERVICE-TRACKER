import { Link } from 'react-router-dom';

export default function TicketCard({ ticket }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-3">
            <h3 className="text-xl font-semibold">{ticket.title}</h3>
            <p className="text-gray-600">{ticket.description}</p>

            <div className="flex flex-wrap justify-between mt-2 text-sm text-gray-500">
                <span>Status: {ticket.status || 'open'}</span>
                <span>Category: {ticket.category || 'general'}</span>
                <span>Create Date: {' '} {ticket.createDate ? new Date(ticket.createDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                <span>Report to: {ticket.reportTo || 'admin'}</span>
            </div>

            <Link to={`/tickets/${ticket._id}`} className="inline-block mt-3 text-blue-600 hover:underline">
                View Details</Link>
        </div>
    );
}
