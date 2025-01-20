import { Box, Button, HStack, Image, Text, VStack, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Rating } from '../../components/ui/rating';
import { useProductStore } from "../../store/product";
import { useParams } from 'react-router-dom'; // Assuming you're using react-router
import { GiWeight } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCartShopping, FaStar } from "react-icons/fa6";
import { useBeratStore } from '../../store/berat';

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
        <Box>
            <VStack align={"start"} ml={10} mt={3} mb={3}>
                <HStack gapX={30}>
                    <VStack align={"start"}>
                        <Text fontWeight={"bold"} fontSize={"4xl"}>{productDetail.nama}</Text>
                        <HStack>
                            <Rating readOnly defaultValue={4} colorPalette={'yellow'} />
                            <Text fontWeight={'bold'}>
                                (4.5)
                            </Text>
                            <Text fontWeight={'normal'}>
                                225
                            </Text>
                            <Text>reviews</Text>
                            <Text fontWeight={'normal'}>
                                2090
                            </Text>
                            <Text>Terjual</Text>
                        </HStack>
                        <Box>
                            <Text fontWeight={'bold'} fontSize={'xl'}>
                                Rp. {productDetail.harga_jual.toLocaleString()}
                            </Text>
                        </Box>
                        <Box bg="bg" shadow="md" borderRadius="md" pl={120} pr={120}>
                            <VStack>
                                <HStack>
                                    <RiDiscountPercentFill />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Diskon: {productDetail.diskon}%
                                    </Text>
                                </HStack>
                                <HStack>
                                    <FaCartShopping />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Stok: {productDetail.stok}
                                    </Text>
                                </HStack>
                                <HStack>
                                    <GiWeight />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Berat: {beratName}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <Button borderRadius={15} alignSelf={'center'} mb={3}>
                            Tambah Ke Keranjang
                        </Button>
                        <Button alignSelf={'center'} bg="bg" shadow="md" borderRadius="md" pl={87} pr={87} color={'black'} pb={16} pt={16} mt={5}>
                            <FaStar />
                            Lihat Semua Rating
                        </Button>
                    </VStack>
                    <VStack align={'center'} bg="bg" shadow="md" mr={2} borderRadius={15}>
                        <Image
                            src={productDetail.image || '/placeholder-image.png'}
                            alt='main image'
                            aspectRatio={4 / 3}
                            width={"50%"}
                            mt={10}
                            borderRadius={10}
                        />
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
}

export default DetailBarang;
