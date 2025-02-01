import { Alert, Box, Group, Text } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { HiColorSwatch } from 'react-icons/hi'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTrigger } from '../../components/ui/dialog'
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from '../../components/ui/timeline'
import { LuCheck, LuPackage, LuShip } from 'react-icons/lu'

const OrderSuccess = () => {
    const { colorMode } = useColorMode()

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
                                <TimelineItem>
                                    <TimelineConnector>
                                        <LuShip />
                                    </TimelineConnector>
                                    <TimelineContent>
                                        <TimelineTitle>Product Shipped</TimelineTitle>
                                        <TimelineDescription>13th May 2021</TimelineDescription>
                                        <Text textStyle="sm">
                                            We shipped your product via <strong>FedEx</strong> and it should
                                            arrive within 3-5 business days.
                                        </Text>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineConnector>
                                        <LuCheck />
                                    </TimelineConnector>
                                    <TimelineContent>
                                        <TimelineTitle textStyle="sm">Order Confirmed</TimelineTitle>
                                        <TimelineDescription>18th May 2021</TimelineDescription>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineConnector>
                                        <LuPackage />
                                    </TimelineConnector>
                                    <TimelineContent>
                                        <TimelineTitle textStyle="sm">Order Delivered</TimelineTitle>
                                        <TimelineDescription>20th May 2021, 10:30am</TimelineDescription>
                                    </TimelineContent>
                                </TimelineItem>
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