import { useEffect } from "react";
import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import InfiniteSlider from "react-infinite-logo-slider";
import { useReviewStore } from "../../store/review";
import { useProductStore } from "../../store/product"; // Import the product store

function ReviewScroll() {
    const { reviews, loading, error, fetchReviews } = useReviewStore();
    const { productMap, loading: loadingProducts, error: productError, fetchProducts } = useProductStore();

    // Fetch reviews and products when component mounts
    useEffect(() => {
        fetchReviews();
        fetchProducts(); // Make sure products are also fetched
    }, [fetchReviews, fetchProducts]);

    if (loading || loadingProducts) {
        return (
            <Box p={8} bg="gray.100" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error || productError) {
        return (
            <Box p={8} bg="gray.100" display="flex" justifyContent="center" alignItems="center">
                <Text color="red.500">{error || productError}</Text>
            </Box>
        );
    }

    return (
        <Box p={8} bg="gray.100" overflow="hidden">
            <Box
                maxW="87%" // Full width for responsiveness
                mx="auto" // Center the slider horizontally
                overflow="hidden" // Prevent content from overflowing
            >
                <InfiniteSlider
                    pauseOnHover
                >
                    {reviews.map((review) => {
                        const productName = productMap[review.product] || "Unknown Product"; // Use this pattern for fetching product name
                        return (
                            <Box
                                key={review._id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={4}
                                boxShadow="sm"
                                textAlign="left"
                                mx={2} // Space between slides
                                minWidth="280px" // Ensure a minimum width
                                maxWidth="400px" // Limit maximum width for each review card
                                width="100%" // Make the card width responsive
                                flexShrink={0}
                                bg="rgba(255, 255, 255, 0.2)" // Glass effect background with transparency
                                backdropFilter="blur(10px)" // Apply blur effect behind the card
                                _hover={{
                                    backdropFilter: "blur(20px)", // Stronger blur on hover
                                }}
                            >
                                <VStack align="stretch">
                                    <Text fontWeight="bold" fontSize="md" textAlign="center">
                                        {review.user}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500" textAlign="center">
                                        {productName} {/* Display the product name */}
                                    </Text>
                                    <Text fontSize="sm" color="gray.700" textAlign="justify">
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
