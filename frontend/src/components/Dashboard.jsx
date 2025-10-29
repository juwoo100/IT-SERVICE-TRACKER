import { useEffect, useState } from 'react'
import { getTickets } from '../api/ticketApi.js';
import TicketList from './TicketList.jsx';

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        getTickets()
            .then((data) => {
      console.log("📦 getTickets() response:", data);
      console.log("📦 typeof data:", typeof data);
      console.log("📦 Array.isArray(data):", Array.isArray(data));
      setTickets(data);
    })
            .catch(console.error);
    }, []);
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
            <TicketList tickets={tickets} />
        </div>
    );
}

