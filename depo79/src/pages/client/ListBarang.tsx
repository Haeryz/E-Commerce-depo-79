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
    <Box p={{ base: 1, sm: 3, md: 4, lg: 5 }}>
      {loading ? (
        <SimpleGrid 
          columns={{ base: 2, sm: 2, md: 3, lg: 4 }} 
          gap={{ base: 1, sm: 3, md: 4 }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <Stack key={index} gap={{ base: 2, md: 6 }} maxW="100%">
              <Skeleton height={{ base: "120px", sm: "180px", md: "200px" }} />
              <SkeletonText noOfLines={2} />
              <SkeletonText noOfLines={1} width="50%" />
            </Stack>
          ))}
        </SimpleGrid>
      ) : results.length > 0 ? (
        <SimpleGrid 
          columns={{ base: 2, sm: 2, md: 3, lg: 4 }} 
          gap={{ base: 1, sm: 3, md: 4 }}
        >
          {results.map((product) => (
            <Box
              maxW="100%"
              overflow="hidden"
              borderRadius="md"
              boxShadow="md"
              key={product._id}
              _hover={{
                transform: { base: "none", md: "scale(1.02)" },
                boxShadow: "lg",
              }}
              transition="transform 0.2s ease, box-shadow 0.2s ease"
            >
              <Link to={`/detail-barang/${product._id}`}>
                <Box 
                  position="relative" 
                  height={{ base: "120px", sm: "180px", md: "200px" }} 
                  width="100%" 
                  overflow="hidden"
                >
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
                <Box p={{ base: 1, sm: 3, md: 4 }}>
                  <Text 
                    fontSize={{ base: "sm", sm: "lg", md: "xl" }} 
                    fontWeight="bold" 
                    css={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { base: 1, md: 2 }
                    }}
                  >
                    {product.nama}
                  </Text>
                  <Text 
                    fontSize={{ base: "2xs", sm: "xs", md: "sm" }} 
                    color="gray.500"
                    css={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: { base: 1, md: 2 }
                    }}
                  >
                    {product.keterangan || "No description available"}
                  </Text>
                  <Text 
                    mt={{ base: 0.5, md: 2 }} 
                    fontWeight="medium" 
                    fontSize={{ base: "xs", sm: "md", md: "lg" }}
                  >
                    Rp.{product.harga_jual.toLocaleString()}
                  </Text>
                  <Text 
                    color={'gray.400'} 
                    fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                    display={{ base: "none", md: "block" }}
                  >
                    Klik disini untuk info lebih lanjut
                  </Text>
                </Box>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState.Root>
          <EmptyState.Content px={{ base: 2, md: 4 }}>
            <EmptyState.Indicator fontSize={{ base: "3xl", md: "4xl" }}>
              <HiColorSwatch />
            </EmptyState.Indicator>
            <VStack textAlign="center" gap={{ base: 2, md: 3 }}>
              <EmptyState.Title fontSize={{ base: "xl", md: "2xl" }}>
                Item Tidak Ditemukan
              </EmptyState.Title>
              <EmptyState.Description fontSize={{ base: "sm", md: "md" }}>
                Try adjusting your search
              </EmptyState.Description>
            </VStack>
            <List.Root variant="marker" fontSize={{ base: "sm", md: "md" }}>
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
