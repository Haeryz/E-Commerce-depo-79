import { Box, HStack, Input, Text, VStack, IconButton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Avatar } from '../../components/ui/avatar'
import { FiSend, FiPaperclip } from 'react-icons/fi'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000');

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
    timestamp: Date;
  }

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [message, setMessage] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);  // List of active chat rooms

  useEffect(() => {
    // Listen for new connections
    socket.on('user_connected', (roomId) => {
      setRooms(prev => [...prev, roomId]);
    });

    // Listen for messages
    socket.on('receive_message', (data) => {
      setMessages(prev => ({
        ...prev,
        [data.room]: [...(prev[data.room] || []), data]
      }));
    });

    return () => {
      socket.off('user_connected');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && activeRoom) {
      const messageData = {
        room: activeRoom,
        content: message,
        sender: 'admin',
        timestamp: new Date()
      };

      socket.emit('send_message', messageData);
      setMessage('');
    }
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
              {rooms.map(roomId => (
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
                  onClick={() => setActiveRoom(roomId)}
                >
                  <Avatar name={roomId} colorPalette={pickPalette(roomId)} />
                  <Text fontWeight="medium">User {roomId}</Text>
                </HStack>
              ))}
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
              <Text fontWeight="semibold">Aingmacan</Text>
            </Box>

            <VStack w="100%" h="calc(100% - 140px)" p={6} overflowY="auto" gap={4}>
              {activeRoom && messages[activeRoom]?.map((msg, index) => (
                <HStack key={index} w="100%" justify={msg.sender === 'admin' ? 'flex-end' : 'flex-start'}>
                  <VStack align={msg.sender === 'admin' ? 'end' : 'start'} maxW="70%">
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
                        [msg.sender === 'admin' ? 'right' : 'left']: '-8px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'inherit',
                        clipPath: msg.sender === 'admin' ? 
                          'polygon(0 0, 100% 0, 100% 100%)' : 
                          'polygon(0 0, 100% 0, 0 100%)'
                      }}
                    >
                      <Text>{msg.content}</Text>
                    </Box>
                    <Text fontSize="xs" color="gray.500" px={2}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>

            <Box
              w="100%"
              p={4}
              borderTop="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
            >
              <HStack w="100%" gap={3}>
                <IconButton
                  aria-label="Attach file"
                  variant="ghost"
                  borderRadius="full"
                  color="blue.500"
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