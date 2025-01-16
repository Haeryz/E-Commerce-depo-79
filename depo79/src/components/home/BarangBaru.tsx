import { useEffect } from "react";
import { useProductStore } from "../../store/Barang";
import { Card, Image, Text, Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { useBeratStore } from "../../store/berat";
import { Skeleton, SkeletonText } from "../ui/skeleton";

function BarangBaru() {
    const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();
    const { beratMap, loading: beratLoading, error: beratError, fetchBerat } = useBeratStore();

    useEffect(() => {
        fetchProducts();
        fetchBerat();
    }, [fetchProducts, fetchBerat]);

    const isLoading = productLoading || beratLoading;
    const isError = productError || beratError;

    if (isError) return <Box>Error: {productError || beratError}</Box>;

    return (
        <Box>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gapX={4} gapY={4}>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, index) => ( // Adjust length for number of skeletons
                        <Stack key={index} gap="6" maxW="sm">
                            <Skeleton height="200px" />
                            <SkeletonText noOfLines={2} spacing="4" />
                            <SkeletonText noOfLines={1} width="50%" />
                        </Stack>
                    ))
                    : products.map((product) => (
                        <Card.Root key={product._id} maxW="sm" overflow="hidden">
                            <Box position="relative" height="200px" width="100%" overflow="hidden">
                                <Image
                                    src={product.image}
                                    alt={product.nama}
                                    objectFit="cover"
                                    layout="fill"
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
                    ))}
            </SimpleGrid>
        </Box>
    );
}

export default BarangBaru;
