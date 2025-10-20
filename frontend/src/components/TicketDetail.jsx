import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TicketDetail() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        getTicketById(ticketId)
            .then((data) => setTicket(data))
            .catch(err => console.log(err));
    }, [ticketId]);
    if (!ticket) {
        return <p>Loading ...</p>;
    }

    return (
        <div>
            <h2>Ticket Detail Page</h2>
            <p>Title: {ticket.title}</p>
            <p>Description: {ticket.description}</p>
            <p>Status: {ticket.status}</p>
            <p>Category: {ticket.category}</p>
            <p>Create Date: {ticket.createDate}</p>
            <p>Report To: {ticket.reportTo}</p>
        </div>
    );
}