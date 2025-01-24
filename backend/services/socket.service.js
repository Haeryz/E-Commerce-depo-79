import { Server } from 'socket.io';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid'; // Add this dependency

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

    socket.on('send_message', async (data) => {
      debug('MESSAGE', `Message received`, {
        type: data.type,
        hasAttachment: !!data.file
      });

      let messageData = { ...data };

      // Handle file attachment if present
      if (data.file) {
        try {
          const fileId = uuidv4();
          const fileExt = data.file.name.split('.').pop();
          const fileName = `${fileId}.${fileExt}`;
          const filePath = join(process.cwd(), 'uploads', fileName);
          
          // Convert base64 to buffer and save
          const fileBuffer = Buffer.from(data.file.data, 'base64');
          await writeFile(filePath, fileBuffer);

          // Add file info to message
          messageData.attachment = {
            id: fileId,
            name: data.file.name,
            type: data.file.type,
            size: data.file.size,
            url: `/uploads/${fileName}`
          };
          delete messageData.file; // Remove raw file data
        } catch (error) {
          debug('ERROR', `File upload failed`, { error });
        }
      }

      io.in(data.room).emit('receive_message', messageData);
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
