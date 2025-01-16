import React, { useEffect } from "react";
import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import InfiniteSlider from "react-infinite-logo-slider";
import { useReviewStore } from "../../store/review";

function ReviewScroll() {
    const { reviews, loading, error, fetchReviews } = useReviewStore();

    // Fetch reviews when component mounts
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    if (loading) {
        return (
            <Box p={8} bg="gray.100" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
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
                    speed={100} // Adjust speed for scrolling
                    direction="right" // Scroll direction
                    pauseOnHover
                >
                    {reviews.map((review) => (
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
                            <VStack spacing={2} align="stretch">
                                <Text fontWeight="bold" fontSize="md" textAlign="center">
                                    {review.user}
                                </Text>
                                <Text fontSize="sm" color="gray.500" textAlign="center">
                                    {review.product}
                                </Text>
                                <Text fontSize="sm" color="gray.700" textAlign="justify">
                                    {review.comment}
                                </Text>
                            </VStack>
                        </Box>
                    ))}
                </InfiniteSlider>
            </Box>
        </Box>
    );
}

export default ReviewScroll;
