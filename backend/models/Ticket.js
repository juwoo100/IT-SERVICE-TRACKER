import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    category: { type: String, },
    createDate: { type: Date, default: Date.now },
    reportTo: { type: String, required: true },
});
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;