import { Alert, Box, Group, Text } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { HiColorSwatch } from 'react-icons/hi'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTrigger } from '../../components/ui/dialog'
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '../../components/ui/timeline'
import { LuCheck, LuPackage, LuShip, LuClock } from 'react-icons/lu'
import useCheckoutStore from '../../store/checkout'

const OrderSuccess = () => {
    const { colorMode } = useColorMode()
    const { currentCheckout } = useCheckoutStore()

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

    const getTimelineItems = () => {
        const items = [];
        const status = currentCheckout?.status || 'Pending';

        // Always show waiting admin for Pending
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

        if (status !== 'Pending') {
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
                    </TimelineContent>
                </TimelineItem>
            );
        }

        return items;
    };

    return (
        <Box display="flex" height="92vh" w="100%" p={4}>
            <Box
                height="100%"
                w="100%"
                bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
                borderRadius={16}
                overflow="hidden"
                boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.1)"
                p={4}
            >
                <Alert.Root status="success" variant="subtle">
                    <Alert.Indicator />
                    <Alert.Title>Pesanan Telah diterima oleh Admin. Silahkan Tunggu Informasi Pengiriman !</Alert.Title>
                </Alert.Root>
                <EmptyState
                    icon={<HiColorSwatch />}
                    title="Lihat Pesanan Anda Disini"
                    description="Atau Klik Pesanan Pada Tombol di kanan atas"
                >
                    <DialogRoot>
                        <DialogTrigger>
                            <Button >Lihat Pesanan</Button>
                        </DialogTrigger>
                        <DialogContent p={10}>
                            <TimelineRoot maxW="400px">
                                {getTimelineItems()}
                            </TimelineRoot>
                            <DialogCloseTrigger />
                        </DialogContent>
                    </DialogRoot>
                </EmptyState>
            </Box>
        </Box>
    )
}

export default OrderSuccess