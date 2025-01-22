import { Box, HStack, Input, Separator, Text, Textarea, VStack, Stack } from '@chakra-ui/react'
import React from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Field } from '../../components/ui/field'
import { Button } from '../../components/ui/button'

function Checkout() {
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
              <Field label="Konfirmasi Email" w="full">
                <Input placeholder="me@example.com" />
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
            <HStack justifyContent="space-between" w="full" mt={5}>
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Subtotal
              </Text>
              <Text mr={5}>
                Rp.300.000,00
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
                Rp.300.000,00
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