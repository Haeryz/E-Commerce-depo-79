import React from 'react';
import { Button, Flex, HStack, IconButton, Text, VStack, Spacer } from '@chakra-ui/react';
import { LuPhone } from 'react-icons/lu';
import { MdOutlineDarkMode } from 'react-icons/md';

function Navbar() {
  return (
    <HStack wrap="wrap" gap="8" margin={4} w="100%">
      {/* Bagian kiri */}
      <HStack>
        <Text>DEPO 79</Text>
      </HStack>

      <Spacer />

      {/* Bagian kanan */}
      <HStack gap={4}>
        <VStack>
          <IconButton
            aria-label="Dark Mode Icon"
            variant="outline"
            size="lg"
          >
            <MdOutlineDarkMode />
          </IconButton>
        </VStack>
        <Button
          textStyle="xs"
          w={16}
          h={11}
          background="black"
          color="white"
          variant="outline"
        >
          Diskon
        </Button>
        <Button
          textStyle="xs"
          w={16}
          h={11}
          background="black"
          color="white"
          variant="outline"
        >
          Alamat
        </Button>
        <Button
          textStyle="xs"
          w={16}
          h={11}
          background="black"
          color="white"
          variant="outline"
          mr={"10"}
        >
          Login
        </Button>
      </HStack>
    </HStack>
  );
}

export default Navbar;
