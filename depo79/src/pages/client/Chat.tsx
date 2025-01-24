"use client";

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader } from '../../components/ui/drawer';
import { Button } from '../../components/ui/button';
import { useProfileStore } from '../../store/profile'; // Add this import
import { Input, VStack, HStack, Box, Text } from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import { useAuthStore } from '../../store/auth'; // Add this import
import { useNavigate } from 'react-router-dom'; // Add this import

// Change this line:
const socket = io('http://localhost:5000', {
  withCredentials: true
});

function Chat() {
  const { profile, fetchProfile } = useProfileStore(); // Add profile store
  const { user } = useAuthStore(); // Add this
  const navigate = useNavigate(); // Add this
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ room: string; content: string; sender: string; timestamp: Date; }>>([]);
  
  // Use profile._id instead of user.id for room identification
  const roomId = profile?._id || 'guest';

  // Add role check
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/chat');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch profile when component mounts
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    socket.emit('join_room', roomId);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
      socket.emit('leave_room', roomId);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room: roomId,
        content: message,
        sender: roomId, // Use profile ID as sender
        senderName: profile?.nama || 'Guest', // Add sender name
        timestamp: new Date()
      };

      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        {profile ? (
          <Button borderRadius={40}>
            {profile.nama.charAt(0).toUpperCase()}
          </Button>
        ) : (
          <Button borderRadius={40}>Guest</Button>
        )}
      </DrawerHeader>
      
      <DrawerBody>
        <VStack gap={4}>
          {messages.map((msg, index) => (
            <HStack 
              key={index} 
              alignSelf={msg.sender === (profile?._id || 'guest') ? 'flex-end' : 'flex-start'}
            >
              <Box 
                bg={msg.sender === (profile?._id || 'guest') ? 'blue.500' : 'gray.200'}
                color={msg.sender === (profile?._id || 'guest') ? 'white' : 'black'}
                px={4}
                py={2}
                borderRadius="xl"
              >
                <Text>{msg.content}</Text>
                <Text fontSize="xs" opacity={0.7}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </DrawerBody>

      <DrawerFooter>
        <Field w={'xs'}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ketik Disini"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </Field>
        <Button borderRadius={15} onClick={sendMessage}>
          Send
        </Button>
      </DrawerFooter>
      <DrawerCloseTrigger />
    </DrawerContent>
  );
}

export default Chat;
