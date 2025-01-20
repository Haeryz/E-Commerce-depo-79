import { Box, HStack, Input, Separator, Text, Textarea, VStack } from '@chakra-ui/react'
import React from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'

function Checkout() {
  return (
    <VStack p={10} align={'strech'}>
      <BreadcrumbRoot fontWeight={'bold'} ml={10} mb={5} alignSelf={'flex-start'}>
        <BreadcrumbLink href='#'>
          cart
        </BreadcrumbLink>
        <BreadcrumbCurrentLink>
          checkout
        </BreadcrumbCurrentLink>
        <BreadcrumbLink href='#'>
          payment
        </BreadcrumbLink>
      </BreadcrumbRoot>

      <HStack justifyContent={'space-between'} w={'full'} px={10}>
        <Box bg="bg" shadow="md" borderRadius="md" width="70%" mb={5} boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)" >
          <VStack align={'start'} m={5}>
            <Text fontWeight={'md'} fontSize={15}>
              Detail Pesanan
            </Text>
            <Field label="Nama Lengkap">
              <Input placeholder="me@example.com" />
            </Field>
            <HStack justifyContent="space-between" gapX={4} width="100%">
              <Field label="Email">
                <Input placeholder="me@example.com" />
              </Field>
              <Field label="Konfirmasi Email" style={{ marginLeft: "auto" }}>
                <Input placeholder="me@example.com" />
              </Field>
            </HStack>
            <Text m={5}>
              Detail Alamat
            </Text>
            <Field label="Alamat Lengkap">
              <Textarea size={'xl'} placeholder='alamat lengkap' />
            </Field>
            <Field label="Provinsi">
              <Input placeholder="me@example.com" />
            </Field>
            <Field label="Kota">
              <Input placeholder="me@example.com" />
            </Field>
            <Field label="Kecamatan">
              <Input placeholder="me@example.com" />
            </Field>
            <Field label="Kelurahan">
              <Input placeholder="me@example.com" />
            </Field>
            <Field label="Kodepos">
              <Input placeholder="me@example.com" />
            </Field>
          </VStack>
        </Box>

        <Box bg="bg" shadow="md" borderRadius="md" width="30%" alignSelf={'flex-start'}>
          <VStack>
            <HStack justifyContent={'space-between'} w={'full'} mt={5}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Subtotal
              </Text>
              <Text mr={5}>
                Rp.300.000,00
              </Text>
            </HStack>
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Diskon
              </Text>
              <Text mr={5}>
                Rp.0
              </Text>
            </HStack>
            <Separator />
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text ml={5} fontWeight={"Bold"} color={'gray.500'}>
                Grandtotal
              </Text>
              <Text mr={5}>
                Rp.300.000,00
              </Text>
            </HStack>
            <Button w={'90%'} mb={5}>
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </HStack>
    </VStack>
  )
}

export default Checkout