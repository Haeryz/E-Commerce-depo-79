import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../../store/Barang";
import { Box, SimpleGrid, Text, Stack, HStack, Button, IconButton } from "@chakra-ui/react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { Skeleton, SkeletonText } from "../../components/ui/skeleton";
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

function ListBarang() {
  const [searchParams] = useSearchParams();
  const { products, loading: productLoading, error: productError, fetchProducts } = useProductStore();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    fetchProducts(1, 10); // Fetch the first 10 products
  }, [fetchProducts]);

  const isLoading = productLoading;
  const isError = productError;

  if (isError) return <Box>Error: {productError}</Box>;

  // Filter products based on the search query from URL
  const filteredProducts = searchQuery
    ? products.filter((product) =>
      product.nama.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : products;

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
            <Box
              maxW="sm"
              overflow="hidden"
              borderRadius="md"
              boxShadow="xl"
              key={product._id}
              _hover={{
                transform: "scale(1.05)", // Slightly enlarge the card
                boxShadow: "lg", // Optional: add shadow effect
              }}
              transition="transform 0.2s ease, box-shadow 0.2s ease"
            >
              {/* Make the card clickable for product detail */}
              <Link to={`/detail-barang/${product._id}`}>
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
              </Link>
              {/* Keep the buttons outside the Link to make them independently clickable */}
              <Box p={4} display="flex" gap={2}>
                <Link to={`/beli-barang/${product._id}`}>
                  <Button variant="solid">Beli</Button>
                </Link>
                <DialogRoot placement={'center'} size={{ base: 'sm', md: 'lg' }}>
                  <DialogTrigger asChild>
                    <Button variant="ghost">🛒 Tambahkan ke Keranjang</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogActionTrigger>
                      <Button>Save</Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              </Box>
            </Box>
          ))}
      </SimpleGrid>
    </Box>
  );
}

export default ListBarang;
