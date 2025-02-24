import { Server } from 'socket.io';
import { ChatMessage } from '../models/chat.model.js';

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

    socket.on('send_message', async (data) => {
      debug('MESSAGE', `Message received from socket ${socket.id}`, {
        messageData: data,
        room: data.room,
        sender: data.sender
      });

      try {
        // Create message document
        const messageData = {
          room: data.room,
          content: data.content,
          sender: data.sender,
          senderName: data.senderName || 'Unknown',
          timestamp: data.timestamp || new Date(),
          file: data.file ? {
            name: data.file.name,
            type: data.file.type,
            size: data.file.size,
            url: data.file.url
          } : undefined
        };

        console.log('Saving message to database:', messageData);

        // Store message in MongoDB
        const chatMessage = new ChatMessage(messageData);
        const savedMessage = await chatMessage.save();
        
        console.log('Message saved successfully:', savedMessage);

        // Broadcast to room
        io.in(data.room).emit('receive_message', {
          ...data,
          _id: savedMessage._id
        });
        
        debug('MESSAGE_SENT', `Message saved and broadcasted`, {
          messageId: savedMessage._id,
          room: data.room
        });
      } catch (error) {
        console.error('Error saving message:', error);
        debug('MESSAGE_ERROR', `Error saving message`, {
          error: error.message,
          stack: error.stack
        });
      }
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
