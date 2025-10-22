import TicketCard from "./TicketCard";

export default function TicketList({tickets}) {

    if (tickets.length === 0) {
        return <p>No tickets available.</p>;
    }
    return (
        <div>
            {tickets.map((tickets) => (
                <TicketCard key={tickets.id} {...tickets} />
            ))}
        </div>
    );
}