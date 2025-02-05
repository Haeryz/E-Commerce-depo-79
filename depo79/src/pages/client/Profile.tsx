import { Box, Flex } from '@chakra-ui/react';
import { useColorMode } from '../../components/ui/color-mode';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import { Outlet } from 'react-router-dom';

function Profile() {
  const { colorMode } = useColorMode();

  return (
    <Flex
      p={10}
      gap={10}
      minH="70vh"
      alignItems="flex-start"
    >
      <Box
        flex="0 0 25%"
        maxW="25%"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        boxShadow="md"
        borderRadius="10px"
        p={5}
        minH="70vh"
      >
        <ProfileSidebar />
      </Box>
      <Box
        flex="1"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        boxShadow="md"
        p={8}
        borderRadius="10px"
        minH="70vh"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Profile;
