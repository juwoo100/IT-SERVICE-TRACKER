import { useEffect, useState } from 'react'
import { getTickets } from '../api/ticketApi.js';
import TicketList from './TicketList.jsx';

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        getTickets()
            .then((data) => setTickets(data.tickets));
    }, []);
    
    return (
        <div>
            <h2>Dashboard</h2>
            <TicketList tickets={tickets} />
        </div>
    );
}

