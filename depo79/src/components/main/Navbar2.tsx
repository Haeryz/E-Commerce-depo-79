import React from 'react';
import { Button, HStack, IconButton, Text, Spacer, Input, Image } from '@chakra-ui/react';
import { MdOutlineDarkMode, MdOutlineShoppingCart, MdChat } from 'react-icons/md';
import { useColorMode } from '../ui/color-mode';
import { Avatar } from '../ui/avatar';
import { Field } from '../ui/field';
import { useAuthStore } from "../../store/auth"; // Import the auth store
import { Link, useNavigate } from 'react-router-dom';

function Navbar2() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
  const { user, isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
  const navigate = useNavigate();

  const colorPalette = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };

  return (
    <HStack wrap="wrap" gap="7" bg={colorMode === 'light' ? 'white' : 'gray.800'} p={4}>
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
          variant="outline"
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
              variant="outline"
              size="lg"
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            >
              <MdChat />
            </IconButton>
            <IconButton
              aria-label="Shopping Cart"
              variant="outline"
              size="lg"
              colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
            >
              <MdOutlineShoppingCart />
            </IconButton>
          </>
        )}
        {isAuthenticated && user ? (
          <Avatar name={user.name} colorPalette={pickPalette(user.name)} />
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
