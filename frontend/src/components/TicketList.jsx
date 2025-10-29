import TicketCard from "./TicketCard";
import ErrorBoundary from "./ErrorBoundary";


export default function TicketList({tickets}) {
    if (!tickets || tickets.length === 0) {
        return <p className="text-center mt-10 text-gray-500">No tickets available.</p>;
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-4">
            {tickets.map((ticket) => (
                <ErrorBoundary key={ticket._id}>
                    <TicketCard ticket={ticket} />
                </ErrorBoundary>
                
            ))}
        </div>
    );
}