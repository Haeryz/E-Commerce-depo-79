import { Alert, Box, Group } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { HiColorSwatch } from 'react-icons/hi'

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
                    <Button>Pesanan Anda</Button>
                </EmptyState>
            </Box>
        </Box>
    )
}

export default OrderSuccess