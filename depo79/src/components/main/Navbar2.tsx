import { useEffect, useState, FormEvent, useRef } from "react";
import {
  Button,
  HStack,
  IconButton,
  Text,
  Spacer,
  Input,
  Image,
  VStack,
  Box,
  Icon,
} from "@chakra-ui/react";
import { MdOutlineShoppingCart, MdChat } from "react-icons/md";
import { useColorMode } from "../ui/color-mode";
import { Field } from "../ui/field";
import { useAuthStore } from "../../store/auth"; // Import the auth store
import { Link, useNavigate } from "react-router-dom";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "../ui/popover";
import { DrawerBackdrop, DrawerRoot, DrawerTrigger } from "../ui/drawer";
import Chat from "../../pages/client/Chat";
import MobileDrawer from "../mobile/MobileDrawer";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useCartStore } from "../../store/cart"; // Add this import at the top with other imports
import LogoCompany from "../../assets/LogoCompany.png";
import { useSearchStore } from "../../store/search";
import { useDebounce } from "use-debounce";
import { Switch } from "../ui/switch";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "../ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";

function Navbar2() {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
  const { user, isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
  const navigate = useNavigate();
  const cartItemsCount = useCartStore((state) => state.items.length); // Add this near other hooks

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { suggestions, fetchSuggestions } = useSearchStore();
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPesananOpen, setIsPesananOpen] = useState(false);

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

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePesananClick = () => {
    setIsPopoverOpen(false); // Close popover
    setIsPesananOpen(true); // Open dialog
  };

  return (
    <HStack
      wrap="wrap"
      gap="7"
      bg={
        isScrolled
          ? colorMode === "light"
            ? "white"
            : "gray.800"
          : "transparent"
      }
      p={4}
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow={isScrolled ? "md" : "none"}
      transition="background-color 0.3s ease, box-shadow 0.3s ease"
    >
      <HStack gap={4}>
        <Link to="/">
          <Image src={LogoCompany} w={"24"} />
        </Link>
      </HStack>
      <Box display={{ base: "none", md: "flex" }}>
        {/* Home Button */}
        <Link to="/">
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
          size="cover"
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
      <Box position="relative" ref={searchRef}>
        <form onSubmit={handleSearch}>
          <Field
            maxW={{ base: "full", sm: "200px", md: "4xs" }}
            borderRadius="15px"
            outline={"1px solid black"}
            border="none"
            _focus={{ outline: "1px solid black", borderRadius: "50px" }}
            order={{ base: 3, sm: "initial" }}
            flexGrow={{ base: 1, sm: 0 }}
          >
            <Input
              placeholder="Search"
              border="none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              _focus={{ outline: "none", boxShadow: "none" }}
              _selection={{
                backgroundColor: "#2563eb",
                color: "white",
              }}
            />
          </Field>
        </form>
        {showSuggestions && searchQuery && suggestions.length > 0 && (
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
              {suggestions.map((suggestion, index) => (
                <Box
                  key={index}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{
                    bg: colorMode === "light" ? "gray.100" : "gray.600",
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Text>{suggestion}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </Box>

      <Spacer />

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
            <PopoverRoot
              open={isPopoverOpen}
              onOpenChange={(e) => setIsPopoverOpen(e.open)}
            >
              <PopoverTrigger asChild>
                <Button borderRadius={40}>
                  {user.name.charAt(0).toUpperCase()}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                borderRadius="md"
                boxShadow="lg"
                backgroundColor={colorMode === "light" ? "white" : "gray.700"}
              >
                <PopoverArrow />
                <PopoverBody>
                  <VStack>
                    <Text mb="0">{user.name}</Text>
                    <Button
                      pl={10}
                      pr={10}
                      onClick={() => navigate("/profile/profile-sidebar")}
                    >
                      Setting
                    </Button>
                    <Button pl={6} pr={7} onClick={() => navigate("/profile")}>
                      Buy History
                    </Button>
                    <Button onClick={() => navigate("/profile")}>
                      Review History
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePesananClick}
                    >
                      Pesanan
                    </Button>
                    <Button
                      color={colorMode === "light" ? "white" : "black"}
                      backgroundColor={colorMode === "light" ? "red" : "pink"}
                      onClick={() =>
                        useAuthStore.getState().logout(() => navigate("/"))
                      }
                    >
                      Logout
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>

            <DialogRoot
              open={isPesananOpen}
              onOpenChange={(e) => setIsPesananOpen(e.open)}
            >
              <DialogContent p={10}>
                <TimelineRoot maxW="400px">
                  <TimelineItem>
                    <TimelineConnector>
                      <LuShip />
                    </TimelineConnector>
                    <TimelineContent>
                      <TimelineTitle>Product Shipped</TimelineTitle>
                      <TimelineDescription>13th May 2021</TimelineDescription>
                      <Text textStyle="sm">
                        We shipped your product via <strong>FedEx</strong> and
                        it should arrive within 3-5 business days.
                      </Text>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineConnector>
                      <LuCheck />
                    </TimelineConnector>
                    <TimelineContent>
                      <TimelineTitle textStyle="sm">
                        Order Confirmed
                      </TimelineTitle>
                      <TimelineDescription>18th May 2021</TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineConnector>
                      <LuPackage />
                    </TimelineConnector>
                    <TimelineContent>
                      <TimelineTitle textStyle="sm">
                        Order Delivered
                      </TimelineTitle>
                      <TimelineDescription>
                        20th May 2021, 10:30am
                      </TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                </TimelineRoot>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            colorScheme="blue"
            borderRadius="full"
            height="40px" // Adjust the height to make it more compact
            paddingX="8" // Reduced padding for a more compact look
            fontSize="sm" // Adjust font size if necessary
          >
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
