import { Box, Button, Text, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore((state) => state); // Get user, logout, and isAuthenticated from the store
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Navigate to login page if not authenticated
    }
  }, [isAuthenticated, navigate]); // Trigger re-render and navigate when isAuthenticated changes

  const handleLogout = () => {
    logout(); // Call the logout function from the store
  };

  if (!isAuthenticated) {
    return (
      <Box mt={20} maxW="sm" mx="auto" p={4} borderWidth={1} borderRadius="md">
        <Text textAlign="center">Please log in to view your data.</Text>
      </Box>
    );
  }

  return (
    <Box mt={20} maxW="sm" mx="auto" p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Welcome, {user?.name}
      </Text>

      <Stack align="center">
        <Text>Email: {user?.email}</Text>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
