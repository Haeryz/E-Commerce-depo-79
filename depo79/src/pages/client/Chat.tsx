import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../../components/ui/drawer";
import { Button } from "../../components/ui/button";
import { useProfileStore } from "../../store/profile";
import { Input, VStack, HStack, Box, Text } from "@chakra-ui/react";
// import { useAuthStore } from "../../store/auth";
// import { useNavigate } from "react-router-dom";

// Socket connection setup:
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function Chat() {
  const { profile, fetchProfile } = useProfileStore();
  // const { user } = useAuthStore();
  // const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ content: string; sender: string; timestamp: Date }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roomId = profile?._id || "guest";

  // Fetch profile and messages when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  // Send message when the "Send" button is clicked or Enter key is pressed
  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room: roomId,
        content: message,
        sender: roomId,
        senderName: profile?.nama || "Guest",
        timestamp: new Date(),
      };

      socket.emit("send_message", messageData);
      setMessage(""); // Reset message input after sending
    }
  };

  // Handle file selection for uploading
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !roomId) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result?.toString().split(",")[1];

      const messageData = {
        room: roomId,
        content: `Sent file: ${file.name}`,
        sender: roomId,
        senderName: profile?.nama || "Guest",
        timestamp: new Date(),
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data,
        },
      };

      socket.emit("send_message", messageData);
    };
    reader.readAsDataURL(file);
  };

  return (
    <DrawerContent width="800px" transition="width 0.3s ease-in-out">
      <DrawerHeader>
        {profile ? (
          <Button borderRadius={40}>
            {profile.nama.charAt(0).toUpperCase()}
          </Button>
        ) : (
          <Button borderRadius={40}>Guest</Button>
        )}
      </DrawerHeader>

      <DrawerBody p={4}>
        <VStack gap={3} align="stretch" overflowY="auto" h="100%">
          {messages.map((msg, index) => {
            const isSender = msg.sender === (profile?._id || "guest");
            return (
              <Box
                key={index}
                display="flex"
                justifyContent={isSender ? "flex-end" : "flex-start"}
                px={2}
                py={1}
              >
                <Box
                  bg={isSender ? "blue.500" : "gray.100"}
                  color={isSender ? "white" : "black"}
                  px={4}
                  py={2}
                  borderRadius={
                    isSender ? "20px 20px 0 20px" : "20px 20px 20px 0"
                  }
                  maxWidth="80%"
                  boxShadow="sm"
                >
                  <Text fontSize="md">{msg.content}</Text>
                  <Text
                    fontSize="xs"
                    opacity={0.8}
                    textAlign={isSender ? "right" : "left"}
                    mt={1}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </VStack>
      </DrawerBody>

      <DrawerFooter>
        <HStack w="full" spacing={4} align="center">
    
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            h={14}
            resize="none"
            flex={1} 
          />

        
          <HStack spacing={4}>
           
            <Button
              variant="link"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach File"
              borderRadius="full"
              // padding={3}
            >
              <i
                className="bx bxs-cloud-upload"
                style={{ fontSize: "24px" }}
              ></i>
            </Button>

            <Button
              variant="link"
              onClick={sendMessage}
              aria-label="Send Message"
              borderRadius="full"
              // padding={10}
              isDisabled={!message.trim()}
            >
              <i
                className="bx bx-up-arrow-alt"
                style={{ fontSize: "24px" }}
              ></i>
            </Button>
          </HStack>
        </HStack>

        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </DrawerFooter>

      <DrawerCloseTrigger />
    </DrawerContent>
  );
}

export default Chat;
