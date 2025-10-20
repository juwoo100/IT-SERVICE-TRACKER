import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        getTickets()
            .then((data) => setTickets(data.tickets));
    }, []);
    return (
        <div>
            <h2>Dashboard</h2>
            if (tickets.length === 0) {
                <p>No tickets available.</p>
            } else {
                tickets.map((tickets) => (
                    <div key={tickets.id} >
                        <h3>{tickets.title || "No title"}</h3>
                        <p>{tickets.description}</p>
                        <p>Status: {tickets.status || "open"}</p>
                        <p>Category: {tickets.category || "general"}</p>
                        <p>Create Date: {tickets.createDate || new Date().toLocaleDateString()}</p>
                        <p>Report To: {tickets.reportTo || "admin"}</p>
                    </div>
                ))
            }

        </div>
    );
}

