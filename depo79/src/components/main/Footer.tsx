import React from 'react';
import { Button, HStack, IconButton, Text, Spacer, VStack, Separator, Image, Input } from '@chakra-ui/react';
import { MdOutlineDarkMode } from 'react-icons/md';
import { FaRegCopyright } from "react-icons/fa";
import { useColorMode } from '../ui/color-mode';
import { Link } from 'react-router-dom';
import { Field } from '../ui/field';


function Footer() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function

  return (
    <HStack wrap="wrap" gap="4" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
      <HStack pl={10} pb={2} pt={2}>
        <VStack alignItems={'flex-start'}>
          <Link to="/">
            <Image
              src="https://bit.ly/naruto-sage"
              boxSize="45px"
              borderRadius="full"
              fit="cover"
              alt="Naruto Uzumaki"
              alignSelf={'flex-start'}
            />
          </Link>
          <Text>
            Dapatkan Kabar Terbaru dan terupdate produk kami <br />
            dan diskon untuk semua item
          </Text>
          <HStack>
            <Field
              w={'295px'}
              borderRadius="15px"
              outline={'1px solid black'}
              border="none"
              _focus={{ outline: '1px solid black', borderRadius: '50px' }}
            >
              <Input
                placeholder="Your Email"
                border="none"
                _focus={{ outline: 'none', boxShadow: 'none' }}
              />
            </Field>
            <Button borderRadius={"15px"}> Kirim </Button>
          </HStack>
        </VStack>
        <VStack pl={"150px"}>
          <Text>
            Rawr
          </Text>
        </VStack>

      </HStack>

      <Separator />

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

    </HStack>
  );
}

export default Footer