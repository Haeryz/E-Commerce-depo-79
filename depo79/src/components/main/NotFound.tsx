import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center bg-black text-white"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 150px)", // Adjust based on your Navbar and Footer height
      }}
    >
      <Box
        className="text-center p-6 bg-black rounded-lg shadow-lg"
        style={{
          maxWidth: "500px", // Adjust the width as needed
          padding: "50px 30px",
          backgroundColor: "#1d1d1d", // Dark background to match image
          borderRadius: "10px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Slight shadow for depth
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Heading
          className="text-6xl font-extrabold text-white mb-4"
          style={{
            fontSize: "90px", // Adjust the font size of the "404" to match the image
            color: "#fff", // White color for the "404"
            lineHeight: "1", // Ensures tight line spacing
            fontWeight: "900", // Heavier weight for emphasis
            marginBottom: "20px", // Space between the 404 text and the rest of the content
          }}
        >
          404
        </Heading>
        <Text
          className="text-xl text-gray-300 mb-6"
          style={{
            color: "#b5b5b5", // Light gray color for the text to match the image
            fontSize: "18px", // Adjust font size of the message
          }}
        >
          The page you are looking for doesn't exist.
        </Text>
        <VStack spacing={4}>
          <Button
            as={Link}
            to="/"
            className="px-8 py-4 bg-gray-600 text-white text-lg rounded-full hover:bg-gray-500 transition-all duration-300"
            style={{
              padding: "15px 30px", // Matching button size from the image
              fontSize: "18px", // Adjust button text size
              backgroundColor: "#3a3a3a", // gray-600 for the button
              borderRadius: "30px", // Rounded edges for the button
              width: "100%", // Button takes full width inside the box
              border: "none", // Remove any borders
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Soft shadow around the button
            }}
          >
            Return Home
          </Button>
        </VStack>
      </Box>
    </motion.div>
  );
}
