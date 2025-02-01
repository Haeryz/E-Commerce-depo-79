import { Box, HStack, Input, Image, Separator, Table, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import CustomDatePicker from '../../components/main/CustomDatePicker'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'
import { IoPersonSharp } from "react-icons/io5"
import { FaLocationDot } from "react-icons/fa6"
import { BsTelephoneFill } from "react-icons/bs"
import useCheckoutStore from '../../store/checkout'
import { format } from 'date-fns'
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from '../../components/ui/dialog'
import { io, Socket } from 'socket.io-client'

interface CheckoutItem {
  _id: string;
  product: {
    _id: string;
    nama: string;
    harga_jual: number;
  };
  quantity: number;
  price: number;
}

// Add these utility functions at the component level
const getButtonStyles = (color: string) => ({
  bg: color,
  transition: 'all 0.2s',
  transform: 'translateY(0)',
  _hover: {
    opacity: 0.9,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  _active: {
    transform: 'translateY(0)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
});

const AdminOrder = () => {
  // Remove useDisclosure hook since we're using DialogRoot
  const { colorMode } = useColorMode()
  const { checkouts, fetchCheckouts, loading } = useCheckoutStore()
  const [selectedCheckout, setSelectedCheckout] = React.useState<typeof checkouts[0] | null>(null)
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchCheckouts();

    // Connect to socket with explicit configuration
    const socketInstance = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Debug connection
    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new checkouts
    socketInstance.on('newCheckout', (newCheckout) => {
      console.log('New checkout received:', newCheckout);
      useCheckoutStore.setState(state => ({
        checkouts: [...state.checkouts, newCheckout]
      }));
    });

    // Listen for checkout updates
    socketInstance.on('checkoutUpdated', (updatedCheckout) => {
      console.log('Checkout update received:', updatedCheckout);
      useCheckoutStore.setState(state => ({
        checkouts: state.checkouts.map(checkout =>
          checkout._id === updatedCheckout._id ? updatedCheckout : checkout
        )
      }));
      
      setSelectedCheckout(prev => 
        prev?._id === updatedCheckout._id ? updatedCheckout : prev
      );
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      if (socketInstance) {
        console.log('Disconnecting socket...');
        socketInstance.disconnect();
      }
    };
  }, []);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  // Calculate total for all items
  const calculateTotal = (items: CheckoutItem[]) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  // Handle row click to show details in side panel
  const handleRowClick = (checkout: typeof checkouts[0]) => {
    setSelectedCheckout(checkout)
  }

  // Add these new functions
  const handleAcceptOrder = async () => {
    if (!selectedCheckout) return;
    try {
      await useCheckoutStore.getState().updateCheckout(selectedCheckout._id, {
        status: 'Dikirim'
      });
      // Remove fetchCheckouts() as we'll rely on socket updates
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedCheckout) return;
    try {
      await useCheckoutStore.getState().updateCheckout(selectedCheckout._id, {
        status: 'Ditolak'
      });
      // Remove fetchCheckouts() as we'll rely on socket updates
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedCheckout) return;
    try {
      await useCheckoutStore.getState().updateCheckout(selectedCheckout._id, {
        status: 'Selesai'
      });
      // Remove fetchCheckouts() as we'll rely on socket updates
    } catch (error) {
      console.error('Failed to complete order:', error);
    }
  };

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box
        height="100%"
        w="75%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack align="stretch" height="100%" w={'100%'}>
          <HStack gap={4} align="stretch" width="100%">
            <CustomDatePicker />
            <Field w={'80%'}>
              <Input placeholder="Nama Customer" />
            </Field>
            <Button>
              Search
            </Button>
          </HStack>

          <Separator />

          <HStack>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Order</Table.ColumnHeader>
                  <Table.ColumnHeader>Customer</Table.ColumnHeader>
                  <Table.ColumnHeader>Pembayaran</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Alamat</Table.ColumnHeader>
                  <Table.ColumnHeader>Total</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {checkouts.map((checkout) => (
                  <Table.Row key={checkout._id} onClick={() => handleRowClick(checkout)}>
                    <Table.Cell>#{checkout._id.slice(-6)}</Table.Cell>
                    <Table.Cell>{checkout.nama_lengkap}</Table.Cell>
                    <Table.Cell>{checkout.pembayaran}</Table.Cell>
                    <Table.Cell>{checkout.status}</Table.Cell>
                    <Table.Cell>{`${checkout.alamat_lengkap}, ${checkout.kota}`}</Table.Cell>
                    <Table.Cell>Rp. {checkout.grandTotal.toLocaleString()}</Table.Cell>
                    <Table.Cell>{formatDate(checkout.createdAt)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </HStack>
        </VStack>
      </Box>
      <Box
        height="100%"
        w="25%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack align="stretch" height="100%" w={'100%'}>
          <Text>Order Details</Text>
          <Separator />

          {selectedCheckout?.items.map((item) => (
            <React.Fragment key={item._id}>
              <HStack w={'100%'} justifyContent={'space-between'}>
                <Text>Nama Product: {item.product?.nama || 'N/A'}</Text>
                <Text>#{item._id.slice(-6)}</Text>
              </HStack>
              <Text fontWeight={'bold'}>
                {item.quantity} X Rp. {item.price.toLocaleString()}
              </Text>
            </React.Fragment>
          ))}

          <Separator />
          <Text>Total</Text>
          <Text fontWeight={'bold'} mb={10}>
            Rp. {selectedCheckout ? calculateTotal(selectedCheckout.items).toLocaleString() : '0'}
          </Text>

          {selectedCheckout && (
            <>
              <HStack>
                <IoPersonSharp />
                <Text>{selectedCheckout.nama_lengkap}</Text>
              </HStack>
              <VStack w={'100%'} alignSelf={'flex-start'} align={'start'}>
                <HStack>
                  <FaLocationDot />
                  <Text>{selectedCheckout.alamat_lengkap}</Text>
                </HStack>
                <Text ml={6}>{selectedCheckout.provinsi}</Text>
                <Text ml={6}>{selectedCheckout.kota}</Text>
                <Text ml={6}>{selectedCheckout.kecamatan}</Text>
                <Text ml={6}>{selectedCheckout.kelurahan}</Text>
                <Text ml={6}>{selectedCheckout.kodepos}</Text>
              </VStack>
              <HStack>
                <BsTelephoneFill />
                <Text>{selectedCheckout.nomor_telefon}</Text>
              </HStack>
              <VStack align={'end'}>
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button 
                      w={'100%'} 
                      disabled={!selectedCheckout?.buktiTransfer}
                      {...getButtonStyles('blue')}
                    >
                      Cek Bukti Bayar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bukti Transfer</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      {selectedCheckout?.buktiTransfer ? (
                        <Image
                          src={selectedCheckout.buktiTransfer}
                          alt="Bukti Transfer"
                          w="100%"
                          borderRadius="md"
                        />
                      ) : (
                        <Text>No bukti transfer available</Text>
                      )}
                    </DialogBody>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
                <HStack w={'100%'}>
                  {selectedCheckout?.status === 'Menunggu Konfirmasi' ? (
                    <>
                      <Button 
                        w={'49%'} 
                        onClick={handleRejectOrder}
                        {...getButtonStyles('red')}
                      >
                        Tolak
                      </Button>
                      <Button 
                        w={'49%'} 
                        onClick={handleAcceptOrder}
                        {...getButtonStyles('green')}
                      >
                        Terima Pesanan
                      </Button>
                    </>
                  ) : selectedCheckout?.status === 'Dikirim' ? (
                    <Button 
                      w={'100%'} 
                      onClick={handleCompleteOrder}
                      {...getButtonStyles('green')}
                    >
                      Pesanan Selesai
                    </Button>
                  ) : null}
                </HStack>
              </VStack>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  )
}

export default AdminOrder