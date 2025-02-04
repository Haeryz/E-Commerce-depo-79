import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true
    },
    transports: ['websocket', 'polling'], // Add this line
    pingTimeout: 60000, // Add ping timeout
    pingInterval: 25000 // Add ping interval
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle reconnection
    socket.on('reconnect', (attemptNumber) => {
      console.log('Client reconnected after', attemptNumber, 'attempts');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
