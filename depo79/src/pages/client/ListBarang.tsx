import { useEffect } from "react";
import { useProductStore } from "../../store/Barang";
import { Box, SimpleGrid, Text, Stack, HStack, Button, IconButton } from "@chakra-ui/react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { Skeleton, SkeletonText } from "../../components/ui/skeleton";

function ListBarang() {
  const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts(1, 10); // Fetch the first 10 products
  }, [fetchProducts]);

  const isLoading = productLoading;
  const isError = productError;

  if (isError) return <Box>Error: {productError}</Box>;

  // Filter products based on the search query ("semen" in this case)
  const filteredProducts = products.filter((product) =>
    product.nama.toLowerCase().includes("semen") // Filtering for "semen"
  );

  return (
    <Box p={5}>
      {/* Buttons */}
      <HStack align="center" gapX={5} mb={4} justify={"center"}>
        <Button boxShadow={"xl"} borderRadius={"md"}>Semen</Button>
        <Button boxShadow={"xl"} borderRadius={"md"}>Semen</Button>
        <Button boxShadow={"xl"} borderRadius={"md"}>Semen</Button>
        <Button boxShadow={"xl"} borderRadius={"md"}>Semen</Button>
        <IconButton aria-label="Filter" borderRadius={"md"}>
          <HiOutlineAdjustmentsHorizontal />
        </IconButton>
      </HStack>

      {/* Product Listing */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gapX={3} gapY={4}>
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Stack key={index} gap="6" maxW="sm">
                <Skeleton height="200px" />
                <SkeletonText noOfLines={2} />
                <SkeletonText noOfLines={1} width="50%" />
              </Stack>
            ))
          : filteredProducts.map((product) => (
              <Link to={`/detail-barang/${product._id}`} key={product._id}>
                <Box
                  maxW="sm"
                  overflow="hidden"
                  borderRadius="md"
                  boxShadow="xl"
                  _hover={{
                    transform: "scale(1.05)", // Slightly enlarge the card
                    boxShadow: "lg", // Optional: add shadow effect
                  }}
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                >
                  <Box position="relative" height="200px" width="100%" overflow="hidden">
                    <img
                      src={product.image}
                      alt={product.nama}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                  <Box p={4}>
                    <Text fontSize="xl" fontWeight="bold">{product.nama}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {product.keterangan || "No description available"}
                    </Text>
                    <Text mt={2} fontWeight="medium" fontSize="lg">${product.harga_jual}</Text>
                  </Box>
                  <Box p={4} display="flex" gap={2}>
                    <Button variant="solid">Beli</Button>
                    <Button variant="ghost">Tambahkan ke Keranjang</Button>
                  </Box>
                </Box>
              </Link>
            ))}
      </SimpleGrid>
    </Box>
  );
}

export default ListBarang;