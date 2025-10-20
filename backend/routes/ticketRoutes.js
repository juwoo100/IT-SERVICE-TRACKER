export default function ticketRoutes(app) {
    app.get('/tickets', (req, res) => {
        res.json({ tickets: [] });
    })
    app.post('/tickets', (req, res) => {
        const ticket = req.body;
        res.status(201).json({ message: 'Ticket created', ticket });
    });
    app.get('/tickets/:ticketId', (req, res) => {
        const id = req.params.ticketId
        res.json({ message: `Get a ticket with Id: ${id}` });
    });
    app.put('/tickets/:ticketId', (req, res) => {
        const id = req.params.ticketId
        res.json({ message: `Update Ticket with Id: ${id}` });
    });
    app.delete('/tickets/:ticketId', (req, res) => {
        const id = req.params.ticketId
        res.status(200).json({ message: `Delete Ticket with Id: ${id}` });
    });

    app.use((req, res) => {
        res.status(404).send('Resource not found');
    });
}