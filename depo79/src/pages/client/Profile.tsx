import { Box, Flex } from '@chakra-ui/react';
import { useColorMode } from '../../components/ui/color-mode';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import { Outlet } from 'react-router-dom';

function Profile() {
  const { colorMode } = useColorMode();

  return (
    <Flex
      direction={["column","row"]}
      p={[4,6,10]}
      gap={[4,6,10]}
      alignItems="stretch"
      height="auto"
    >
      <Box
        w={["100%","25%"]}
        h={["100%","25%"]}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        boxShadow="md"
        borderRadius="10px"
        p={5}
        height="auto"
      >
        <ProfileSidebar />
      </Box>
      <Box
        w={["100%","75%"]}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        boxShadow="md"
        p={8}
        borderRadius="10px"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

export default Profile;
