import React from 'react';
import { Button, HStack, IconButton, Text, Spacer } from '@chakra-ui/react';
import { MdOutlineDarkMode } from 'react-icons/md';
import { FaRegCopyright } from "react-icons/fa";
import { useColorMode } from '../ui/color-mode';


function Footer() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function

  return (
    <HStack wrap="wrap" gap="4" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
      <HStack>
        <IconButton
          aria-label="Toggle theme"
          variant="ghost"
          size="xs"
          colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
          onClick={toggleColorMode}
        >
          <FaRegCopyright />
        </IconButton>
        <Text>2025 Depo79 Production</Text>
      </HStack>
      <Button
        textStyle="md"
        w={16}
        h={11}
        background={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        variant="ghost"
      >
        Diskon
      </Button>
      <Button
        textStyle="md"
        w={16}
        h={11}
        background={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'black' : 'white'}
        variant="ghost"
      >
        Alamat
      </Button>

      <Spacer />

      <HStack gap={2}>
        <IconButton
          aria-label="Toggle theme"
          variant="ghost"
          size="lg"
          colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
          onClick={toggleColorMode}
        >
          <MdOutlineDarkMode />
        </IconButton>
        <Button
          textStyle="md"
          w={32}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="ghost"
        >
          Privacy Policy
        </Button>
        <Button
          textStyle="md"
          w={16}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="ghost"
        >
          Cookie
        </Button>
        <Button
          textStyle="md"
          w={16}
          h={11}
          background={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
          variant="ghost"
        >
          Terms
        </Button>

      </HStack>
    </HStack>
  );
}

export default Footer