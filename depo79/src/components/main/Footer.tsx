import React from 'react';
import { Button, HStack, IconButton, Text, Spacer, VStack, Separator, Image, Input, Box, Stack } from '@chakra-ui/react';
import { MdOutlineDarkMode } from 'react-icons/md';
import { FaRegCopyright } from "react-icons/fa";
import { useColorMode } from '../ui/color-mode';
import { Link } from 'react-router-dom';
import { Field } from '../ui/field';

function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      wrap="wrap"
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      p={4}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        w="full"
        pl={{ base: 4, md: 10 }}
        pb={2}
        pt={2}
      >
        {/* Newsletter Section */}
        <VStack alignItems={'flex-start'} flex="1" maxW={{ base: "full", md: "400px" }}>
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
          <Stack
            direction={{ base: "column", sm: "row" }}
            w={{ base: "full", sm: "auto" }}
          >
            <Field
              w={{ base: "full", sm: '295px' }}
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
            <Button borderRadius="15px" w={{ base: "full", sm: "auto" }}>
              Kirim
            </Button>
          </Stack>
        </VStack>

        {/* Spacer untuk mendorong section berikutnya ke kanan */}
        <Spacer display={{ base: "none", md: "block" }} />

        {/* Product Section */}
        <Stack
          direction={{ base: "column", md: "row" }}
          ml={{ base: 0, md: "auto" }}
          pr={{ base: 0, md: 4 }}
        >
          <VStack alignItems={'flex-start'}>
            <Text fontWeight="bold">Product</Text>
            {["Kayu", "Semen", "Paku", "Cat", "Keramik"].map((item) => (
              <Button
                key={item}
                textStyle="md"
                w={16}
                h={5}
                background={colorMode === 'light' ? 'white' : 'gray.800'}
                color={"gray.400"}
                variant="ghost"
              >
                {item}
              </Button>
            ))}
          </VStack>

          <VStack alignItems={'flex-start'} mt={{ base: 0, md: "32px" }} ml={10}>
            {["Elektrik", "Kaca", "Alumunium", "Pipa"].map((item) => (
              <Button
                key={item}
                textStyle="md"
                w={16}
                h={5}
                background={colorMode === 'light' ? 'white' : 'gray.800'}
                color={"gray.400"}
                variant="ghost"
              >
                {item}
              </Button>
            ))}
          </VStack>

          {/* Social Media Section */}
          <VStack alignItems={'flex-start'} ml={10}>
            <Text fontWeight="bold">Sosmed</Text>
            {["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube"].map((item) => (
              <Button
                key={item}
                textStyle="md"
                w={16}
                h={5}
                background={colorMode === 'light' ? 'white' : 'gray.800'}
                color={"gray.400"}
                variant="ghost"
              >
                {item}
              </Button>
            ))}
          </VStack>
        </Stack>
      </Stack>

      <Separator />

      {/* Bottom Footer */}
      <Stack
        direction={{ base: "column", md: "row" }}
        w="full"
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
      >
        <HStack justify={{ base: "center", md: "flex-start" }}>
          <IconButton
            aria-label="Copyright"
            variant="ghost"
            size="xs"
            colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
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
        </HStack>

        <Stack
          direction={{ base: "column", sm: "row" }}
          align="center"
          justify={{ base: "center", md: "flex-end" }}
        >
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
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Footer;