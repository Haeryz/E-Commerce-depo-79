import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCheckoutStore from '../../store/checkout';
import { Box, HStack, Text, VStack, Stack, Collapsible, Image } from '@chakra-ui/react';
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb';
import { Button } from '../../components/ui/button';
import { CheckboxCard } from '../../components/ui/checkbox-card';
import BCA from '../../assets/bca-bank-central-asia-logo-svgrepo-com.svg';
import { FileUploadDropzone, FileUploadList, FileUploadRoot } from '../../components/ui/file-upload';

const Payment = () => {
  const { id } = useParams(); // Get checkout ID from URL
  const navigate = useNavigate();
  const { fetchCheckoutById, uploadPaymentProof, currentCheckout, loading } = useCheckoutStore();
  const [selectedPayment, setSelectedPayment] = useState<'transfer' | 'cod' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      fetchCheckoutById(id);
    }
  }, [id, fetchCheckoutById]);

  const handlePaymentSelect = (method: 'transfer' | 'cod') => {
    setSelectedPayment(method);
  };

  // Update the file upload handler to handle form events
  const handleFileUpload = (event: React.FormEvent<HTMLDivElement>) => {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      setUploadedFile(fileList[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedPayment) {
        throw new Error('Please select a payment method');
      }

      if (!id) {
        throw new Error('No checkout ID found');
      }

      if (selectedPayment === 'transfer' && !uploadedFile) {
        throw new Error('Please upload payment proof for transfer method');
      }

      await uploadPaymentProof(id, {
        pembayaran: selectedPayment === 'transfer' ? 'Transfer' : 'COD',
        buktiTransfer: uploadedFile || undefined
      });

      // Redirect to success page or order status
      navigate('/order-success');
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process payment');
    }
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
            <Text fontWeight="md" fontSize={15}>Pembayaran</Text>
            
            {/* Payment Method Selection */}
            <Stack direction={['column', 'column', 'row']} w="100%" gap={[3, 4]}>
              <Collapsible.Root w={'100%'}>
                <HStack w="100%">
                  <Box w="50%" onClick={() => handlePaymentSelect('transfer')}>
                    <CheckboxCard
                      label="Transfer"
                      description="Bank transfer payment"
                      w="100%"
                      checked={selectedPayment === 'transfer'}
                    />
                  </Box>
                  <Box w="50%" onClick={() => handlePaymentSelect('cod')}>
                    <CheckboxCard
                      label="COD"
                      description="Cash on delivery"
                      w="100%"
                      checked={selectedPayment === 'cod'}
                    />
                  </Box>
                </HStack>

                {selectedPayment === 'transfer' && (
                  <Box padding={[3, 4]} borderWidth="1px" mt={3} w="100%">
                    <HStack align="stretch" gap={6} w="full" minH="300px">
                      {/* Bank Transfer Info */}
                      <VStack align="center" flex="1">
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

                      {/* File Upload */}
                      <VStack flex="1">
                        <Text fontWeight="bold" fontSize="lg">Upload Bukti</Text>
                        <FileUploadRoot
                          h="full"
                          maxW="full"
                          alignItems="stretch"
                          maxFiles={1}
                          onChange={handleFileUpload}
                          accept="image/*" // Add accepted file types
                        >
                          <FileUploadDropzone
                            label="Drop payment proof here"
                            description=".png, .jpg up to 5MB"
                          />
                          <FileUploadList />
                        </FileUploadRoot>
                      </VStack>
                    </HStack>
                  </Box>
                )}
              </Collapsible.Root>
            </Stack>
          </VStack>
        </Box>

        {/* Order Summary Box */}
        <Box
          bg="bg"
          shadow="md"
          borderRadius="md"
          width={['100%', '100%', '30%']}
          alignSelf="flex-start"
        >
          <VStack>
            {/* Display current checkout details */}
            {currentCheckout && (
              <>
                <HStack justifyContent="space-between" w="full" mt={5}>
                  <Text ml={5} fontWeight="Bold" color="gray.500">Subtotal</Text>
                  <Text mr={5}>Rp.{currentCheckout.grandTotal.toLocaleString('id-ID')}</Text>
                </HStack>
                {/* ...other checkout details... */}
              </>
            )}
            <Button 
              w="90%" 
              mb={5} 
              onClick={handleSubmit}
              loading={loading}
              disabled={!selectedPayment || (selectedPayment === 'transfer' && !uploadedFile)}
            >
              Konfirmasi Pembayaran
            </Button>
          </VStack>
        </Box>
      </Stack>
    </VStack>
  );
};

export default Payment;