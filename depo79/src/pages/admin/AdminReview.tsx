import { Box, HStack, Separator, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Rating } from '../../components/ui/rating'
import { FaStar } from "react-icons/fa6";
import { ProgressBar, ProgressRoot } from '../../components/ui/progress';
import { Avatar } from '../../components/ui/avatar';
import { StatLabel, StatRoot, StatValueText } from '../../components/ui/stat';
import { useReviewStore } from '../../store/review';
import { useProfileStore } from '../../store/profile';
import { useProductStore } from '../../store/product';

const AdminReview = () => {
  const { colorMode } = useColorMode();
  const { reviews = [], loading: loadingReview, fetchReviews } = useReviewStore();
  const { profileMap = {}, fetchProfileReviews } = useProfileStore();
  const { productMap = {}, fetchProducts } = useProductStore();

  useEffect(() => {
    console.log("Fetching data...");
    fetchReviews();
    fetchProfileReviews();
    fetchProducts();
  }, [fetchReviews, fetchProfileReviews, fetchProducts]);

  // Add debug logs
  console.log("Reviews:", reviews);
  console.log("ProfileMap:", profileMap);
  console.log("ProductMap:", productMap);

  // Guard against loading state
  if (loadingReview) {
    return (
      <Box display="flex" height="100vh" p={4} w={'85%'} justifyContent="center" alignItems="center">
        <Text>Loading reviews...</Text>
      </Box>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Box display="flex" height="100vh" p={4} w={'85%'} justifyContent="center" alignItems="center">
        <Text>No reviews found</Text>
      </Box>
    );
  }

  // Calculate average rating - with null checks
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Calculate rating distribution - with null checks
  const ratingCounts = reviews ? reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>) : {};

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box
        height="100%"
        w="100%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
        display="flex"
        flexDirection="column"
      >
        {/* Stats Section - Fixed Height */}
        <VStack w={'100%'} mb={4} flex="0 0 auto">
          <HStack p={4} w={'100%'} justifyContent={'space-between'}>
            <VStack w={'30%'}>
              <StatRoot>
                <StatLabel info="Total Semua Review">Total Review</StatLabel>
                <StatValueText>{reviews.length}</StatValueText>
              </StatRoot>
            </VStack>

            <Separator orientation={'vertical'} h={32} size={'lg'} />

            <VStack w={'30%'}>
              <Text>
                Average Rating
              </Text>
              <HStack>
                <Text fontSize={'lg'}>
                  {averageRating}
                </Text>
                <Rating readOnly defaultValue={parseFloat(averageRating)} size={'lg'} disabled />
              </HStack>
            </VStack>

            <Separator orientation={'vertical'} h={32} size={'lg'} />

            <VStack w={'30%'}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <HStack w={'100%'} key={rating}>
                  <FaStar />
                  <Text>
                    {rating}
                  </Text>
                  <ProgressRoot w={'240px'} variant={'subtle'}>
                    <ProgressBar borderRadius={10} style={{ width: `${(ratingCounts[rating] || 0) / reviews.length * 100}%` }} />
                  </ProgressRoot>
                </HStack>
              ))}
            </VStack>
          </HStack>
          <Separator size={'lg'} />
        </VStack>

        {/* Reviews Section - Scrollable */}
        <VStack 
          w={'100%'} 
          flex="1 1 auto"
          overflow="auto"
          gap={4}
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: colorMode === 'light' ? '#f1f1f1' : '#2d3748',
            },
            '&::-webkit-scrollbar-thumb': {
              background: colorMode === 'light' ? '#888' : '#4a5568',
              borderRadius: '4px',
            },
          }}
        >
          {reviews.map((review) => (
            <HStack
              key={review._id}
              w={'100%'}
              minH={'150px'} // Set minimum height
              p={3}
              justifyContent={'space-between'}
              bg={colorMode === 'light' ? 'white' : 'gray.600'}
              borderRadius="md"
              boxShadow="sm"
            >
              <Box w={'7%'}>
                <Avatar size={'lg'} />
              </Box>
              <VStack m={4} align="start" w={'20%'}>
                <Text fontSize={'lg'} fontWeight="bold">
                  {review.userName || 'Unknown User'}
                </Text>
                <Text>
                  {review.productName || 'Unknown Product'}
                </Text>
              </VStack>
              <VStack w={'60%'} align={'start'}>
                <HStack>
                  <Rating readOnly defaultValue={review.rating} size={'lg'}/>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
                <Text>
                  {review.comment}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminReview;