import { Box, Button, HStack, Image, Text, VStack, Spinner, Input, IconButton } from '@chakra-ui/react';
import { Toaster, toaster } from "../../components/ui/toaster";
import React, { useEffect, useState } from 'react';
import { useProductStore } from "../../store/product";
import { useParams } from 'react-router-dom';
import { GiWeight } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useBeratStore } from '../../store/berat';
import { LuCarTaxiFront } from "react-icons/lu";
import { EmptyState } from '../../components/ui/empty-state';
import { MdOutlineReviews } from 'react-icons/md';
import { useProfileStore } from '../../store/profile';
import { Rating } from '../../components/ui/rating';
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogRoot } from '../../components/ui/dialog';
import { useCartStore } from '../../store/cart';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Add interface for CustomNumberInput props
interface CustomNumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
}

// Custom number input component
const CustomNumberInput = ({ value, onChange, min, max }: CustomNumberInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Math.min(Math.max(parseInt(e.target.value) || min, min), max);
        onChange(newValue);
    };

    const increment = () => {
        onChange(Math.min(value + 1, max));
    };

    const decrement = () => {
        onChange(Math.max(value - 1, min));
    };

    return (
        <HStack gap={2}>
            <IconButton 
                aria-label="Decrease quantity"
                onClick={decrement}
                size="sm"
                disabled={value <= min}
            >
                <FaMinus />
            </IconButton>
            <Input
                type="number"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                width="70px"
                textAlign="center"
            />
            <IconButton 
                aria-label="Increase quantity"
                onClick={increment}
                size="sm"
                disabled={value >= max}
            >
                <FaPlus />
            </IconButton>
        </HStack>
    );
};

function DetailBarang() {
    const { id } = useParams();
    const { productDetail, loading: productLoading, error: productError, fetchProductById } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();
    const { profileMap, fetchProfileReviews } = useProfileStore();
    const { addToCart, loading: cartLoading } = useCartStore();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            fetchBerat();
            fetchProfileReviews();
        }
    }, [id, fetchProductById, fetchBerat, fetchProfileReviews]);

    const handleAddToCart = async () => {
        if (id) {
            try {
                await addToCart(id, quantity);
                toaster.create({
                    title: "Success",
                    description: "Item added to cart",
                    type: "success"  // Changed from variant to type
                });
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: "Failed to add item to cart" + error,
                    type: "error"    // Changed from variant to type
                });
            }
        }
    };

    const handleBuyNow = () => {
        if (id) {
            navigate(`/checkout/${id}`, { state: { total: (productDetail?.harga_jual || 0) * quantity, singleProduct: true, productId: id, quantity, productName: productDetail?.nama } });
        }
    };

    // Loading state for both product and berat
    if (productLoading || beratLoading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading product details...</Text>
            </Box>
        );
    }
    // Error handling
    if (productError || beratError) {
        return (
            <Box textAlign="center" mt={10}>
                <Text color="red.500">{productError || beratError}</Text>
            </Box>
        );
    }
    // If no product is found
    if (!productDetail) {
        return (
            <Box textAlign="center" mt={10}>
                <Text>No product details found.</Text>
            </Box>
        );
    }
    const beratName = beratMap[productDetail.berat.unit]
        ? `${productDetail.berat.value} ${beratMap[productDetail.berat.unit]}`
        : `${productDetail.berat.value} ${productDetail.berat.unit}`;
    return (
        <>
            <Box p={5} mr={5} ml={5}>
                <VStack>
                    <HStack align="start" w={'100%'}>
                        {/* Left Section */}
                        <VStack align="start" w="50%">
                            <Text fontWeight="bold" fontSize="2xl">{productDetail.nama}</Text>
                            <Text>{productDetail.terjual || 0} Sold</Text>
                            <Text fontWeight="bold" fontSize="xl">Rp. {productDetail.harga_jual.toLocaleString()}</Text>
                            {/* Product Info */}
                            <Box borderWidth="1px" borderRadius="lg" p={4} w="full" bg="gray.50">
                                <VStack align="start" >
                                    <HStack>
                                        <GiWeight />
                                        <Text>Weight: {beratName}</Text>
                                    </HStack>
                                    <HStack>
                                        <RiDiscountPercentFill />
                                        <Text>Discount: {productDetail.diskon || 'No Discount'}</Text>
                                    </HStack>
                                    <HStack>
                                        <LuCarTaxiFront />
                                        <Text>Stock: {productDetail.stok || 0}</Text>
                                    </HStack>
                                </VStack>
                            </Box>
                            {/* Add to Cart Button */}
                            <DialogRoot placement={'center'} size={{ base: 'sm', md: 'lg' }}>
                                <DialogTrigger asChild>
                                    <Button colorScheme="teal" borderRadius="full" w="full">
                                        Tambahkan Ke Keranjang
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Dialog Title</DialogTitle>
                                    </DialogHeader>
                                    <DialogBody>
                                        <VStack gap={4}>
                                            <HStack>
                                                <Text>Quantity:</Text>
                                                <CustomNumberInput
                                                    value={quantity}
                                                    onChange={setQuantity}
                                                    min={1}
                                                    max={productDetail?.stok || 1}
                                                />
                                            </HStack>
                                            <Text>Total: Rp. {(productDetail?.harga_jual || 0) * quantity}</Text>
                                        </VStack>
                                    </DialogBody>
                                    <DialogFooter>
                                        <DialogActionTrigger asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogActionTrigger>
                                        <Button 
                                            isLoading={cartLoading}
                                            onClick={handleAddToCart}
                                        >
                                            Add to Cart
                                        </Button>
                                    </DialogFooter>
                                    <DialogCloseTrigger />
                                </DialogContent>
                            </DialogRoot>
                            <DialogRoot placement={'center'} size={{ base: 'sm', md: 'lg' }}>
                                <DialogTrigger asChild>
                                    <Button colorScheme="teal" borderRadius="full" w="full">
                                        Beli Sekarang
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm Purchase</DialogTitle>
                                    </DialogHeader>
                                    <DialogBody>
                                        <VStack gap={4}>
                                            <HStack>
                                                <Text>Quantity:</Text>
                                                <CustomNumberInput
                                                    value={quantity}
                                                    onChange={setQuantity}
                                                    min={1}
                                                    max={productDetail?.stok || 1}
                                                />
                                            </HStack>
                                            <Text>Total: Rp. {(productDetail?.harga_jual || 0) * quantity}</Text>
                                        </VStack>
                                    </DialogBody>
                                    <DialogFooter>
                                        <DialogActionTrigger asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogActionTrigger>
                                        <Button onClick={handleBuyNow}>
                                            Beli
                                        </Button>
                                    </DialogFooter>
                                    <DialogCloseTrigger />
                                </DialogContent>
                            </DialogRoot>
                        </VStack>

                        {/* Right Section */}
                        <Box flex="1">
                            <Image
                                src={productDetail.image || '/placeholder-image.png'}
                                alt={productDetail.nama}
                                borderRadius="lg"
                                shadow="md"
                                w="full"
                                h="auto"
                                objectFit="cover"
                                aspectRatio={3 / 2}
                            />
                        </Box>
                    </HStack>
                    <Box w={'100%'} bg="bg" shadow="md" borderRadius="md" mb={5} boxShadow="0px 2px 10px 2px rgba(0, 0, 0, 0.1)" mt={5}>
                        <Text ml={5} mt={5}>Lihat Semua Review</Text>
                        {productDetail.reviews?.length ? (
                            <VStack align="start" m={5}>
                                {productDetail.reviews.map((review) => (
                                    <Box key={review._id} p={3} borderWidth="1px" borderRadius="md" w="full">
                                        <Text>By User: {profileMap[review.user._id]?.nama || review.user._id}</Text>
                                        <Image src={review.image} alt="Review Image" w="100px" h="100px" objectFit="cover" borderRadius="md" my={2} />
                                        <Rating readOnly defaultValue={review.rating} size="sm" />
                                        <Text>Comment: {review.comment}</Text>
                                    </Box>
                                ))}
                            </VStack>
                        ) : (
                            <EmptyState
                                icon={<MdOutlineReviews />}
                                title="There is no review available"
                                description="Explore our products and add items to your cart"
                            />
                        )}
                    </Box>
                </VStack>
            </Box>
            <Toaster />
        </>
    );
}

export default DetailBarang;
