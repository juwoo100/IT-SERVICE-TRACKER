import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/ticketRoutes.js';
import connectDB from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/tickets', ticketRoutes);
app.get('/', (req, res) => {
    res.json("Backend server is running");
});

app.use((req, res) => {
    res.status(404).send('Resource not found');
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));