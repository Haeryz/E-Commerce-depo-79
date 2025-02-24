import { useEffect, useState } from "react";
import { useProductStore } from "../../store/Barang";
import { Box, Card, Image, SimpleGrid, Text, Stack, HStack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useBeratStore } from "../../store/berat";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BarangRekomendasi() {
    const { products, loading: productLoading, error: productError } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchBerat();
    }, [fetchBerat]);

    const isLoading = productLoading || beratLoading;
    const isError = productError || beratError;

    if (isError) return <Box>Error: {productError || beratError}</Box>;

    const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    return (
        <Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} mb={4}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Stack key={index} gap="6" maxW="sm">
                            <Box position="relative" paddingBottom="100%"> {/* Creates 1:1 ratio container */}
                                <Skeleton position="absolute" top="0" left="0" right="0" bottom="0" />
                            </Box>
                            <SkeletonText noOfLines={2} />
                            <SkeletonText noOfLines={1} width="50%" />
                        </Stack>
                    ))
                    : currentProducts.map((product) => (
                        <Card.Root key={product._id} maxW="sm" overflow="hidden">
                            <Box position="relative" paddingBottom="100%"> {/* Creates 1:1 ratio container */}
                                <Image
                                    src={product.image}
                                    alt={product.nama}
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
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
                    ))}
            </SimpleGrid>

            <HStack justify="center"  mt={4}>
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

export default BarangRekomendasi;