import { useState } from 'react';
import { Button, Text, VStack, Box, HStack, Icon, Textarea } from '@chakra-ui/react';
import { DialogContent, DialogCloseTrigger } from '../ui/dialog';
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '../ui/timeline';
import { LuCheck, LuPackage, LuShip, LuClock, LuCircle } from 'react-icons/lu';
import { FaStar } from "react-icons/fa";
import { useColorMode } from '../ui/color-mode';
import useCheckoutStore from '../../store/checkout';

interface PesananProps {
    isPesananOpen: boolean;
    setIsPesananOpen: (open: boolean) => void;
}

const Pesanan = ({ isPesananOpen, setIsPesananOpen }: PesananProps) => {
    const { colorMode } = useColorMode();
    const { checkouts, currentCheckout, fetchCheckoutById } = useCheckoutStore();
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleOrderClick = async (orderId: string) => {
        await fetchCheckoutById(orderId);
        setSelectedOrderId(orderId);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleSubmitReview = async () => {
        setIsSubmittingReview(true);
        try {
            console.log('Submitting review:', { orderId: selectedOrderId, rating, review });
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getTimelineItems = () => {
        const items = [];
        const status = currentCheckout?.status || 'Pending';

        items.push(
            <TimelineItem key="waiting">
                <TimelineConnector>
                    <LuClock />
                </TimelineConnector>
                <TimelineContent>
                    <TimelineTitle>Product is waiting admin</TimelineTitle>
                    <TimelineDescription>{formatDateTime(currentCheckout?.createdAt || '')}</TimelineDescription>
                </TimelineContent>
            </TimelineItem>
        );

        if (status === 'Ditolak') {
            items.push(
                <TimelineItem key="rejected">
                    <TimelineConnector>
                        <LuCircle />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Order Cancelled</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                        <Text color="red.500" mt={1} fontSize="sm">
                            Order was rejected by admin
                        </Text>
                    </TimelineContent>
                </TimelineItem>
            );
        } else if (status !== 'Pending') {
            items.push(
                <TimelineItem key="confirmed">
                    <TimelineConnector>
                        <LuCheck />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Order Confirmed</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                    </TimelineContent>
                </TimelineItem>
            );
        }

        if (status === 'Dikirim' || status === 'Diterima' || status === 'Selesai') {
            items.push(
                <TimelineItem key="shipped">
                    <TimelineConnector>
                        <LuShip />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Product Shipped</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                    </TimelineContent>
                </TimelineItem>
            );
        }

        if (status === 'Diterima' || status === 'Selesai') {
            items.push(
                <TimelineItem key="delivered">
                    <TimelineConnector>
                        <LuPackage />
                    </TimelineConnector>
                    <TimelineContent>
                        <TimelineTitle>Order Delivered</TimelineTitle>
                        <TimelineDescription>{formatDateTime(currentCheckout?.updatedAt || '')}</TimelineDescription>
                        <VStack align="stretch" mt={4} gap={3}>
                            <Text fontWeight="medium">Add Your Review</Text>
                            <HStack gap={2}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Icon
                                        key={star}
                                        color={star <= rating ? "yellow.400" : "gray.300"}
                                        cursor="pointer"
                                        onClick={() => setRating(star)}
                                        w={6}
                                        h={6}
                                    >
                                        <FaStar />
                                    </Icon>
                                ))}
                            </HStack>
                            <Textarea
                                placeholder="Write your review here..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                size="sm"
                                resize="vertical"
                                maxLength={500}
                            />
                            <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={handleSubmitReview}
                                disabled={!rating || !review.trim() || isSubmittingReview}
                            >
                                {isSubmittingReview ? "Loading..." : "Submit Review"}
                            </Button>
                        </VStack>
                    </TimelineContent>
                </TimelineItem>
            );
        }

        return items;
    };

    return (
        <DialogContent p={10}>
            {!selectedOrderId ? (
                <VStack align="stretch" gap={4}>
                    <Text fontSize="xl" fontWeight="bold">Your Orders</Text>
                    {checkouts.map((order) => (
                        <Box
                            key={order._id}
                            p={4}
                            border="1px"
                            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => handleOrderClick(order._id)}
                            _hover={{
                                bg: colorMode === 'light' ? 'gray.50' : 'gray.700'
                            }}
                        >
                            <HStack justify="space-between">
                                <VStack align="start" gap={1}>
                                    <Text fontWeight="medium">Order #{order._id.slice(-8)}</Text>
                                    <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                                        {formatDateTime(order.createdAt)}
                                    </Text>
                                </VStack>
                                <Text
                                    color={
                                        order.status === 'Pending' ? 'yellow.500' :
                                            order.status === 'Dikirim' ? 'blue.500' :
                                                order.status === 'Ditolak' ? 'red.500' :
                                                    order.status === 'Selesai' ? 'green.500' : 'gray.500'
                                    }
                                >
                                    {order.status}
                                </Text>
                            </HStack>
                            <Text mt={2}>Total: Rp {order.grandTotal.toLocaleString()}</Text>
                        </Box>
                    ))}
                </VStack>
            ) : (
                <VStack align="stretch" gap={4}>
                    <HStack justify="space-between">
                        <Text fontSize="xl" fontWeight="bold">Order Status</Text>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedOrderId(null)}>
                            Back to Orders
                        </Button>
                    </HStack>
                    <TimelineRoot maxW="400px">
                        {getTimelineItems()}
                    </TimelineRoot>
                </VStack>
            )}
            <DialogCloseTrigger />
        </DialogContent>
    );
};

export default Pesanan;
