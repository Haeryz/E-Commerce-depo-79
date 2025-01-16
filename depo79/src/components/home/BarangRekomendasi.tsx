import { useEffect } from "react";
import { useProductStore } from "../../store/Barang";
import { Box, Card, Image, SimpleGrid, Text, Stack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useBeratStore } from "../../store/berat";
import { Skeleton, SkeletonText } from "../ui/skeleton";

function BarangRekomendasi() {
    const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();

    useEffect(() => {
        fetchProducts(); // Fetch products when the component mounts
        fetchBerat(); // Fetch berat when the component mounts
    }, [fetchProducts, fetchBerat]);

    const isLoading = productLoading || beratLoading;
    const isError = productError || beratError;

    if (isError) return <Box>Error: {productError || beratError}</Box>; // Show error state

    return (
        <Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gapX={4} gapY={4}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => ( // Adjust length to match expected skeletons
                        <Stack key={index} gap="6" maxW="sm">
                            <Skeleton height="200px" />
                            <SkeletonText noOfLines={2} />
                            <SkeletonText noOfLines={1} width="50%" />
                        </Stack>
                    ))
                    : products.map((product) => (
                        <Card.Root key={product._id} maxW="sm" overflow="hidden">
                            <Box position="relative" height="200px" width="100%" overflow="hidden">
                                <Image
                                    src={product.image} // Dynamic image URL from the product data
                                    alt={product.nama} // Dynamic alt text from the product name
                                    objectFit="cover" // Ensures the image covers the area without distortion
                                />
                            </Box>
                            <Card.Body gap="2">
                                <Card.Title>{product.nama}</Card.Title>
                                <Card.Description>
                                    {product.keterangan || "No description available"} {/* Displaying description or fallback text */}
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
                    ))}
            </SimpleGrid>
        </Box>
    );
}

export default BarangRekomendasi;
