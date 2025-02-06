import { useEffect } from "react";
import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import InfiniteSlider from "react-infinite-logo-slider";
import { useReviewStore } from "../../store/review";
import { useColorMode } from '../ui/color-mode';

function ReviewScroll() {
    const { colorMode } = useColorMode();
    const { reviews, loading, error, fetchReviews } = useReviewStore();

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    if (loading) {
        return (
            <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} display="flex" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} display="flex" justifyContent="center" alignItems="center">
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    return (
        <Box p={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} overflow="hidden">
            <Box maxW="87%" mx="auto" overflow="hidden">
                <InfiniteSlider pauseOnHover toRight={true}>
                    {reviews.map((review) => (
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
                                : 'rgba(128, 128, 128, 0.2)'}
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
                                    {review.userName || "Anonymous User"}
                                </Text>
                                <Text
                                    fontSize="sm"
                                    color={colorMode === 'light' ? 'gray.500' : 'gray.300'}
                                    textAlign="center"
                                >
                                    {review.productName || "Unknown Product"}
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
                    ))}
                </InfiniteSlider>
            </Box>
        </Box>
    );
}

export default ReviewScroll;
