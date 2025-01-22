import React, { useState } from 'react';
import { Box, HStack, Separator, Text, VStack, Stack, Collapsible } from '@chakra-ui/react';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb';
import { Button } from '../../components/ui/button';
import { CheckboxCard } from '../../components/ui/checkbox-card';


const Payment = () => {
  type PaymentMethod = 'transfer' | 'cod' | null;
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  return (
    <VStack p={[4, 6, 10]} align="stretch">
      <BreadcrumbRoot fontWeight="bold" ml={[4, 6, 10]} mb={5} alignSelf="flex-start">
        <BreadcrumbLink href="/cart">cart</BreadcrumbLink>
        <BreadcrumbLink href="/checkout">checkout</BreadcrumbLink>
        <BreadcrumbCurrentLink>payment</BreadcrumbCurrentLink>
      </BreadcrumbRoot>

      <Stack direction={['column', 'column', 'row']} gap={[4, 6, 10]} w="full" px={[4, 6, 10]}>
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
              Pembayaran
            </Text>
            <Stack direction={['column', 'column', 'row']} w="100%" gap={[3, 4]}>
              <Collapsible.Root w={'100%'}>
                <HStack w="100%">
                  <Box w="50%" onClick={() => handlePaymentSelect('transfer')}>
                    <CheckboxCard
                      label="Transfer"
                      description="Best for apps"
                      w="100%"
                      checked={selectedPayment === 'transfer'}
                    />
                  </Box>
                  <Box w="50%" onClick={() => handlePaymentSelect('cod')}>
                    <CheckboxCard
                      label="COD"
                      description="Best for apps"
                      w="100%"
                      checked={selectedPayment === 'cod'}
                    />
                  </Box>
                </HStack>

                {selectedPayment === 'transfer' && (
                  <Box padding={[3, 4]} borderWidth="1px" mt={3} w="100%" fontSize={['sm', 'md']}>
                    Lorem
                  </Box>
                )}
                
                {selectedPayment === 'cod' && (
                  <Box padding={[3, 4]} borderWidth="1px" mt={3} w="100%" fontSize={['sm', 'md']}>
                    Ipsum
                  </Box>
                )}
              </Collapsible.Root>
            </Stack>
          </VStack>
        </Box>

        <Box bg="bg" shadow="md" borderRadius="md" width={['100%', '100%', '30%']} alignSelf="flex-start">
          <VStack>
            <HStack justifyContent="space-between" w="full" mt={5}>
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Subtotal
              </Text>
              <Text mr={5}>Rp.300.000,00</Text>
            </HStack>
            <HStack justifyContent="space-between" w="full">
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Diskon
              </Text>
              <Text mr={5}>Rp.0</Text>
            </HStack>
            <Separator />
            <HStack justifyContent="space-between" w="full">
              <Text ml={5} fontWeight="Bold" color="gray.500">
                Grandtotal
              </Text>
              <Text mr={5}>Rp.300.000,00</Text>
            </HStack>
            <Button w="90%" mb={5}>
              Pesan Sekarang
            </Button>
          </VStack>
        </Box>
      </Stack>
    </VStack>
  );
};

export default Payment;