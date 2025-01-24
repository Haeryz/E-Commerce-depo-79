import { Server } from 'socket.io';

let io;

// Add debug helper
const debug = (context, message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${context}]:`, message, JSON.stringify(data, null, 2));
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], // Keep this the same since your frontend is on 5173
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  let adminSockets = new Set();
  let activeRooms = new Set();

  io.on('connection', (socket) => {
    debug('CONNECTION', `Client connected: ${socket.id}`);

    socket.on('join_admin', () => {
      debug('ADMIN', `Admin socket registered`, {
        socketId: socket.id,
        totalAdmins: adminSockets.size + 1,
        activeRooms: Array.from(activeRooms)
      });
      
      adminSockets.add(socket.id);
      
      activeRooms.forEach(room => {
        socket.join(room);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        debug('ADMIN_JOIN', `Admin joined existing room`, {
          room,
          socketId: socket.id,
          members: Array.from(roomMembers || [])
        });
      });
    });

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      activeRooms.add(roomId);
      
      const roomMembers = io.sockets.adapter.rooms.get(roomId);
      debug('ROOM_JOIN', `User joined room`, {
        room: roomId,
        socketId: socket.id,
        isAdmin: adminSockets.has(socket.id),
        members: Array.from(roomMembers || [])
      });

      // Notify admins
      adminSockets.forEach(adminId => {
        io.to(adminId).emit('user_connected', roomId);
      });
    });

    socket.on('send_message', (data) => {
      debug('MESSAGE', `Message received`, {
        room: data.room,
        sender: data.sender,
        senderName: data.senderName,
        content: data.content,
        isAdmin: adminSockets.has(socket.id)
      });

      const roomMembers = io.sockets.adapter.rooms.get(data.room);
      debug('MESSAGE_ROOM', `Room members before emit`, {
        room: data.room,
        members: Array.from(roomMembers || [])
      });

      // Add server timestamp
      const messageWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
        serverReceived: new Date().toISOString()
      };

      io.in(data.room).emit('receive_message', messageWithTimestamp);

      debug('MESSAGE_SENT', `Message emitted to room`, {
        room: data.room,
        recipientCount: roomMembers?.size || 0,
        recipients: Array.from(roomMembers || [])
      });
    });

    socket.on('disconnect', () => {
      debug('DISCONNECT', `Client disconnected`, {
        socketId: socket.id,
        wasAdmin: adminSockets.has(socket.id)
      });
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
