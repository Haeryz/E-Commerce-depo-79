import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchStore } from "../../store/search";  // Change this import
import { Box, SimpleGrid, Text, Stack, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Skeleton, SkeletonText } from "../../components/ui/skeleton";
import { EmptyState, List } from "@chakra-ui/react";
import { HiColorSwatch } from "react-icons/hi";

function ListBarang() {
  const [searchParams] = useSearchParams();
  const { results, loading, error, fetchSuggestions } = useSearchStore();  // Use search store
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);  // Fetch results when search query changes
    }
  }, [searchQuery, fetchSuggestions]);

  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box p={{ base: 4, md: 5 }}>
      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gapX={3} gapY={4}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Stack key={index} gap="6" maxW="sm">
              <Skeleton height="200px" />
              <SkeletonText noOfLines={2} />
              <SkeletonText noOfLines={1} width="50%" />
            </Stack>
          ))}
        </SimpleGrid>
      ) : results.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gapX={3} gapY={4}>
          {results.map((product) => (
            <Box
              maxW="sm"
              overflow="hidden"
              borderRadius="md"
              boxShadow="xl"
              key={product._id}
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
              }}
              transition="transform 0.2s ease, box-shadow 0.2s ease"
            >
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
                  <Text mt={2} fontWeight="medium" fontSize="lg">
                    Rp.{product.harga_jual.toLocaleString()}
                  </Text>
                  <Text color={'gray.400'}>Klik disini untuk info lebih lanjut</Text>
                </Box>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <HiColorSwatch />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Item Tidak Ditemukan</EmptyState.Title>
              <EmptyState.Description>
                Try adjusting your search
              </EmptyState.Description>
            </VStack>
            <List.Root variant="marker">
              <List.Item>Try removing filters</List.Item>
              <List.Item>Try different keywords</List.Item>
            </List.Root>
          </EmptyState.Content>
        </EmptyState.Root>
      )}
    </Box>
  );
}

export default ListBarang;
