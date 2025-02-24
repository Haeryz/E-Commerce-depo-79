import { Box, HStack, Input, Text, VStack, IconButton, Link } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Avatar } from '../../components/ui/avatar'
import { FiSend, FiPaperclip } from 'react-icons/fi'
import { io } from 'socket.io-client'
import { useAuthStore } from "../../store/auth"; // Add this
import { useNavigate } from 'react-router-dom'; // Add this
import { useProfileStore } from '../../store/profile'

const socket = io('http://localhost:5000', {
  withCredentials: true
});

const AdminChat = () => {
  const { colorMode } = useColorMode()
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  interface ChatMessage {
    room: string;
    content: string;
    sender: string;
    senderName?: string;  // Add this to store customer name
    timestamp: Date;
    attachment?: {
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
    };
  }

  const { user } = useAuthStore(); // Add this
  const navigate = useNavigate(); // Add this

  // Add role check
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [message, setMessage] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);  // List of active chat rooms
  const { fetchProfileReviews } = useProfileStore();

  // Update the state definition to be explicit
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Add debug logging for messages state
  const logMessages = () => {
    console.log('[ADMIN UI] Current messages state:', {
      activeRoom,
      messages,
      roomsCount: Object.keys(messages).length
    });
  };

  // Add ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add function to fetch all rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/rooms', {
        credentials: 'include'
      });
      const rooms = await response.json();
      setRooms(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Add function to fetch chat history for a room
  const fetchRoomHistory = async (roomId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${roomId}`, {
        credentials: 'include'
      });
      const history = await response.json();
      setMessages(prev => ({
        ...prev,
        [roomId]: history
      }));
    } catch (error) {
      console.error('Error fetching room history:', error);
    }
  };

  // Fix the useEffect for socket events
  useEffect(() => {
    fetchRooms();
    // Register as admin when component mounts
    socket.emit('join_admin');
    console.log('[ADMIN UI] Emitted join_admin');

    // Listen for new connections
    const handleUserConnected = (roomId: string) => {
      console.log('[ADMIN] New user connected to room:', roomId);
      setRooms(prev => {
        if (!prev.includes(roomId)) {
          socket.emit('join_room', roomId);
          return [...prev, roomId];
        }
        return prev;
      });
    };

    // Listen for messages with improved logging and handling
    const handleReceiveMessage = (data: ChatMessage) => {
      console.log('[ADMIN UI] Received message:', data);
      
      // Only store the name if both sender and senderName are present
      if (data.sender !== 'admin' && data.senderName && data.room) {
        setUserNames(prev => ({
          ...prev,
          [data.room]: data.senderName as string // Type assertion since we checked it exists
        }));
      }
      
      setMessages(prev => {
        const roomId = data.room;
        // Check if message already exists to prevent duplicates
        const existingMessages = prev[roomId] || [];
        const isDuplicate = existingMessages.some(
          msg => 
            msg.content === data.content && 
            msg.sender === data.sender &&
            msg.timestamp === data.timestamp
        );

        if (isDuplicate) {
          return prev;
        }

        return {
          ...prev,
          [roomId]: [
            ...existingMessages,
            {
              ...data,
              timestamp: new Date(data.timestamp)
            }
          ]
        };
      });
    };

    // Add event listeners
    socket.on('user_connected', handleUserConnected);
    socket.on('receive_message', handleReceiveMessage);

    // Cleanup function
    return () => {
      console.log('[ADMIN] Cleaning up socket listeners');
      socket.off('user_connected', handleUserConnected);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []); // Empty dependency array is fine now since we're using proper cleanup

  // Add useEffect to monitor messages state changes
  useEffect(() => {
    logMessages();
  }, [messages, activeRoom]);

  // Update the useEffect for fetching profiles
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        await fetchProfileReviews();
        console.log('[ADMIN] Profiles fetch completed');
      } catch (error) {
        console.error('[ADMIN] Error loading profiles:', error);
      }
    };

    loadProfiles();
    const interval = setInterval(loadProfiles, 30000);
    return () => clearInterval(interval);
  }, [fetchProfileReviews]);

  // Add useEffect to scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoom]);

  // Modify the sendMessage function to wait for server response
  const sendMessage = () => {
    if (message.trim() && activeRoom) {
      const messageData = {
        room: activeRoom,
        content: message,
        sender: 'admin',
        senderName: 'Admin', // Add admin name
        timestamp: new Date()
      };

      // Clear the input immediately
      setMessage('');
      
      // Only emit to server, don't update state directly
      socket.emit('send_message', messageData);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    console.log('[ADMIN UI] Selecting room:', roomId);
    console.log('[ADMIN UI] Messages for room:', messages[roomId]);
    setActiveRoom(roomId);
    // Ensure we're joined to the room
    socket.emit('join_room', roomId);
    fetchRoomHistory(roomId);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeRoom) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result?.toString().split(',')[1];
      
      const messageData = {
        room: activeRoom,
        content: `Sent file: ${file.name}`,
        sender: 'admin',
        senderName: 'Admin',
        timestamp: new Date(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        }
      };

      socket.emit('send_message', messageData);
    };
    reader.readAsDataURL(file);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };


  // Update getUserDisplayName function
  const getUserDisplayName = (roomId: string) => {
    if (roomId === 'guest') return 'Guest';
    
    // Use stored username if available
    const storedName = userNames[roomId];
    if (storedName) return storedName;

    // Try to get name from last message
    const roomMessages = messages[roomId];
    if (roomMessages?.length > 0) {
      for (let i = roomMessages.length - 1; i >= 0; i--) {
        const msg = roomMessages[i];
        if (msg.sender !== 'admin' && msg.senderName) {
          // Store the name for future use
          setUserNames(prev => ({
            ...prev,
            [roomId]: msg.senderName! // Non-null assertion since we checked it exists
          }));
          return msg.senderName;
        }
      }
    }

    return `User ${roomId}`;
  };

  return (
    <Box display="flex" height="100vh" w="85%" p={4}>
      <Box
        height="100%"
        w="100%"
        bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
        borderRadius={16}
        overflow="hidden"
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.1)"
      >
        <HStack w={'100%'} align="start" h="100%" gap={0}>
          {/* Contacts Section */}
          <VStack
            w={'25%'}
            align={'stretch'}
            h="100%"
            borderRight="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
          >
            <Box p={4} borderBottom="1px solid" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}>
              <Input
                placeholder="Search"
                bg={colorMode === 'light' ? 'white' : 'gray.700'}
                border="1px solid"
                borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                borderRadius="md"
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
            </Box>
            <VStack
              overflowY="auto"
              h="calc(100% - 72px)"
              w="100%"
              gap={1}
              p={2}
            >
              {rooms.map(roomId => {
                const displayName = getUserDisplayName(roomId);
                return (
                  <HStack
                    key={roomId}
                    p={3}
                    w="100%"
                    bg={activeRoom === roomId ? 
                      (colorMode === 'light' ? 'blue.500' : 'blue.600') : 
                      'transparent'}
                    color={activeRoom === roomId ? 'white' : 'inherit'}
                    borderRadius="md"
                    _hover={{ bg: activeRoom === roomId ? 
                      (colorMode === 'light' ? 'blue.600' : 'blue.700') : 
                      (colorMode === 'light' ? 'gray.200' : 'gray.700') }}
                    cursor="pointer"
                    onClick={() => handleRoomSelect(roomId)}
                  >
                    <Avatar 
                      name={displayName}
                      colorPalette={pickPalette(displayName)} 
                    />
                    <VStack align="start" gap={0}>
                      <Text fontWeight="medium">
                        {displayName}
                      </Text>
                      {messages[roomId]?.length > 0 && (
                        <Text fontSize="xs" color="gray.500" truncate>
                          {messages[roomId][messages[roomId].length - 1].content}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          </VStack>

          {/* Chat Section */}
          <VStack
            bg={colorMode === 'light' ? 'white' : 'gray.900'}
            w={'75%'}
            h="100%"
            gap={0}
          >
            <Box
              w="100%"
              p={4}
              borderBottom="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
            >
              <Text fontWeight="semibold">
                {activeRoom ? getUserDisplayName(activeRoom) : 'Select a chat'}
              </Text>
            </Box>

            <VStack w="100%" h="calc(100% - 140px)" p={6} overflowY="auto" gap={4}>
              {activeRoom ? (
                <>
                  {messages[activeRoom]?.map((msg, index) => (
                    <HStack 
                      key={`${activeRoom}-${index}`} 
                      w="100%" 
                      justify={msg.sender === 'admin' ? 'flex-end' : 'flex-start'}
                    >
                      <VStack align={msg.sender === 'admin' ? 'end' : 'start'} maxW="70%">
                        <Text fontSize="xs" color="gray.500">
                          {msg.senderName || msg.sender}
                        </Text>
                        <Box
                          position="relative"
                          bg={msg.sender === 'admin' ?
                            (colorMode === 'light' ? '#007AFF' : '#0A84FF') :
                            (colorMode === 'light' ? '#E9E9EB' : '#303030')
                          }
                          px={4}
                          py={2}
                          borderRadius="2xl"
                          color={msg.sender === 'admin' ? 'white' : 'inherit'}
                          _before={{
                              content: '""',
                              position: 'absolute',
                              bottom: '0',
                              width: '20px',
                              height: '20px',
                              backgroundColor: 'inherit',
                              ...(msg.sender === 'admin'
                                ? {
                                    right: '-8px',
                                    clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
                                  }
                                : {
                                    left: '-8px',
                                    clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                                  }
                              )
                          }}
                        >
                          <Text>{msg.content}</Text>
                          <Text fontSize="xs" opacity={0.7}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </Text>
                        </Box>
                        {msg.attachment && (
                          <Link
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            p={2}
                            bg="gray.100"
                            borderRadius="md"
                            _hover={{ bg: 'gray.200' }}
                          >
                            <HStack>
                              <FiPaperclip />
                              <Text fontSize="sm">{msg.attachment.name}</Text>
                            </HStack>
                          </Link>
                        )}
                      </VStack>
                    </HStack>
                  ))}
                  {/* Add div ref for auto scroll */}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <Text color="gray.500">Select a chat to view messages</Text>
              )}
            </VStack>

            <Box
              w="100%"
              p={4}
              borderTop="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
            >
              <HStack w="100%" gap={3}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <IconButton
                  aria-label="Attach file"
                  variant="ghost"
                  borderRadius="full"
                  color="blue.500"
                  onClick={handleAttachmentClick}
                  _hover={{ bg: colorMode === 'light' ? 'blue.50' : 'blue.900' }}
                >
                  <FiPaperclip />
                </IconButton>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="iMessage"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  borderRadius="full"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton
                  aria-label="Send message"
                  colorScheme="blue"
                  borderRadius="full"
                  disabled={!message.trim()}
                  onClick={sendMessage}
                >
                  <FiSend />
                </IconButton>
              </HStack>
            </Box>
          </VStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default AdminChat