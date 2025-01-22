import { useState } from 'react';
import { Box, HStack, Separator, Text, VStack, Stack, Collapsible, Image } from '@chakra-ui/react';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb';
import { Button } from '../../components/ui/button';
import { CheckboxCard } from '../../components/ui/checkbox-card';
import BCA from '../../assets/bca-bank-central-asia-logo-svgrepo-com.svg';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../../components/ui/file-upload';


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
                    <HStack align="stretch" gap={6} w="full" minH="300px">
                      {/* Left side - Bank Transfer Info */}
                      <VStack align="center" flex="1" h="full">
                        <Text fontWeight="bold" fontSize="lg">Transfer Bank</Text>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          w="full"
                          bg="gray.50"
                          flex="1"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                        >
                          <VStack align="start" gap={4} w="full">
                            <Image src={BCA} alt="BCA" w="80px" h="80px" />
                            <Box>
                              <Text color="gray.600" mb={1}>Nomor Rekening</Text>
                              <Text fontWeight="bold" fontSize="xl">36600404511</Text>
                              <Text color="gray.600" mt={1}>a.n Heti Agustina Wulandari</Text>
                            </Box>
                          </VStack>
                        </Box>
                      </VStack>

                      {/* Right side - File Upload */}
                      <VStack flex="1" h="full">
                        <Text fontWeight="bold" fontSize="lg">Upload Bukti</Text>
                        <Box flex="1" w="full">
                          <FileUploadRoot h="full" maxW="full" alignItems="stretch" maxFiles={10}>
                            <FileUploadDropzone
                              label="Drag and drop here to upload"
                              description=".png, .jpg up to 5MB"
                            />
                            <FileUploadList />
                          </FileUploadRoot>
                        </Box>
                      </VStack>
                    </HStack>
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