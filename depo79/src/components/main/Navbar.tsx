import React from 'react';
import { Button, Flex, HStack, IconButton, Text, VStack, Spacer, For  } from '@chakra-ui/react';
import { MdOutlineDarkMode, MdLightMode } from 'react-icons/md';
import { useColorMode } from '../ui/color-mode'

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode() // Access color mode and toggle function

  return (
    
    <HStack wrap="wrap" gap="8" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
      <HStack>
        <Text>DEPO 79</Text>
      </HStack>

    <Spacer/>

      <HStack>
      {/* Toggle Button for Light/Dark Mode */}
      <IconButton
        aria-label="Toggle theme"
        variant="outline"
        size="lg" // Use the same size as the other buttons
        colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Same color scheme
        onClick={toggleColorMode} // Toggle color mode when clicked
      >
        <MdOutlineDarkMode />        {/* You can use the same icon for the toggle */}
      </IconButton>
      <Button
          textStyle="xs"
          w={16}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="outline"
        >
          Diskon
        </Button>
        <Button
          textStyle="xs"
          w={16}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="outline"
        >
          Alamat
        </Button>
        <Button
          textStyle="xs"
          w={16}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="outline"
          mr={"3"}
        >
          Login
        </Button>
      </HStack>
    </HStack>
  );
}

export default Navbar;