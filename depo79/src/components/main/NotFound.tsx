import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useColorMode } from '../ui/color-mode'
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { colorMode } = useColorMode(); // Get the current color mode

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 150px)", // Adjust based on your Navbar and Footer height
        backgroundColor: colorMode === "light" ? "#f7f7f7" : "#1d1d1d", // Light mode background
      }}
    >
      <Box
        className="text-center p-6 rounded-lg shadow-lg"
        style={{
          maxWidth: "500px",
          padding: "50px 30px",
          backgroundColor: colorMode === "light" ? "#ffffff" : "#1d1d1d", // Card background color
          borderRadius: "10px",
          boxShadow: colorMode === "light" ? "0 4px 10px rgba(0, 0, 0, 0.1)" : "0 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for light mode
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading
          className="text-6xl font-extrabold mb-4"
          style={{
            fontSize: "90px",
            color: colorMode === "light" ? "#000000" : "#ffffff", // Heading color based on mode
            marginBottom: "20px",
          }}
        >
          404
        </Heading>
        <Text
          className="text-lg mb-4"
          style={{
            fontSize: "18px",
            color: colorMode === "light" ? "#333333" : "#b5b5b5", // Text color for light mode
            marginBottom: "20px",
          }}
        >
          Sorry, the page you're looking for doesn't exist.
        </Text>
        <Button
          as={Link}
          to="/"
          colorScheme="teal"
          size="lg"
          style={{
            backgroundColor: "#38B2AC", // Button color
            padding: "12px 24px",
            borderRadius: "5px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Go Back Home
        </Button>
      </Box>
    </motion.div>
  );
}
