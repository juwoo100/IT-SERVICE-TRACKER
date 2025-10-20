export default function TicketCard({ title, status, description }) {
    return (
        <div>
            <h3>{title}</h3>
            <p>Status: {status}</p>
            <p>Description: {description}</p>
            <p>Category: {caategory}</p>
            <p>Create Date: {createDate}</p>
            <p>Report To: {reportTo}</p>
        </div>
    );
}
