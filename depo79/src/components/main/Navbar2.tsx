import { useEffect, useState, FormEvent, useRef } from 'react';
import { Button, HStack, IconButton, Text, Input, Image, VStack, Box, Icon } from '@chakra-ui/react';
// Icons
import { MdOutlineShoppingCart, MdChat } from 'react-icons/md';
import { FaMoon, FaSun } from 'react-icons/fa';
// Components
import { useColorMode } from '../ui/color-mode';
import { Field } from '../ui/field';
import { Switch } from '../ui/switch';
import { DrawerBackdrop, DrawerRoot, DrawerTrigger } from '../ui/drawer';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from '../ui/dialog';
// Pages & Components
import Chat from '../../pages/client/Chat';
import MobileDrawer from '../mobile/MobileDrawer';
// Assets
import LogoCompany from '../../assets/LogoCompany.png';
// Navigation
import { Link, useNavigate } from 'react-router-dom';
// Hooks
import { useDebounce } from 'use-debounce';
// Store
import { useAuthStore } from '../../store/auth';
import { useCartStore } from '../../store/cart';
import { useSearchStore } from '../../store/search';
import useCheckoutStore from '../../store/checkout';
import { useProfileStore } from '../../store/profile';
import Pesanan from '../navbar/Pesanan';
import ProfilePopover from '../navbar/ProfilePopover';
import Map from '../maps/Map';

function Navbar2() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
  const { user, isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
  const navigate = useNavigate();
  const cartItemsCount = useCartStore((state) => state.items.length); // Add this near other hooks
  const { fetchProfileCheckouts } = useCheckoutStore();
  const { profile } = useProfileStore(); // Single profile declaration

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Single searchQuery declaration
  const { results, fetchSuggestions, clearResults } = useSearchStore();  // Add clearResults
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPesananOpen, setIsPesananOpen] = useState(false);

  const userName = profile?.nama || "Guest";

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchSuggestions(debouncedSearch);
    }
  }, [debouncedSearch, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add cleanup when component unmounts
  useEffect(() => {
    return () => {
      clearResults();
    };
  }, [clearResults]);

  const handlePesananClick = async () => {
    setIsPopoverOpen(false);
    if (profile?._id) {
      await fetchProfileCheckouts(profile._id);
    }
    setIsPesananOpen(true);
  };


  // General function to handle navigation and scroll to the top
  const handleNavigateToTop = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetUrl: string
  ) => {
    e.preventDefault(); // Prevent default behavior of Link (if it's wrapped in Link)

    // Navigate to the target URL
    navigate(targetUrl, { replace: true });

    // Scroll to the top after navigation (using a slight delay)
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // This ensures smooth scrolling
      });
    }, 150); // A small delay to allow navigation to complete
  };

  const DEPO79_LOCATION: [number, number] = [-8.017783, 112.761155]; // Replace with actual coordinates

  return (
    <HStack
      justify="space-between"
      align="center"
      wrap="nowrap"
      gap={2}
      bg={
        isScrolled
          ? colorMode === "light"
            ? "white"
            : "gray.800"
          : "transparent"
      }
      p={{ base: 2, md: 4 }}
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow={isScrolled ? "md" : "none"}
      transition="background-color 0.3s ease, box-shadow 0.3s ease"
    >
      {/* Logo */}
      <HStack gap={4}>
        <a href="/" onClick={(e) => handleNavigateToTop(e, "/")}>
          <Image src={LogoCompany} w={"24"} />
        </a>
      </HStack>
      <Box display={{ base: "none", md: "flex" }}>
        {/* Home Button */}
        <Link to="/">
          <Button
            onClick={(e) => handleNavigateToTop(e, "/")}
            textStyle=""
            w={16}
            h={11}
            background={
              isScrolled
                ? colorMode === "light"
                  ? "white"
                  : "gray.800"
                : "transparent"
            }
            color={colorMode === "light" ? "black" : "white"}
            border={isScrolled ? "none" : "none"}
            borderColor={
              isScrolled
                ? colorMode === "light"
                  ? "blackAlpha.300"
                  : "whiteAlpha.300"
                : "transparent"
            }
            _hover={{
              background: colorMode === "light" ? "gray.100" : "gray.700", // Adjust hover color based on color mode
            }}
          >
            Home
          </Button>
        </Link>

          {/* Diskon Button */}
          <Button
            textStyle=""
            w={16}
            h={11}
            background={
              isScrolled
                ? colorMode === "light"
                  ? "white"
                  : "gray.800"
                : "transparent"
            }
            color={colorMode === "light" ? "black" : "white"}
            border={isScrolled ? "none" : "none"}
            borderColor={
              isScrolled
                ? colorMode === "light"
                  ? "blackAlpha.300"
                  : "whiteAlpha.300"
                : "transparent"
            }
            _hover={{
              background: isScrolled
                ? colorMode === "light"
                  ? "gray.100"
                  : "gray.700"
                : "transparent",
            }}
            transition="background-color 0.3s ease, border-color 0.3s ease"
          >
            Diskon
          </Button>

          {/* Alamat Button */}
          <DialogRoot
            size="xl"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <DialogTrigger asChild>
              <Button
                textStyle=""
                w={16}
                h={11}
                background={
                  isScrolled
                    ? colorMode === "light"
                      ? "white"
                      : "gray.800"
                    : "transparent"
                }
                color={colorMode === "light" ? "black" : "white"}
                border={isScrolled ? "none" : "none"}
                borderColor={
                  isScrolled
                    ? colorMode === "light"
                      ? "blackAlpha.300"
                      : "whiteAlpha.300"
                    : "transparent"
                }
                _hover={{
                  background: isScrolled
                    ? colorMode === "light"
                      ? "gray.100"
                      : "gray.700"
                    : "transparent",
                }}
                transition="background-color 0.3s ease, border-color 0.3s ease"
              >
                Alamat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lokasi Depo79</DialogTitle>
                <DialogCloseTrigger />
              </DialogHeader>
              <DialogBody>
                <VStack gap={4} align="stretch">
                  <Text>
                    Jl. Raya Tulus Ayu No.171, Tulus Ayu, Tulusbesar, Kec. Tumpang,
                    Kabupaten Malang, Jawa Timur 65156
                  </Text>
                  <Box borderRadius="md" overflow="hidden">
                    <Map position={DEPO79_LOCATION} />
                  </Box>
                </VStack>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </Box>
        <Box 
          position="relative" 
          ref={searchRef}
          w={{ base: "120px", sm: "150px", md: "200px" }}
        >
          <form onSubmit={handleSearch}>
            <Field
              w="100%"
              borderRadius="15px"
              outline="1px solid"
              border="none"
              borderColor={colorMode === "dark" ? "white" : "black"}
              _focus={{
                outline: "1px solid",
                borderRadius: "50px",
                borderColor: colorMode === "dark" ? "white" : "black",
              }}
            >
              <Input
                placeholder="Search"
                border="none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                fontSize={{ base: "xs", md: "sm" }}
              />
            </Field>
          </form>
          {showSuggestions && searchQuery && results.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              mt={2}
              bg={colorMode === "light" ? "white" : "gray.700"}
              borderRadius="md"
              boxShadow="lg"
              zIndex={1000}
              maxH="300px"
              overflowY="auto"
            >
              <VStack align="stretch" gap={0}>
                {results.map((result) => (
                  <Box
                    key={result._id}
                    px={4}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.600' }}
                    onClick={() => {
                      setSearchQuery(result.nama);
                      setShowSuggestions(false);
                      navigate(`/detail-barang/${result._id}`);
                    }}
                  >
                    <HStack gap={3}>
                      <Image
                        src={result.image}
                        alt={result.nama}
                        boxSize="40px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{result.nama}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Rp {result.harga_jual.toLocaleString()}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </HStack>

      {/* Right section - Desktop menu and Mobile drawer */}
      <HStack gap={2}>
        <HStack display={{ base: "none", md: "flex" }}>
          <Switch
            colorScheme={colorMode === "light" ? "teal" : "orange"}
            colorPalette="blue"
            size="lg"
            onChange={toggleColorMode}
            trackLabel={{
              on: (
                <Icon color="yellow.400">
                  <FaSun />
                </Icon>
              ),
              off: (
                <Icon color="gray.400">
                  <FaMoon />
                </Icon>
              ),
            }}
          />
          {isAuthenticated && (
            <>
              <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                  <Button
                    aria-label="Chat"
                    variant="ghost"
                    size="lg"
                    colorScheme={colorMode === "light" ? "teal" : "orange"}
                  >
                    <MdChat />
                  </Button>
                </DrawerTrigger>
                <Chat></Chat>
              </DrawerRoot>
              <Box position="relative" display="inline-block">
                <Link to="/cart">
                  <IconButton
                    aria-label="Shopping Cart"
                    variant="ghost"
                    size="lg"
                    colorScheme={colorMode === "light" ? "teal" : "orange"}
                  >
                    <MdOutlineShoppingCart />
                  </IconButton>
                  {cartItemsCount > 0 && (
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      px={1.5}
                      py={0.5}
                      fontSize="10px"
                      fontWeight="bold"
                      lineHeight="none"
                      color="white"
                      bg="red.500"
                      borderRadius="full"
                      minWidth={4}
                      textAlign="center"
                    >
                      {cartItemsCount}
                    </Box>
                  )}
                </Link>
              </Box>
            </>
          )}
          {isAuthenticated && user ? (
            <>
              <ProfilePopover
                userName={userName}
                isPopoverOpen={isPopoverOpen}
                setIsPopoverOpen={setIsPopoverOpen}
                handlePesananClick={handlePesananClick}
                handleNavigateToTop={handleNavigateToTop}
              />

              <DialogRoot open={isPesananOpen} onOpenChange={(e) => setIsPesananOpen(e.open)}>
                <Pesanan
                  isPesananOpen={isPesananOpen}
                  setIsPesananOpen={setIsPesananOpen}
                />
              </DialogRoot>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              colorScheme="blue"
              height="40px" // Adjust the height to make it more compact
              paddingX="8" // Reduced padding for a more compact look
              fontSize="sm" // Adjust font size if necessary
              _hover={{
                borderRadius: "full", // Change borderRadius to full on hover
              }}
            >
              Login
            </Button>
          )}
        </HStack>
        
        {/* Mobile Menu Button - Always visible on mobile */}
        <Box display={{ base: "block", md: "none" }}>
          <MobileDrawer />
        </Box>
      </HStack>
    </HStack>
  );
}

export default Navbar2;



