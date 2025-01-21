import { useEffect, useState } from "react";
import { useProductStore } from "../../store/Barang";
import { Box, Card, Image, SimpleGrid, Text, Stack, HStack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useBeratStore } from "../../store/berat";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function BarangBaru() {
    const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Define items per page

    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage);
        fetchBerat();
    }, [fetchProducts, fetchBerat, currentPage, itemsPerPage]);

    const isLoading = productLoading || beratLoading;
    const isError = productError || beratError;

    if (isError) return <Box>Error: {productError || beratError}</Box>;

    const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products?.slice(startIndex, startIndex + itemsPerPage) || [];

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    return (
        <Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gapX={4} gapY={4}>
                {isLoading
                    ? Array.from({ length: itemsPerPage }).map((_, index) => (
                        <Stack key={index} gap="6" maxW="sm">
                            <Skeleton height="200px" />
                            <SkeletonText noOfLines={2} />
                            <SkeletonText noOfLines={1} width="50%" />
                        </Stack>
                    ))
                    : currentProducts.map((product) => (
                        <Box
                            key={product._id}
                            _hover={{
                                transform: "scale(1.05)", // Slightly enlarge the card
                                boxShadow: "lg", // Optional: add shadow effect
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
                                            ${product.harga_jual}
                                        </Text>
                                    </Card.Body>
                                    <Card.Footer gap="2">
                                        <Button variant="solid">Beli</Button>
                                        <Button variant="ghost">Tambahkan ke Keranjang</Button>
                                    </Card.Footer>
                                </Card.Root>
                            </Link>
                        </Box>
                    ))}
            </SimpleGrid>

            <HStack justify="center" mt={4}>
                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {[...Array(totalPages)].map((_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? "solid" : "outline"}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </HStack>
        </Box>
    );
}

export default BarangBaru;