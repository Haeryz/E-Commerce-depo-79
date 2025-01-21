import { Box, Button, HStack, Image, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useProductStore } from "../../store/product";
import { useParams } from 'react-router-dom';
import { GiWeight } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useBeratStore } from '../../store/berat';
import { LuCarTaxiFront} from "react-icons/lu";
import { EmptyState } from '../../components/ui/empty-state';
import { MdOutlineReviews } from 'react-icons/md';

function DetailBarang() {
    const { id } = useParams();
    const { productDetail, loading: productLoading, error: productError, fetchProductById } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            fetchBerat();
        }
    }, [id, fetchProductById, fetchBerat]);

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
                        <Button colorScheme="teal" borderRadius="full" w="full">
                            Tambahkan Ke Keranjang
                        </Button>
                        <Button colorScheme="teal" borderRadius="full" w="full">
                            Beli Sekarang
                        </Button>
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
                    <Text ml={5} mt={5}>
                        Lihat Semua Review
                    </Text>
                    <EmptyState
                        icon={<MdOutlineReviews />}
                        title="There is no review available"
                        description="Explore our products and add items to your cart"
                    />
                </Box>
            </VStack>
        </Box>

    );
}

export default DetailBarang;
