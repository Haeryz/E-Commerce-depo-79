import { Box, HStack, Input, Separator, Text, Textarea, VStack, Stack, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'
import { useCartStore } from '../../store/cart';


function Checkout() {
  const [loading, setLoading] = useState(true);

  const { items, total, fetchCart } = useCartStore();

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        await fetchCart();
      } catch (error) {
        console.error('Error initializing checkout:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [fetchCart]);

  if (loading) {
    return <Box textAlign="center" mt={10}><Spinner size="xl" /></Box>;
  }

  return (
    <VStack p={[4, 6, 10]} align="stretch">
      <BreadcrumbRoot fontWeight="bold" ml={[4, 6, 10]} mb={5} alignSelf="flex-start">
        <BreadcrumbLink href="/cart">
          cart
        </BreadcrumbLink>
        <BreadcrumbCurrentLink>
          checkout
        </BreadcrumbCurrentLink>
        <BreadcrumbLink href="/payment">
          payment
        </BreadcrumbLink>
      </BreadcrumbRoot>

      <Stack 
        direction={['column', 'column', 'row']} 
        gap={[4, 6, 10]} 
        w="full" 
        px={[4, 6, 10]}
      >
        <Box 
          bg="bg" 
          shadow="md" 
          borderRadius="md" 
          width={['100%', '100%', '70%']} 
          mb={5} 
          boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
        >
          <VStack align="start" m={[3, 4, 5]}>
            <Text fontWeight="md" fontSize={15}>
              Detail Pesanan
            </Text>
            <Field label="Nama Lengkap" w="full">
              <Input placeholder="me@example.com" />
            </Field>
            <Stack 
              direction={['column', 'column', 'row']} 
              w="full" 
              gap={4}
            >
              <Field label="Email" w="full">
                <Input placeholder="me@example.com" />
              </Field>
              <Field label="Nomor Telepon" w="full">
                <Input placeholder="+62" />
              </Field>
            </Stack>
            <Text mt={4} mb={2} fontWeight="medium">
              Detail Alamat
            </Text>
            <Field label="Alamat Lengkap" w="full">
              <Textarea size="xl" placeholder="alamat lengkap" />
            </Field>
            <Stack 
              direction={['column', 'column', 'row']} 
              w="full" 
              gap={4}
            >
              <Field label="Provinsi" w="full">
                <Input placeholder="provinsi" />
              </Field>
              <Field label="Kota" w="full">
                <Input placeholder="kota" />
              </Field>
            </Stack>
            <Stack 
              direction={['column', 'column', 'row']} 
              w="full" 
              gap={4}
            >
              <Field label="Kecamatan" w="full">
                <Input placeholder="kecamatan" />
              </Field>
              <Field label="Kelurahan" w="full">
                <Input placeholder="kelurahan" />
              </Field>
            </Stack>
            <Field label="Kodepos" w="full">
              <Input placeholder="kodepos" />
            </Field>
          </VStack>
        </Box>

        <Box 
          bg="bg" 
          shadow="md" 
          borderRadius="md" 
          width={['100%', '100%', '30%']} 
          alignSelf={['center', 'center', 'flex-start']}
        >
          <VStack>
            {items.map(item => (
              <HStack key={item._id} justifyContent="space-between" w="full" p={4}>
                <Text fontSize="sm">{item.product.nama} x {item.quantity}</Text>
                <Text>Rp.{(item.product.harga_jual * item.quantity).toLocaleString('id-ID')}</Text>
              </HStack>
            ))}
            
            <Separator />
            
            <HStack justifyContent="space-between" w="full" mt={5}>
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Subtotal
              </Text>
              <Text mr={5}>
                Rp.{total.toLocaleString('id-ID')}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" w="full">
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Diskon
              </Text>
              <Text mr={5}>
                Rp.0
              </Text>
            </HStack>
            <Separator />
            <HStack justifyContent="space-between" w="full">
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Grandtotal
              </Text>
              <Text mr={5}>
                Rp.{total.toLocaleString('id-ID')}
              </Text>
            </HStack>
            <Button w="90%" mb={5}>
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </Stack>
    </VStack>
  )
}

export default Checkout