import React from 'react';
import { Button, Flex, HStack, IconButton, Text, VStack, Spacer  } from '@chakra-ui/react';
import { LuPhone } from 'react-icons/lu';
import { MdOutlineDarkMode } from 'react-icons/md';
import { useColorMode } from '../ui/color-mode'

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode() // Access color mode and toggle function

  return (
    <HStack wrap="wrap" gap="8" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
      <For each={["xs"]}>
        {(size) => (
          <VStack key={size}>
            <IconButton
              aria-label="Phone icon"
              variant="outline"
              size={size}
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Dynamically change color based on color mode
            >
              <LuPhone />
            </IconButton>
            <Text textStyle="xs" color={colorMode === 'light' ? 'black' : 'white'}>{size}</Text>
          </VStack>
        )}
      </For>

      {/* Toggle Button for Light/Dark Mode */}
      <IconButton
        aria-label="Toggle theme"
        variant="outline"
        size="xs" // Use the same size as the other buttons
        colorScheme={colorMode === 'light' ? 'teal' : 'orange'} // Same color scheme
        onClick={toggleColorMode} // Toggle color mode when clicked
      >
        <LuPhone /> {/* You can use the same icon for the toggle */}
      </IconButton>
    </HStack>
  );
}

export default Navbar;

