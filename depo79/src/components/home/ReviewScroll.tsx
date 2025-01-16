import { useEffect } from "react";
import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import InfiniteSlider from "react-infinite-logo-slider";
import { useReviewStore } from "../../store/review";
import { useProductStore } from "../../store/product";
import { useProfileStore } from "../../store/profile";
import { useColorMode } from '../ui/color-mode';  // Import useColorMode

function ReviewScroll() {
    const { colorMode } = useColorMode();  // Add useColorMode hook
    const { reviews, loading, error, fetchReviews } = useReviewStore();
    const { productMap, loading: loadingProducts, error: productError, fetchProducts } = useProductStore();
    const { profileMap, loading: loadingProfile, error: profileError, fetchProfiles } = useProfileStore();

    useEffect(() => {
        fetchReviews();
        fetchProducts();
        fetchProfiles();
    }, [fetchReviews, fetchProducts, fetchProfiles]);

    if (loading || loadingProducts || loadingProfile) {
        return (
            <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error || productError || profileError) {
        return (
            <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} display="flex" justifyContent="center" alignItems="center">
                <Text color="red.500">{error || productError || profileError}</Text>
            </Box>
        );
    }

    return (
        <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.'} overflow="hidden">
            <Box
                maxW="87%"
                mx="auto"
                overflow="hidden"
            >
                <InfiniteSlider
                    pauseOnHover
                    toRight={true}
                >
                    {reviews.map((review) => {
                        const productName = productMap[review.product] || "Unknown Product";
                        const userName = profileMap[review.user]?.nama || "Anonymous User";
                        return (
                            <Box
                                key={review._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                boxShadow="sm"
                                textAlign="left"
                                mx={2}
                                minWidth="280px"
                                maxWidth="400px"
                                width="100%"
                                flexShrink={0}
                                bg={colorMode === 'light' 
                                    ? 'rgba(255, 255, 255, 0.2)' 
                                    : 'rgba(128, 128, 128, 0.2)'} // Darker background for dark mode
                                backdropFilter="blur(10px)"
                                _hover={{
                                    backdropFilter: "blur(20px)",
                                }}
                                mb={5}
                            >
                                <VStack align="stretch">
                                    <Text 
                                        fontWeight="bold" 
                                        fontSize="md" 
                                        textAlign="center"
                                        color={colorMode === 'light' ? 'black' : 'white'}
                                    >
                                        {userName}
                                    </Text>
                                    <Text 
                                        fontSize="sm" 
                                        color={colorMode === 'light' ? 'gray.500' : 'gray.300'} 
                                        textAlign="center"
                                    >
                                        {productName}
                                    </Text>
                                    <Text 
                                        fontSize="sm" 
                                        color={colorMode === 'light' ? 'gray.700' : 'gray.200'} 
                                        textAlign="left"
                                    >
                                        {review.comment}
                                    </Text>
                                </VStack>
                            </Box>
                        );
                    })}
                </InfiniteSlider>
            </Box>
        </Box>
    );
}

export default ReviewScroll;