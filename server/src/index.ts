import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import roomHandler from './handlers/roomHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// ✅ Correct Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend requests
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    roomHandler(socket)// pasthe ocket connection to the room handler for room cration and joining

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// ✅ Use `server.listen()` instead of `app.listen()`
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
