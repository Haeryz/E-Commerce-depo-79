import { useEffect } from 'react'
import { useProductStore } from '../../store/Barang';
import { Box, Card, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { Button } from '../ui/button';


function BarangRekomendasi() {
    const { products, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts(); // Fetch products when the component mounts
    }, [fetchProducts]);

    if (loading) return <Box>Loading products...</Box>; // Replaced div with Box
    if (error) return <Box>Error: {error}</Box>; // Replaced div with Box
    return (
        <Box> {/* Replaced div with Box */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gapX={4} gapY={4}>
                {products.map((product) => (
                    <Card.Root key={product._id} maxW="sm" overflow="hidden">
                        <Box position="relative" height="200px" width="100%" overflow="hidden">
                            <Image
                                src={product.image} // Dynamic image URL from the product data
                                alt={product.nama} // Dynamic alt text from the product name
                                objectFit="cover" // Ensures the image covers the area without distortion
                                layout="fill" // The image will fill the container
                            />
                        </Box>
                        <Card.Body gap="2">
                            <Card.Title>{product.nama}</Card.Title>
                            <Card.Description>
                                {product.keterangan || "No description available"} {/* Displaying description or fallback text */}
                            </Card.Description>

                            {/* Displaying product's unit above price */}
                            {product.berat?.unit && (
                                <Text color="gray.500" fontSize="sm">
                                    Unit: {product.berat.unit}
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
    )
}

export default BarangRekomendasi