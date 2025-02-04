import { useEffect } from "react";
import { useProductStore } from "../../store/Barang";
import { Box, Card, Image, SimpleGrid, Text, Stack } from "@chakra-ui/react";
import { useBeratStore } from "../../store/berat";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { Link } from "react-router-dom";

function BarangBaru() {
    const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();

    useEffect(() => {
        fetchProducts(1, 10);
        fetchBerat();
    }, [fetchProducts, fetchBerat]);

    const isLoading = productLoading || beratLoading;
    const isError = productError || beratError;

    if (isError) return <Box>Error: {productError || beratError}</Box>;

    // Get only the latest 9 products
    const latestProducts = products?.slice(0, 10) || [];

    return (
        <Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap={4}>
                {isLoading
                    ? Array.from({ length: 9 }).map((_, index) => (
                        <Stack key={index} gap="6" maxW="sm">
                            <Skeleton height="200px" />
                            <SkeletonText noOfLines={2} />
                            <SkeletonText noOfLines={1} width="50%" />
                        </Stack>
                    ))
                    : latestProducts.map((product) => (
                        <Box
                            key={product._id}
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "lg",
                            }}
                            transition="transform 0.2s ease, box-shadow 0.2s ease"
                        >
                            <Link to={`/detail-barang/${product._id}`}>
                                <Card.Root maxW="sm" overflow="hidden">
                                    <Box position="relative" height="200px" width="100%" overflow="hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.nama}
                                            objectFit="cover"
                                        />
                                    </Box>
                                    <Card.Body gap="2">
                                        <Card.Title>{product.nama}</Card.Title>
                                        <Card.Description>
                                            {product.keterangan || "No description available"}
                                        </Card.Description>
                                        {product.berat?.unit && (
                                            <Text color="gray.500" fontSize="sm">
                                                Unit: {beratMap[product.berat.unit] || "Unknown Unit"}
                                            </Text>
                                        )}
                                        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
                                            Rp.{product.harga_jual}
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            </Link>
                        </Box>
                    ))}
            </SimpleGrid>
        </Box>
    );
}

export default BarangBaru;