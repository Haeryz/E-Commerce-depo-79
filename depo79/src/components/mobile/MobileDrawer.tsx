import { useEffect, useState } from 'react'
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { IconButton, Input, Text, VStack, Box, Stack } from '@chakra-ui/react'
import { MdChat, MdMenu, MdOutlineDarkMode, MdOutlineShoppingCart } from 'react-icons/md'
import { Button } from '../ui/button'
import { useAuthStore } from '../../store/auth'
import { useNavigate } from 'react-router-dom'
import { useColorMode } from '../ui/color-mode'
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTrigger } from '../ui/dialog'
import { Field } from '../ui/field'
import { useCartStore } from "../../store/cart"; // Add this import at the top
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '../ui/timeline'
import { LuCheck, LuPackage, LuShip } from 'react-icons/lu'

const MobileDrawer = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
    const { isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
    const { user } = useAuthStore((state) => state); // Access user and authentication state
    const navigate = useNavigate();
    const cartItemsCount = useCartStore((state) => state.items.length); // Add this near other hooks

    const handleNavigation = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    const [isScrolled, setIsScrolled] = useState(false); // Fix the comma
    const [open, setOpen] = useState(false);
    const [isPesananOpen, setIsPesananOpen] = useState(false);

    const handlePesananClick = () => {
        setOpen(false); // Close popover
        setIsPesananOpen(true); // Open dialog
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
        <Stack>
            <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        aria-label="Open menu"
                        variant="ghost"
                        bg={isScrolled ? 'white' : 'transparent'} // Add usage of isScrolled
                    >
                        <MdMenu />
                    </IconButton>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Depo 79</DrawerTitle>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack align="stretch" gap={4}>
                            <Button variant="ghost">Diskon</Button>
                            <Button variant="ghost">Alamat</Button>
                            <IconButton
                                aria-label="Toggle theme"
                                variant="ghost"
                                size="lg"
                                colorScheme={colorMode === 'light' ? 'teal' : 'orange'}
                                onClick={toggleColorMode}
                            >
                                <MdOutlineDarkMode />
                                <Text>
                                    Mode
                                </Text>
                            </IconButton>
                            {!isAuthenticated ? (
                                <Button onClick={() => handleNavigation('/login')} colorScheme="blue">
                                    Login
                                </Button>
                            ) : (
                                <>
                                    <DialogRoot size={'full'}>
                                        <DialogTrigger w={'100%'} asChild>
                                            <Button variant="ghost" w={'100%'}><MdChat /> Chat</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                {user ? ( // Check if user exists
                                                    <Button borderRadius={40}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Button>
                                                ) : (
                                                    <Button borderRadius={40}>Guest</Button> // Fallback for unauthenticated state
                                                )}
                                            </DialogHeader>
                                            <DialogBody>
                                                <p>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                </p>
                                            </DialogBody>
                                            <DialogFooter>
                                                <Field
                                                    w={'100%'}
                                                    borderRadius="15px"
                                                    outline={'1px solid white'}
                                                    border="none"
                                                    _focus={{ outline: '1px solid black', borderRadius: '50px' }}
                                                >
                                                    <Input
                                                        placeholder="Ketik Disini"
                                                        border="none"
                                                        _focus={{ outline: 'none', boxShadow: 'none' }}

                                                    />
                                                </Field>
                                                <Button borderRadius={15}>Send</Button>
                                            </DialogFooter>
                                            <DialogCloseTrigger />
                                        </DialogContent>
                                    </DialogRoot>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleNavigation('/cart')}
                                        position="relative"
                                        width="100%"

                                        gap={2}
                                    >
                                        <Box position="relative" display="flex" alignItems="center">
                                            <MdOutlineShoppingCart size={20} />
                                            {cartItemsCount > 0 && (
                                                <Box
                                                    position="absolute"
                                                    top="-8px"
                                                    right="-8px"
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
                                        </Box>
                                        <Text>Cart</Text>
                                    </Button>
                                    <Button variant="ghost" onClick={() => handleNavigation("/profile/profile-sidebar")}>
                                        Settings
                                    </Button>
                                    <Button variant="ghost" onClick={() => handleNavigation("/profile")}>
                                        Buy History
                                    </Button>
                                    <Button variant="ghost" onClick={() => handleNavigation("/profile")}>
                                        Review History
                                    </Button>
                                    <Button variant="ghost" onClick={handlePesananClick}>
                                        Pesanan
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => useAuthStore.getState().logout(() => navigate("/"))}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </DrawerBody>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>

            <DialogRoot open={isPesananOpen} onOpenChange={(e) => setIsPesananOpen(e.open)}>
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
                                    We shipped your product via <strong>FedEx</strong> and it should
                                    arrive within 3-5 business days.
                                </Text>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineConnector>
                                <LuCheck />
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle textStyle="sm">Order Confirmed</TimelineTitle>
                                <TimelineDescription>18th May 2021</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineConnector>
                                <LuPackage />
                            </TimelineConnector>
                            <TimelineContent>
                                <TimelineTitle textStyle="sm">Order Delivered</TimelineTitle>
                                <TimelineDescription>20th May 2021, 10:30am</TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                    </TimelineRoot>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </Stack>

    )
}

export default MobileDrawer