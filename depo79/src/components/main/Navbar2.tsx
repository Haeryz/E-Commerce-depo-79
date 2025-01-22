import { useEffect, useState, FormEvent } from 'react';
import { Button, HStack, IconButton, Text, Spacer, Input, Image, VStack, Box } from '@chakra-ui/react';
import { MdOutlineDarkMode, MdOutlineShoppingCart, MdChat } from 'react-icons/md';
import { useColorMode } from '../ui/color-mode';

import { Field } from '../ui/field';
import { useAuthStore } from "../../store/auth"; // Import the auth store
import { Link, useNavigate } from 'react-router-dom';
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { DrawerBackdrop, DrawerRoot, DrawerTrigger } from '../ui/drawer';
import Chat from '../../pages/client/Chat';
import MobileDrawer from '../mobile/MobileDrawer';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '../ui/dialog';


function Navbar2() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
  const { user, isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <HStack gap={4}>
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
      <Box display={{ base: 'none', md: 'flex' }}>
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
        <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom">
          <DialogTrigger asChild>
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
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>
            <DialogBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogBody>
          </DialogContent>
        </DialogRoot>

      </Box>
      <form onSubmit={handleSearch}>
        <Field
          maxW={{ base: 'full', sm: '200px', md: '4xs' }}
          borderRadius="15px"
          outline={'1px solid black'}
          border="none"
          _focus={{ outline: '1px solid black', borderRadius: '50px' }}
          order={{ base: 3, sm: 'initial' }}
          flexGrow={{ base: 1, sm: 0 }}
        >
          <Input
            placeholder="Search"
            border="none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            _focus={{ outline: 'none', boxShadow: 'none' }}
          />
        </Field>
      </form>

      <Spacer />

      <HStack display={{ base: 'none', md: 'flex' }} >
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
            <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DrawerBackdrop />
              <DrawerTrigger asChild>
                <Button
                  aria-label="Chat"
                  variant="ghost"
                  size="lg"
                  colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
                >
                  <MdChat />
                </Button>
              </DrawerTrigger>
              <Chat></Chat>
            </DrawerRoot>
            <Link to="/cart">

              <IconButton
                aria-label="Shopping Cart"
                variant="ghost"
                size="lg"
                colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
              >
                <MdOutlineShoppingCart />
              </IconButton>
            </Link>
          </>
        )}
        {isAuthenticated && user ? (
          <PopoverRoot >
            <PopoverTrigger asChild>
              <Button borderRadius={40}>
                {user.name.charAt(0).toUpperCase()}
              </Button>
            </PopoverTrigger >
            <PopoverContent
              borderRadius="md"
              boxShadow="lg"
              backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}
            >
              <PopoverArrow />
              <PopoverBody>
                <VStack>
                  <Text mb="0">{user.name}</Text>
                  <Button pl={10} pr={10} onClick={() => navigate("/profile/profile-sidebar")}>Setting</Button>
                  <Button pl={6} pr={7} onClick={() => navigate("/profile")}>Buy History</Button>
                  <Button onClick={() => navigate("/profile")}>Review History</Button>
                  <Button 
                    color={colorMode === 'light' ? 'white' : 'black'} 
                    backgroundColor={colorMode === 'light' ? 'red' : 'pink'} 
                    onClick={() => useAuthStore.getState().logout(() => navigate("/"))}
                  >
                    Logout
                  </Button>
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

      {/* Mobile Menu Button */}
      <MobileDrawer />
    </HStack>
  );
}

export default Navbar2;