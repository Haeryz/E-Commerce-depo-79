import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../components/ui/select'
import CustomDatePicker from '../../components/main/CustomDatePicker'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'
import { IoPersonSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BsTelephoneFill } from "react-icons/bs";
import { Box, createListCollection, HStack, Input, Separator, Table, Text, VStack } from '@chakra-ui/react'
import useCheckoutStore from '../../store/checkout'
import { format } from 'date-fns' // Add this import
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle, DialogRoot, DialogTrigger } from '../../components/ui/dialog'
import { Image } from '@chakra-ui/react'

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

// Define the formatDate helper function
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
}

const AdminHistory = () => {
  const { colorMode } = useColorMode()
  const { checkouts } = useCheckoutStore();
  const [selectedCheckout, setSelectedCheckout] = React.useState<typeof checkouts[0] | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // Calculate total for all items
  const calculateTotal = (items: CheckoutItem[]) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }

  // Handle row click to show details in side panel
  const handleRowClick = (checkout: typeof checkouts[0]) => {
    setSelectedCheckout(checkout)
  }

  // Filter checkouts to include only 'Selesai' and 'Ditolak' if updated before today
  const filteredCheckouts = checkouts.filter(checkout => {
    const today = new Date();
    const updatedAt = new Date(checkout.updatedAt);
    const isBeforeToday = updatedAt.toDateString() !== today.toDateString();
    return (checkout.status === 'Selesai' || checkout.status === 'Ditolak') && isBeforeToday;
  });

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
            <SelectRoot collection={frameworks} size="sm" width="100px">
              <SelectTrigger>
                <SelectValueText placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {frameworks.items.map((movie) => (
                  <SelectItem item={movie} key={movie.value}>
                    {movie.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
            <CustomDatePicker 
              selectedDate={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <Field w={'60%'}>
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
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Product</Table.ColumnHeader>
                  <Table.ColumnHeader>Total</Table.ColumnHeader>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredCheckouts.map((checkout) => (
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
              <DialogRoot>
                <DialogTrigger asChild>
                  <Button 
                    w={'100%'} 
                    disabled={!selectedCheckout?.buktiTransfer}
                    bg={'blue'}
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

export default AdminHistory