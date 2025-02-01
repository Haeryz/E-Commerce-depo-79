import { useEffect, useState } from 'react'
import { useCartStore } from '../../store/cart';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Box, Button, HStack, IconButton, Image, Separator, Spinner, Text, VStack } from '@chakra-ui/react'
import { Checkbox } from '../../components/ui/checkbox'
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { motion } from 'framer-motion'
import { EmptyState } from "../../components/ui/empty-state"
import { Link } from 'react-router-dom';

function Cart() {
    const { items, total, loading, error, fetchCart, updateLocalQuantity, syncWithServer, removeFromCart, removeLocalItem } = useCartStore();
    const [updatingItems, setUpdatingItems] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleQuantityChange = async (productId: string, quantity: number) => {
        setUpdatingItems(prev => ({ ...prev, [productId]: true }));

        // Immediately update the UI
        updateLocalQuantity(productId, quantity);

        // Sync with server in the background
        await syncWithServer(productId, quantity);

        setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    };

    const handleRemoveItem = async (productId: string) => {
        // Optimistically update UI
        removeLocalItem(productId);

        // Sync with server in background
        try {
            await removeFromCart(productId);
        } catch (error) {
            console.error('Failed to remove item', error);
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading cart...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={10} color="red.500">
                <Text>{error}</Text>
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box p={8}>
                <EmptyState
                    icon={<LuShoppingCart size={50} />}
                    title="Your cart is empty"
                    description="Explore our products and add items to your cart"
                />
            </Box>
        );
    }

    return (
        <VStack
            align={'stretch'}
            w="full"
            bg="gray.50"
            minH="100vh"
            py={{ base: 4, md: 8 }}
            px={{ base: 2, sm: 4, md: 6, lg: 8 }}
        >
            <BreadcrumbRoot fontWeight="bold" ml={[4, 6, 10]} mb={5} alignSelf="flex-start">
                <BreadcrumbCurrentLink>
                    cart
                </BreadcrumbCurrentLink>
            </BreadcrumbRoot>

            <HStack
                justifyContent={'space-between'}
                w={'full'}
                direction={{ base: 'column', lg: 'row' }}
                gap={{ base: 4, sm: 6, lg: 8 }}
                alignItems="flex-start"
                as={VStack}
            >
                {/* Cart Section */}
                <Box
                    bg="white"
                    shadow={{ base: 'md', md: 'xl' }}
                    borderRadius={{ base: 'lg', md: '2xl' }}
                    w={{ base: '100%', lg: '70%' }}
                    mb={{ base: 3, md: 5 }}
                >
                    <VStack gap={{ base: 4, md: 6 }}>
                        <HStack
                            justifyContent={'space-between'}
                            w={'full'}
                            p={{ base: 4, sm: 6, md: 8 }}
                            bg="gray.50"
                            flexWrap={{ base: 'wrap', sm: 'nowrap' }}
                        >
                            <Text
                                fontWeight="extrabold"
                                fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
                                bgGradient="linear(to-r, blue.500, purple.500)"
                                bgClip="text"
                            >
                                Shopping Cart
                            </Text>
                            <Button
                                size={{ base: 'sm', md: 'md' }}
                                colorScheme="red"
                                variant="ghost"
                                _hover={{ bg: 'red.50' }}
                            >
                                <FaTrashAlt />
                                <Text ml={2} display={{ base: 'none', md: 'block' }}>Clear Cart</Text>
                            </Button>
                        </HStack>

                        {/* Products Header */}
                        <HStack
                            justifyContent={'space-between'}
                            w={'full'}
                            px={8}
                            display={{ base: 'none', sm: 'flex' }}
                            color="gray.500"
                            fontWeight="medium"
                        >
                            <Text>Products</Text>
                            <Text>Quantity</Text>
                            <Text>Price</Text>
                        </HStack>

                        {/* Product Items */}
                        {items.map((item) => (
                            <VStack key={item._id} w="full" gap={{ base: 3, md: 4 }} px={{ base: 2, sm: 4 }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        width: '100%',
                                        opacity: updatingItems[item.product._id] ? 0.7 : 1,
                                        transition: 'opacity 0.2s'
                                    }}
                                >
                                    <Box p={{ base: 3, md: 4 }} borderRadius={{ base: 'lg', md: 'xl' }} border="1px" borderColor="gray.100" _hover={{ bg: 'gray.50' }}>
                                        <HStack justifyContent={'space-between'} w={'full'} flexDir={{ base: 'column', sm: 'row' }} gap={{ base: 3, md: 4 }}>
                                            <Checkbox>
                                                <HStack gap={{ base: 3, md: 6 }}>
                                                    <Image src={item.product.image} alt={item.product.nama} w={{ base: '70px', sm: '80px', md: '100px' }} h={{ base: '70px', sm: '80px', md: '100px' }} objectFit="cover" borderRadius="xl" shadow="md" />
                                                    <VStack align="start" gap={1}>
                                                        <Text fontSize="lg" fontWeight="bold">{item.product.nama}</Text>
                                                        <Text color={'blue.500'} fontSize="sm">
                                                            {item.product.stok > 0 ? 'In Stock' : 'Out of Stock'}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Checkbox>
                                            <HStack gap={{ base: 2, md: 4 }} alignSelf={{ base: 'flex-start', sm: 'center' }} ml={{ base: 4, sm: 8, md: 0 }}>
                                                <Box bg="white" shadow="md" borderRadius="full" px={4} py={2}>
                                                    <HStack gap={4}>
                                                        <IconButton
                                                            aria-label="Decrease quantity"
                                                            onClick={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="blue"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FaMinus />
                                                        </IconButton>
                                                        <Text minW="20px" textAlign="center" fontWeight="medium">
                                                            {item.quantity}
                                                        </Text>
                                                        <IconButton
                                                            aria-label="Increase quantity"
                                                            onClick={() => handleQuantityChange(item.product._id, Math.min(item.product.stok, item.quantity + 1))}
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="blue"
                                                            disabled={item.quantity >= item.product.stok}
                                                        >
                                                            <FaPlus />
                                                        </IconButton>
                                                    </HStack>
                                                </Box>
                                                <IconButton
                                                    aria-label="Delete item"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.product._id)}
                                                >
                                                    <FaTrashAlt />
                                                </IconButton>
                                            </HStack>

                                            <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }} color="blue.600">
                                                Rp.{(item.product.harga_jual * item.quantity).toLocaleString()}
                                            </Text>
                                        </HStack>
                                    </Box>
                                </motion.div>
                                <Separator />
                            </VStack>
                        ))}
                    </VStack>
                </Box>

                {/* Summary Section */}
                <Box
                    bg="white"
                    shadow={{ base: 'md', md: 'xl' }}
                    borderRadius={{ base: 'lg', md: '2xl' }}
                    w={{ base: '100%', lg: '30%' }}
                    position={{ base: 'relative', lg: 'sticky' }}
                    top={{ lg: '20px' }}
                    p={{ base: 4, md: 6 }}
                >
                    <VStack gap={{ base: 3, md: 4 }}>
                        <Text
                            w="full"
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            pb={{ base: 3, md: 4 }}
                            borderBottom="1px"
                            borderColor="gray.100"
                        >
                            Order Summary
                        </Text>

                        <HStack justifyContent={'space-between'} w={'full'}>
                            <Text color={'gray.600'}>Subtotal</Text>
                            <Text fontWeight="medium">Rp.{total.toLocaleString()}</Text>
                        </HStack>

                        <HStack justifyContent={'space-between'} w={'full'}>
                            <Text color={'gray.600'}>Discount</Text>
                            <Text fontWeight="medium" color="green.500">- Rp.0</Text>
                        </HStack>

                        <Box w="full" h="1px" bg="gray.100" my={2} />

                        <HStack justifyContent={'space-between'} w={'full'}>
                            <Text fontWeight="bold">Total</Text>
                            <Text fontWeight="bold" fontSize="xl" color="blue.600">
                                Rp.{total.toLocaleString()}
                            </Text>
                        </HStack>

                        <Link to={`/checkout/${items[0]?._id}`}>  {/* Update this line */}
                            <Button
                                w={'full'}
                                size={{ base: 'md', md: 'lg' }}
                                fontSize={{ base: 'sm', md: 'md' }}
                                colorScheme="blue"
                                borderRadius="xl"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    shadow: 'lg',
                                }}
                            >
                                Checkout Now
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </HStack>
        </VStack>
    );
}

export default Cart;
