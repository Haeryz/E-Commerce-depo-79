import React, { useState } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Box, Button, HStack, IconButton, Image, Separator, Text, VStack } from '@chakra-ui/react'
import { Checkbox } from '../../components/ui/checkbox'
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import image2 from '../../assets/placeholder/placeholder2.png'

function Cart() {
  const [quantity, setQuantity] = useState(1); // State untuk quantity

  // Fungsi untuk menambah kuantitas
  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  // Fungsi untuk mengurangi kuantitas (dengan batas minimum 1)
  const decrementQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <VStack align={'stretch'}>
      <BreadcrumbRoot ml={10} mb={5} alignSelf={'flex-start'}>
        <BreadcrumbLink href="/detail-barang">Detail</BreadcrumbLink>
        <BreadcrumbLink>Cart</BreadcrumbLink>
        <BreadcrumbCurrentLink>Payments</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      <HStack justifyContent={'space-between'} w={'full'} px={10}>
        <Box bg="bg" shadow="md" borderRadius="md" width="80%" mb={5}>
          <VStack>
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text ml={10} mt={5} fontWeight={"bold"} fontSize={'3xl'}>
                Cart
              </Text>
              <Button mr={10} mt={5}>
                <FaTrashAlt />
                Hapus
              </Button>
            </HStack>

            <HStack justifyContent={'space-between'} w={'full'}>
              <Checkbox ml={10}>
                Products
              </Checkbox>
              <Text mr={10}>
                Quantity
              </Text>
              <Text mr={10}>
                Price
              </Text>
            </HStack>
            <Separator w={1050} />
            <HStack justifyContent={'space-between'} w={'full'}>
              <Checkbox ml={10}>
                <HStack>
                  <Image src={image2} alt='image 2' aspectRatio={1 / 1} width={"10%"} borderRadius={10} />
                  <VStack>
                    <Text>
                      Semen Gresik
                    </Text>
                    <Text color={'gray.400'}>
                      Grey
                    </Text>
                  </VStack>
                </HStack>
              </Checkbox>
              <VStack>
                <Box bg="bg" shadow="md" borderRadius="md" mr={362} width="20%" height="8">
                  <HStack>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'3xl'}
                      size={'xs'}
                      onClick={decrementQuantity}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </IconButton>
                    <Text>{quantity}</Text>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'lg'}
                      size={'xs'}
                      onClick={incrementQuantity}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </IconButton>
                  </HStack>
                </Box>
                <IconButton  mr={362} bg={'white'} color={'black'} size={'xs'}>
                  <FaTrashAlt />
                  Trash
                </IconButton>
              </VStack>

              <Text mr={10}>
                Rp.300.000,00
              </Text>
            </HStack>
            <Separator w={1050} />

            <HStack justifyContent={'space-between'} w={'full'}>
              <Checkbox ml={10}>
                <HStack>
                  <Image src={image2} alt='image 2' aspectRatio={1 / 1} width={"10%"} borderRadius={10} />
                  <VStack>
                    <Text>
                      Semen Gresik
                    </Text>
                    <Text color={'gray.400'}>
                      Grey
                    </Text>
                  </VStack>
                </HStack>
              </Checkbox>
              <VStack>
                <Box bg="bg" shadow="md" borderRadius="md" mr={362} width="20%" height="8">
                  <HStack>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'3xl'}
                      size={'xs'}
                      onClick={decrementQuantity}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </IconButton>
                    <Text>{quantity}</Text>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'lg'}
                      size={'xs'}
                      onClick={incrementQuantity}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </IconButton>
                  </HStack>
                </Box>
                <IconButton  mr={362} bg={'white'} color={'black'} size={'xs'}>
                  <FaTrashAlt />
                  Trash
                </IconButton>
              </VStack>

              <Text mr={10}>
                Rp.300.000,00
              </Text>
            </HStack>
            <Separator w={1050} />

            <HStack justifyContent={'space-between'} w={'full'}>
              <Checkbox ml={10}>
                <HStack>
                  <Image src={image2} alt='image 2' aspectRatio={1 / 1} width={"10%"} borderRadius={10} />
                  <VStack>
                    <Text>
                      Semen Gresik
                    </Text>
                    <Text color={'gray.400'}>
                      Grey
                    </Text>
                  </VStack>
                </HStack>
              </Checkbox>
              <VStack>
                <Box bg="bg" shadow="md" borderRadius="md" mr={362} width="20%" height="8">
                  <HStack>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'3xl'}
                      size={'xs'}
                      onClick={decrementQuantity}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </IconButton>
                    <Text>{quantity}</Text>
                    <IconButton
                      height={8}
                      bg={'white'}
                      color={'blackAlpha.700'}
                      fontSize={'lg'}
                      size={'xs'}
                      onClick={incrementQuantity}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </IconButton>
                  </HStack>
                </Box>
                <IconButton  mr={362} bg={'white'} color={'black'} size={'xs'}>
                  <FaTrashAlt />
                  Trash
                </IconButton>
              </VStack>

              <Text mr={10}>
                Rp.300.000,00
              </Text>
            </HStack>
            <Separator w={1050} />
          </VStack>
        </Box>

        {/*Bagian Kanan */}
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

export default Cart
