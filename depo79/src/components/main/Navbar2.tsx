import React, { useEffect, useState } from 'react';
import { Button, HStack, IconButton, Text, Spacer, Input, Image, VStack } from '@chakra-ui/react';
import { MdOutlineDarkMode, MdOutlineShoppingCart, MdChat } from 'react-icons/md';
import { useColorMode } from '../ui/color-mode';
import { Avatar } from '../ui/avatar';
import { Field } from '../ui/field';
import { useAuthStore } from "../../store/auth"; // Import the auth store
import { Link, useNavigate } from 'react-router-dom';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';

function Navbar2() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
  const { user, isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const colorPalette = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <HStack
      wrap="wrap"
      gap="7"
      bg={isScrolled ? (colorMode === 'light' ? 'white' : 'gray.800') : 'transparent'}
      p={4}
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow={isScrolled ? 'md' : 'none'}
      transition="background-color 0.3s ease, box-shadow 0.3s ease"
    >
      <HStack>
        <Link to="/">
          <Image
            src="https://bit.ly/naruto-sage"
            boxSize="45px"
            borderRadius="full"
            fit="cover"
            alt="Naruto Uzumaki"
          />
        </Link>
      </HStack>
      <Button
        textStyle=""
        w={16}
        h={11}
        background={isScrolled ? (colorMode === 'light' ? 'white' : 'gray.800') : 'transparent'}
        color={colorMode === 'light' ? 'black' : 'white'}
        border={isScrolled ? 'none' : 'none'}
        borderColor={isScrolled ? (colorMode === 'light' ? 'blackAlpha.300' : 'whiteAlpha.300') : 'transparent'}
        _hover={{
          background: isScrolled ? (colorMode === 'light' ? 'gray.100' : 'gray.700') : 'transparent',
        }}
        transition="background-color 0.3s ease, border-color 0.3s ease"
      >
        Diskon
      </Button>
      <Button
        textStyle=""
        w={16}
        h={11}
        background={isScrolled ? (colorMode === 'light' ? 'white' : 'gray.800') : 'transparent'}
        color={colorMode === 'light' ? 'black' : 'white'}
        border={isScrolled ? 'none' : 'none'}
        borderColor={isScrolled ? (colorMode === 'light' ? 'blackAlpha.300' : 'whiteAlpha.300') : 'transparent'}
        _hover={{
          background: isScrolled ? (colorMode === 'light' ? 'gray.100' : 'gray.700') : 'transparent',
        }}
        transition="background-color 0.3s ease, border-color 0.3s ease"
      >
        Alamat
      </Button>

      <Spacer />

      <HStack>
        <Field
          w={'xs'}
          borderRadius="15px"
          outline={'1px solid black'}
          border="none"
          _focus={{ outline: '1px solid black', borderRadius: '50px' }}
        >
          <Input
            placeholder="Search"
            border="none"
            _focus={{ outline: 'none', boxShadow: 'none' }}
          />
        </Field>
        <IconButton
          aria-label="Toggle theme"
          variant="ghost"
          size="lg"
          colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
          onClick={toggleColorMode}
        >
          <MdOutlineDarkMode />
        </IconButton>
        {isAuthenticated && (
          <>
            <IconButton
              aria-label="Chat"
              variant="ghost"
              size="lg"
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            >
              <MdChat />
            </IconButton>
            <IconButton
              aria-label="Shopping Cart"
              variant="ghost"
              size="lg"
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            >
              <MdOutlineShoppingCart />
            </IconButton>
          </>
        )}
        {isAuthenticated && user ? (
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Avatar name={user.name} colorPalette={pickPalette(user.name)} />
            </PopoverTrigger>
            <PopoverContent
              bg="white"
              borderRadius="md"
              boxShadow="lg"
            >
              <PopoverArrow />
              <PopoverBody>
                <VStack>
                  <Text mb="4">{user.name}</Text>
                  <Button onClick={() => navigate("/profile")}>Profile</Button>
                  <Button onClick={() => useAuthStore.getState().logout()}>Logout</Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        ) : (
          <Button onClick={() => navigate('/login')} colorScheme="blue">
            Login
          </Button>
        )}
      </HStack>
    </HStack>
  );
}

export default Navbar2;