import { Box, HStack, Input, Image, Separator, Table, Text, VStack, createListCollection } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import CustomDatePicker from '../../components/main/CustomDatePicker'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'
import { IoPersonSharp } from "react-icons/io5"
import { FaLocationDot } from "react-icons/fa6"
import { BsTelephoneFill } from "react-icons/bs"
import { FiDownload } from 'react-icons/fi';
import useCheckoutStore from '../../store/checkout'
import { format } from 'date-fns'
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from '../../components/ui/dialog'
import { io, Socket } from 'socket.io-client'
import * as XLSX from 'xlsx';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../components/ui/select'
import { useCheckoutSearchStore } from '../../store/checkoutSearch';
import debounce from 'lodash/debounce';  // Add this import

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
  const { colorMode } = useColorMode();
  const { checkouts, fetchCheckouts } = useCheckoutStore();
  const [selectedCheckout, setSelectedCheckout] = React.useState<typeof checkouts[0] | null>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [localCheckouts, setLocalCheckouts] = React.useState(checkouts);
  const { searchParams, setSearchParams, searchCheckouts, searchResults, isLoading } = useCheckoutSearchStore();
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // Add debounced search
  const debouncedSearch = React.useCallback(
    debounce(() => {
      searchCheckouts();
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSearchParams({ query: value });
    debouncedSearch();
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setSearchParams({ status: value });
    debouncedSearch();
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setSearchParams({
        startDate: format(date, 'yyyy-MM-dd'),
        endDate: format(date, 'yyyy-MM-dd')
      });
      debouncedSearch();
    }
  };

  useEffect(() => {
    setLocalCheckouts(checkouts);
  }, [checkouts]);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Initial fetch
        await fetchCheckouts();

        const socketInstance = io(import.meta.env.VITE_API_URL, {
          withCredentials: true,
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          timeout: 20000
        });

        socketInstance.on('connect', () => {
          console.log('Connected to socket server:', socketInstance.id);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          socketInstance.io.opts.transports = ['polling', 'websocket'];
        });

        socketInstance.on('newCheckout', async (newCheckout) => {
          console.log('New checkout received:', newCheckout);
          await fetchCheckouts(); // Fetch fresh data
          setLocalCheckouts(prev => [newCheckout, ...prev]);
        });

        socketInstance.on('checkoutUpdated', async (updatedCheckout) => {
          console.log('Checkout update received:', updatedCheckout);
          await fetchCheckouts(); // Fetch fresh data
          setLocalCheckouts(prev =>
            prev.map(checkout =>
              checkout._id === updatedCheckout._id ? updatedCheckout : checkout
            )
          );

          if (selectedCheckout?._id === updatedCheckout._id) {
            setSelectedCheckout(updatedCheckout);
          }
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();
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

  // Add this new function
  const handleExportToExcel = () => {
    // Transform checkouts data for Excel
    const excelData = checkouts.map(checkout => ({
      'Order ID': `#${checkout._id.slice(-6)}`,
      'Customer Name': checkout.nama_lengkap,
      'Payment Method': checkout.pembayaran,
      'Status': checkout.status,
      'Address': `${checkout.alamat_lengkap}, ${checkout.kota}`,
      'Total': `Rp. ${checkout.grandTotal.toLocaleString()}`,
      'Date': formatDate(checkout.createdAt),
      'Phone': checkout.nomor_telefon || 'N/A',
      'Email': checkout.Email || 'N/A',
      'Province': checkout.provinsi,
      'City': checkout.kota,
      'District': checkout.kecamatan,
      'Sub-District': checkout.kelurahan,
      'Postal Code': checkout.kodepos
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Generate file name with current date
    const fileName = `orders_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  // Filter checkouts to exclude 'Selesai' and 'Ditolak' if updated today
  const filteredCheckouts = React.useMemo(() => {
    console.log('Filtering checkouts:', localCheckouts.length); // Debug log
    return localCheckouts.filter(checkout => {
      const today = new Date();
      const updatedAt = new Date(checkout.updatedAt);
      const isToday = updatedAt.toDateString() === today.toDateString();
      return !(checkout.status === 'Selesai' || checkout.status === 'Ditolak') || isToday;
    });
  }, [localCheckouts]); // Add forceUpdate as dependency

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box
        height="100%"
        w="75%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
        display="flex"
        flexDirection="column"
      >
        <VStack align="stretch" height="100%" gap={4}>
          <HStack gap={4} align="stretch" width="100%">
            <SelectRoot
              value={searchParams.status ? [searchParams.status] : undefined}
              onValueChange={(details) => handleStatusChange(details.items[0].value)}
              collection={frameworks}
              size="sm"
              width="100px"
            >
              <SelectTrigger>
                <SelectValueText placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {frameworks.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            <CustomDatePicker 
              selectedDate={selectedDate}
              onChange={handleDateChange}
            />
            <Field w={'60%'}>
              <Input 
                placeholder="Search orders..." 
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </Field>
            <Button
              loading={isLoading}
              onClick={() => searchCheckouts()}
            >
              Search
            </Button>
            <Button
              onClick={handleExportToExcel}
              {...getButtonStyles('green')}
            >
              <FiDownload style={{ marginRight: '0.5rem' }} />
              Export
            </Button>
          </HStack>

          <Separator />

          {/* Updated table container with overflow handling */}
          <Box flex={1} overflow="auto" borderRadius="md">
            <Table.Root>
              <Table.Header top={0} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} zIndex={1}>
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
                {(searchResults.length > 0 ? searchResults : filteredCheckouts).map((checkout) => (
                  <Table.Row
                    key={`${checkout._id}-${checkout.updatedAt}-${Math.random()}`} // Force re-render with random key
                    onClick={() => handleRowClick(checkout)}
                  >
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
          </Box>
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

const frameworks = createListCollection({
  items: [
    { label: "Pending", value: "react" },
    { label: "Menunggu Konfirmasi", value: "vue" },
    { label: "Diterima", value: "ts" },
    { label: "Ditolak", value: "js" },
    { label: "Dikirim", value: "c" },
    { label: "Selesai", value: "C++" },
  ],
})

export default AdminOrder