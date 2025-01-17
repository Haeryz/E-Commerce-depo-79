import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import { Outlet } from 'react-router-dom';

function Profile() {
  return (
    <Flex
      p={10}
      gap={10}
      bg="gray.50"
      minH="70vh" // Ensure Flex has a min height of 70vh
      alignItems="flex-start"
    >
      {/* Sidebar */}
      <Box
        flex="0 0 25%" // Fixed width for the sidebar
        maxW="25%" // Consistent max width
        bg="white"
        boxShadow="md"
        borderRadius="10px"
        p={5}
        minH="70vh" // Match the height of the Flex container
      >
        <ProfileSidebar />
      </Box>
      {/* Main content */}
      <Box
        flex="1"
        bg="white"
        boxShadow="md"
        p={8}
        borderRadius="10px"
        minH="70vh" // Match the height of the Flex container
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Profile;
