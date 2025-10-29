import Ticket from '../models/Ticket.js';
import express from 'express';
 const router = express.Router();

    
    // READ ALL
    router.get('/', async (req, res) => {
        try {
            const tickets = await Ticket.find();
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // CREATE
    router.post('/', async (req, res) => {
        try {
            const ticket = await Ticket.create(req.body);
            res.status(201).json({ message: 'Ticket created', ticket });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // READs ONE
    router.get('/:ticketId', async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.ticketId)
            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            res.json(ticket);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // UPDATE
    router.put('/:ticketId', async (req, res) => {
        try {
            const updatedTicket = await Ticket.findByIdAndUpdate(req.params.ticketId, req.body, { new: true });
            if (!updatedTicket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            res.json(updatedTicket);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // DELETE
    router.delete('/:ticketId', async (req, res) => {
        try {
            const deletedTicket = await Ticket.findByIdAndDelete(req.params.ticketId)
            if (!deletedTicket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            res.json({ message: "Ticket deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
export default router;