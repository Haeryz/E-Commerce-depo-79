import { Box, Button, HStack, Image, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Rating } from '../../components/ui/rating';
import { useProductStore } from "../../store/product";
import { useParams } from 'react-router-dom'; // Assuming you're using react-router
import { GiWeight } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useBeratStore } from '../../store/berat';
import { LuCarTaxiFront } from 'react-icons/lu';

function DetailBarang() {
    const { id } = useParams(); // Get the product ID from the route
    const { productDetail, loading: productLoading, error: productError, fetchProductById } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();

    useEffect(() => {
        if (id) {
            fetchProductById(id);
            fetchBerat();
        }
    }, [id, fetchProductById, fetchBerat]);

    // Combined loading state
    if (productLoading || beratLoading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
                <Text mt={4}>Loading product details...</Text>
            </Box>
        );
    }

    // Combined error handling
    if (productError || beratError) {
        return (
            <Box textAlign="center" mt={10}>
                <Text color="red.500">{productError || beratError}</Text>
            </Box>
        );
    }

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
        <Box p={5} mr={10} ml={10}>
            <HStack align="start">
                {/* Left Section */}
                <VStack align="start" w="50%">
                    <Text fontWeight="bold" fontSize="2xl">{productDetail.nama}</Text>
                    <HStack >
                        <Rating readOnly defaultValue={4.0} colorPalette="yellow" />
                        <Text fontWeight="bold">{productDetail.rating || 4.0}</Text>
                        <Text>({productDetail.reviews || 232} Reviews)</Text>
                        <Text>{productDetail.sold || 2093} Sold</Text>
                    </HStack>
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
                        aspectRatio={3/2}
                    />
                </Box>
            </HStack>
        </Box>
    );
}

export default DetailBarang;
