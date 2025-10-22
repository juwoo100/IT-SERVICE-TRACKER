export default function TicketCard({tickets }) {
    return (
        <div className="ticket-card border rounded-lg p-4 shadow-md mb-4">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                    <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Create Date</th>
                        <th>Report To</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    <tr>{tickets.title}</tr>
                    <tr>{tickets.status || "open"}</tr>
                    <tr>{tickets.description}</tr>
                    <tr>{tickets.caategory || "general"}</tr>
                    <tr>{tickets.createDate || new Date().toLocaleDateString}</tr>
                    <tr>{tickets.reportTo || "admin"}</tr>
                </tbody>
            </table>
        </div>
    );
}
