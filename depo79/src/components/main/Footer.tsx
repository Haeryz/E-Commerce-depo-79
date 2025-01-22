import React from 'react';
import { Button, HStack, IconButton, Text, VStack, Separator, Image, Input, Stack } from '@chakra-ui/react';
import { MdOutlineDarkMode } from 'react-icons/md';
import { FaRegCopyright } from "react-icons/fa";
import { useColorMode } from '../ui/color-mode';
import { Link } from 'react-router-dom';
import { Field } from '../ui/field';

function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack
      direction="column"
      gap={6}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      p={[4, 6, 8]}
    >
      {/* Main Footer Content */}
      <Stack
        direction={['column', 'column', 'row']}
        w="full"
        gap={[8, 8, 10]}
        px={[4, 6, 10]}
      >
        {/* Newsletter Section */}
        <VStack
          alignItems="flex-start"
          gap={4}
          w={['full', 'full', '400px']}
        >
          <Link to="/">
            <Image
              src="https://bit.ly/naruto-sage"
              boxSize={['40px', '45px']}
              borderRadius="full"
              fit="cover"
              alt="Naruto Uzumaki"
            />
          </Link>
          <Text fontSize={['sm', 'md']}>
            Dapatkan Kabar Terbaru dan terupdate produk kami dan diskon untuk semua item
          </Text>
          <Stack
            direction={['column', 'row']}
            w="full"
            gap={3}
          >
            <Field
              w={['full', '295px']}
              borderRadius="15px"
              outline="1px solid black"
              border="none"
              _focus={{ outline: '1px solid black', borderRadius: '50px' }}
            >
              <Input
                placeholder="Your Email"
                border="none"
                _focus={{ outline: 'none', boxShadow: 'none' }}
                _selection={{
                  backgroundColor: '#2563eb',
                  color: 'white'
              }}
              />
            </Field>
            <Button
              borderRadius="15px"
              w={['full', 'auto']}
              minW={['full', '100px']}
            >
              Kirim
            </Button>
          </Stack>
        </VStack>

        {/* Links Sections */}
        <Stack
          direction={['column', 'column', 'row']}
          gap={[6, 8, 10]}
          w={['full', 'full', 'auto']}
          ml={[0, 0, 'auto']}
        >
          {/* Product Section */}
          <Stack direction={['row', 'row', 'row']} gap={[8, 10, 12]}>
            <VStack alignItems="flex-start" gap={2}>
              <Text fontWeight="bold" fontSize={['md', 'lg']}>Product</Text>
              {["Kayu", "Semen", "Paku", "Cat", "Keramik"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  height="32px"
                  justifyContent="flex-start"
                  px={2}
                  color="gray.400"
                  _hover={{ bg: 'transparent', color: colorMode === 'light' ? 'black' : 'white' }}
                >
                  {item}
                </Button>
              ))}
            </VStack>

            <VStack alignItems="flex-start" gap={2} mt={[0, 0, '32px']}>
              {["Elektrik", "Kaca", "Alumunium", "Pipa"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  height="32px"
                  justifyContent="flex-start"
                  px={2}
                  color="gray.400"
                  _hover={{ bg: 'transparent', color: colorMode === 'light' ? 'black' : 'white' }}
                >
                  {item}
                </Button>
              ))}
            </VStack>
            
            {/* Social Media Section */}
            <VStack alignItems="flex-start" gap={2}>
              <Text fontWeight="bold" fontSize={['md', 'lg']}>Sosmed</Text>
              {["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  height="32px"
                  justifyContent="flex-start"
                  px={2}
                  color="gray.400"
                  _hover={{ bg: 'transparent', color: colorMode === 'light' ? 'black' : 'white' }}
                >
                  {item}
                </Button>
              ))}
            </VStack>
          </Stack>
        </Stack>
      </Stack>

      <Separator />

      {/* Bottom Footer */}
      <Stack
        direction={['column', 'column', 'row']}
        w="full"
        justify="space-between"
        align={['center', 'center', 'center']}
        gap={[4, 4, 0]}
        px={[4, 6, 10]}
        py={2}
      >
        <Stack
          direction={['column', 'row']}
          align="center"
          gap={[2, 4]}
        >
          <HStack>
            <IconButton
              aria-label="Copyright"
              variant="ghost"
              size="xs"
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            >
              <FaRegCopyright />
            </IconButton>
            <Text fontSize={['sm', 'md']}>2025 Depo79 Production</Text>
          </HStack>
          <HStack gap={2}>
            <Button
              variant="ghost"
              size={['sm', 'md']}
              color={colorMode === 'light' ? 'black' : 'white'}
            >
              Diskon
            </Button>
            <Button
              variant="ghost"
              size={['sm', 'md']}
              color={colorMode === 'light' ? 'black' : 'white'}
            >
              Alamat
            </Button>
          </HStack>
        </Stack>

        <Stack
          direction={['column', 'row']}
          align="center"
          gap={[2, 4]}
        >
          <IconButton
            aria-label="Toggle theme"
            variant="ghost"
            size={['md', 'lg']}
            colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            onClick={toggleColorMode}
          >
            <MdOutlineDarkMode />
          </IconButton>
          <HStack gap={2}>
            <Button
              variant="ghost"
              size={['sm', 'md']}
              color={colorMode === 'light' ? 'black' : 'white'}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              size={['sm', 'md']}
              color={colorMode === 'light' ? 'black' : 'white'}
            >
              Cookie
            </Button>
            <Button
              variant="ghost"
              size={['sm', 'md']}
              color={colorMode === 'light' ? 'black' : 'white'}
            >
              Terms
            </Button>
          </HStack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Footer;