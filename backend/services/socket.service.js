import { Server } from 'socket.io';

let io;

const debug = (context, message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${context}]:`, message, JSON.stringify(data, null, 2));
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
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

      adminSockets.forEach(adminId => {
        io.to(adminId).emit('user_connected', roomId);
      });
    });

    socket.on('send_message', (data) => {
      debug('MESSAGE', `Message received from socket ${socket.id}`, {
        messageData: data,
        room: data.room,
        sender: data.sender,
        roomExists: io.sockets.adapter.rooms.has(data.room),
        roomSize: io.sockets.adapter.rooms.get(data.room)?.size || 0
      });

      // Check if room exists
      if (!io.sockets.adapter.rooms.has(data.room)) {
        debug('MESSAGE_ERROR', `Room ${data.room} does not exist!`);
        return;
      }

      // Log room members
      const roomMembers = Array.from(io.sockets.adapter.rooms.get(data.room) || []);
      debug('MESSAGE_ROOM', `Broadcasting to room ${data.room}`, {
        roomMembers,
        messageContent: data.content
      });

      io.in(data.room).emit('receive_message', data);
      
      debug('MESSAGE_SENT', `Message broadcasted to room ${data.room}`, {
        timestamp: new Date().toISOString()
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
