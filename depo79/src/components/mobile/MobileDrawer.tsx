import React, { useEffect, useState } from 'react'
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { IconButton, Input, Text, useBreakpointValue, VStack, HStack, Box, Stack } from '@chakra-ui/react'
import { MdChat, MdMenu, MdOutlineDarkMode, MdOutlineShoppingCart } from 'react-icons/md'
import { Button } from '../ui/button'
import { useAuthStore } from '../../store/auth'
import { useNavigate } from 'react-router-dom'
import { useColorMode } from '../ui/color-mode'
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTrigger } from '../ui/dialog'
import { Field } from '../ui/field'
import { useCartStore } from "../../store/cart"; // Add this import at the top
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '../ui/timeline'
import { useProfileStore } from '../../store/profile';
import useCheckoutStore from '../../store/checkout';
import { LuCheck, LuPackage, LuShip, LuClock, LuCircle } from 'react-icons/lu';

const MobileDrawer = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function
    const { isAuthenticated } = useAuthStore((state) => state); // Access user and authentication state
    const { user } = useAuthStore((state) => state); // Access user and authentication state
    const navigate = useNavigate();
    const cartItemsCount = useCartStore((state) => state.items.length); // Add this near other hooks
    const { profile } = useProfileStore();
    const { checkouts, fetchProfileCheckouts, currentCheckout, fetchCheckoutById } = useCheckoutStore();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        setOpen(false);
        navigate(path);
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [isPesananOpen, setIsPesananOpen] = useState(false);

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handlePesananClick = async () => {
        setOpen(false);
        if (profile?._id) {
            await fetchProfileCheckouts(profile._id);
        }
        setIsPesananOpen(true);
    };

    const handleOrderClick = async (orderId: string) => {
        await fetchCheckoutById(orderId);
        setSelectedOrderId(orderId);
    };

    const getTimelineItems = () => {
        const items = [];
        const status = currentCheckout?.status || 'Pending';

        items.push(
            <TimelineItem key="waiting">
                <TimelineConnector>
                    <LuClock />
                </TimelineConnector>
                <TimelineContent>
                    <TimelineTitle>Product is waiting admin</TimelineTitle>
                    <TimelineDescription>{formatDateTime(currentCheckout?.createdAt || '')}</TimelineDescription>
                </TimelineContent>
            </TimelineItem>
        );

        if (status === 'Ditolak') {
            items.push(
                <TimelineItem key="rejected">
                    <TimelineConnector>
                        <LuCircle />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Order Cancelled</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                        <Text color="red.500" mt={1} fontSize="sm">
                            Order was rejected by admin
                        </Text>
                    </TimelineContent>
                </TimelineItem>
            );
        } else if (status !== 'Pending') {
            items.push(
                <TimelineItem key="confirmed">
                    <TimelineConnector>
                        <LuCheck />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Order Confirmed</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                    </TimelineContent>
                </TimelineItem>
            );
        }

        // ... rest of timeline items logic same as Navbar2 ...
        return items;
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

            <DialogRoot open={isPesananOpen} onOpenChange={(e) => {
                setIsPesananOpen(e.open);
                if (!e.open) {
                    setSelectedOrderId(null);
                }
            }}>
                <DialogContent p={10}>
                    {!selectedOrderId ? (
                        <VStack align="stretch" gap={4}>
                            <Text fontSize="xl" fontWeight="bold">Your Orders</Text>
                            {checkouts.map((order) => (
                                <Box
                                    key={order._id}
                                    p={4}
                                    border="1px"
                                    borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => handleOrderClick(order._id)}
                                    _hover={{
                                        bg: colorMode === 'light' ? 'gray.50' : 'gray.700'
                                    }}
                                >
                                    <HStack justify="space-between">
                                        <VStack align="start" gap={1}>
                                            <Text fontWeight="medium">Order #{order._id.slice(-8)}</Text>
                                            <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                                                {formatDateTime(order.createdAt)}
                                            </Text>
                                        </VStack>
                                        <Text
                                            color={
                                                order.status === 'Pending' ? 'yellow.500' :
                                                order.status === 'Dikirim' ? 'blue.500' :
                                                order.status === 'Ditolak' ? 'red.500' :
                                                order.status === 'Selesai' ? 'green.500' : 'gray.500'
                                            }
                                        >
                                            {order.status}
                                        </Text>
                                    </HStack>
                                    <Text mt={2}>Total: Rp {order.grandTotal.toLocaleString()}</Text>
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <VStack align="stretch" gap={4}>
                            <HStack justify="space-between">
                                <Text fontSize="xl" fontWeight="bold">Order Status</Text>
                                <Button size="sm" variant="ghost" onClick={() => setSelectedOrderId(null)}>
                                    Back to Orders
                                </Button>
                            </HStack>
                            <TimelineRoot maxW="400px">
                                {getTimelineItems()}
                            </TimelineRoot>
                        </VStack>
                    )}
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </Stack>

    )
}

export default MobileDrawer