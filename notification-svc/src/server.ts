import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { pushPollNotification } from './notifications/pollController';

const PORT = process.env.PORT || 3001;
const APP_NAME = 'Notification-Service';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in local development
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// --- Socket.io Connection Handler ---
io.on('connection', (socket) => {
    console.log(`[🟢 SOCKET] Client connected: ${socket.id}. Total viewers: ${io.engine.clientsCount}`);

    // Optionally emit the current viewer count to the client upon connection
    socket.emit('viewerCount', { count: io.engine.clientsCount });

    socket.on('disconnect', () => {
        console.log(`[🔴 SOCKET] Client disconnected: ${socket.id}. Total viewers: ${io.engine.clientsCount}`);
        
        // Broadcast the updated viewer count to all remaining clients
        io.emit('viewerCount', { count: io.engine.clientsCount });
    });
});


// --- Express API Routes ---

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        service: APP_NAME, 
        version: '1.0',
        message: 'Welcome to the Notification Service (WebSocket & API)'
    });
});

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'UP', 
        sockets: io.engine.clientsCount,
        timestamp: new Date().toISOString()
    });
});

// Dedicated API endpoint to trigger a poll notification push
app.post('/notify/poll', (req: Request, res: Response) => {
    try {
        // Use the controller to push the notification via Socket.io
        const payload = pushPollNotification(io);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Poll notification successfully broadcasted.', 
            payload,
            broadcastTo: `${io.engine.clientsCount} clients`
        });
    } catch (error) {
        console.error(`[❌ ERROR] Failed to push poll:`, error);
        res.status(500).json({ status: 'error', message: 'Failed to broadcast notification.' });
    }
});


// --- Start Server ---
server.listen(PORT, () => {
    console.log(`[🚀 SERVER] ${APP_NAME} running on http://localhost:${PORT}`);
});
