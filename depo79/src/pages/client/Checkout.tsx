import { Box, HStack, Input, Separator, Text, Textarea, VStack, Stack, Spinner, createListCollection } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'
import { useCartStore } from '../../store/cart';
import { useLokasiStore } from '../../store/location';
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '../../components/ui/select'


function Checkout() {
  const [loading, setLoading] = useState(true);
  const [selectedProvinsi, setSelectedProvinsi] = useState<number>(0);
  const [selectedKota, setSelectedKota] = useState<number>(0);
  const [selectedKecamatan, setSelectedKecamatan] = useState<number>(0);

  const { provinsi, fetchProvinsi, kota, fetchKota, kecamatan, fetchKecamatan, kelurahan, fetchKelurahan } = useLokasiStore();

  useEffect(() => {
    const initializeProvinsi = async () =>
    {
      try {
        setLoading(true);
        await fetchProvinsi();
      } catch (error) {
        console.error('Error fetching provinsi:', error);
      } finally {
        setLoading(false);
      }
    }
    initializeProvinsi();
  }, [fetchProvinsi]);

  const provinsiCollection = createListCollection({
    items: provinsi.map(prov => ({
      label: prov.nama,
      value: prov._id
    }))
  })

  const kotaCollection = createListCollection({
    items: kota.map(k => ({
      label: k.nama,
      value: k._id
    }))
  })

  const kecamatanCollection = createListCollection({
    items: kecamatan.map(kec => ({
      label: kec.nama,
      value: kec._id
    }))
  })

  const kelurahanCollection = createListCollection({
    items: kelurahan.map(kel => ({
      label: kel.nama,
      value: kel._id
    }))
  })

  const handleKecamatanChange = (value: number) => {
    setSelectedKecamatan(value);
    fetchKelurahan(parseInt(value.toString()));
  }
  
  const handleKotaChange = (value: number) => {
    setSelectedKota(value);
    fetchKecamatan(parseInt(value.toString()));
  }

  const handleProvinsiChange = (value: number) => {
    setSelectedProvinsi(value);
    fetchKota(parseInt(value.toString()));
  }

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
              <SelectRoot collection={provinsiCollection} size="md" width="100%">
                <SelectLabel>
                  Pilih Provinsi
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder='Pilih Provinsi'/>
                </SelectTrigger>
                <SelectContent>
                  {provinsiCollection.items.map((prov) => (
                    <SelectItem item={prov} key={prov.value} onClick={() => handleProvinsiChange(prov.value)}>
                      {prov.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <SelectRoot collection={kotaCollection} size="md" width="100%">
                <SelectLabel>
                  Pilih Kota
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder='Pilih Kota'/>
                </SelectTrigger>
                <SelectContent>
                  {kotaCollection.items.map((kot) => (
                    <SelectItem item={kot} key={kot.value} onClick={() => handleKotaChange(kot.value)}>
                      {kot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Stack>
            <Stack
              direction={['column', 'column', 'row']}
              w="full"
              gap={4}
            >
              <SelectRoot collection={kecamatanCollection} size="md" width="100%">
                <SelectLabel>
                  Kecamatan
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder='Pilih Kecamatan'/>
                </SelectTrigger>
                <SelectContent>
                  {kecamatanCollection.items.map((prov) => (
                    <SelectItem item={prov} key={prov.value} onClick={() => handleKecamatanChange(prov.value)}>
                      {prov.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <SelectRoot collection={kelurahanCollection} size="md" width="100%">
                <SelectLabel>
                  Kelurahan
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder='Pilih Kelurahan'/>
                </SelectTrigger>
                <SelectContent>
                  {kelurahanCollection.items.map((kel) => (
                    <SelectItem item={kel} key={kel.value}>
                      {kel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
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