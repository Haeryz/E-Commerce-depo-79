import { Server } from 'socket.io';

let io;
const adminSockets = new Set();
const activeRooms = new Set();

const debug = (context, message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${context}]:`, message, JSON.stringify(data, null, 2));
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    debug('CONNECTION', `Client connected: ${socket.id}`);

    socket.on('join_admin', () => {
      debug('ADMIN', `Admin socket registered`, {
        socketId: socket.id,
        totalAdmins: adminSockets.size + 1
      });
      
      adminSockets.add(socket.id);
    });

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      activeRooms.add(roomId);
      
      debug('ROOM_JOIN', `User joined room`, {
        room: roomId,
        socketId: socket.id,
        isAdmin: adminSockets.has(socket.id)
      });

      // Notify admins of new user connection
      adminSockets.forEach(adminId => {
        io.to(adminId).emit('user_connected', roomId);
      });
    });

    socket.on('send_message', (data) => {
      debug('MESSAGE', `Message received`, {
        from: socket.id,
        room: data.room,
        content: data.content
      });

      io.in(data.room).emit('receive_message', data);
      
      debug('MESSAGE_SENT', `Message broadcasted to room ${data.room}`);
    });

    socket.on('disconnect', () => {
      debug('DISCONNECT', `Client disconnected: ${socket.id}`);
      adminSockets.delete(socket.id);
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
