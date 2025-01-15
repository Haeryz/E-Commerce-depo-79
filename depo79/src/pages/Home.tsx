import { Box, Button, Text, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Home: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore((state) => state);
  const navigate = useNavigate();

  return (
    <Box mt={20} maxW="sm" mx="auto" p={4} borderWidth={1} borderRadius="md">
      {isAuthenticated ? (
        // Tampilan untuk user yang sudah login
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
            Welcome, {user?.name}
          </Text>
          <Stack align="center">
            <Text>Email: {user?.email}</Text>
            <Button onClick={logout} colorScheme="red">
              Logout
            </Button>
          </Stack>
        </>
      ) : (
        // Tampilan untuk user yang belum login
        <Stack align="center">
          <Text>Welcome to Our Website</Text>
          <Button onClick={() => navigate("/login")} colorScheme="blue">
            Login
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Home;
