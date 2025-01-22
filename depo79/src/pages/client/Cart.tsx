import React, { useState } from 'react'
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from '../../components/ui/breadcrumb'
import { Box, Button, HStack, IconButton, Image, Separator, Text, VStack } from '@chakra-ui/react'
import { Checkbox } from '../../components/ui/checkbox'
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import image2 from '../../assets/placeholder/placeholder2.png'
import { motion } from 'framer-motion'

function Cart() {
  const [quantities, setQuantities] = useState([1, 1, 1]); // Initialize quantities for each item

  // Updated functions to handle specific item quantities
  const incrementQuantity = (index: number) => {
    setQuantities(prev => {
      const newQuantities = [...prev];
      newQuantities[index] = prev[index] + 1;
      return newQuantities;
    });
  };

  const decrementQuantity = (index: number) => {
    setQuantities(prev => {
      const newQuantities = [...prev];
      newQuantities[index] = prev[index] > 1 ? prev[index] - 1 : 1;
      return newQuantities;
    });
  };

  return (
    <VStack 
      align={'stretch'} 
      w="full" 
      bg="gray.50" 
      minH="100vh" 
      py={{ base: 4, md: 8 }}
      px={{ base: 2, sm: 4, md: 6, lg: 8 }}
    >
      <BreadcrumbRoot 
        display={{ base: 'none', sm: 'flex' }}
        mb={{ base: 3, md: 5 }} 
        alignSelf={'flex-start'}
      >
        <BreadcrumbLink href="/detail-barang">Detail</BreadcrumbLink>
        <BreadcrumbLink>Cart</BreadcrumbLink>
        <BreadcrumbCurrentLink>Payments</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
      
      <HStack 
        justifyContent={'space-between'} 
        w={'full'} 
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, sm: 6, lg: 8 }}  
        alignItems="flex-start"
        as={VStack}
      >
        {/* Cart Section */}
        <Box 
          bg="white" 
          shadow={{ base: 'md', md: 'xl' }}
          borderRadius={{ base: 'lg', md: '2xl' }}
          w={{ base: '100%', lg: '70%' }} 
          mb={{ base: 3, md: 5 }}
        >
          <VStack gap={{ base: 4, md: 6 }}>  
            <HStack 
              justifyContent={'space-between'} 
              w={'full'} 
              p={{ base: 4, sm: 6, md: 8 }}
              bg="gray.50"
              flexWrap={{ base: 'wrap', sm: 'nowrap' }}
            >
              <Text 
                fontWeight="extrabold" 
                fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
              >
                Shopping Cart
              </Text>
              <Button 
                size={{ base: 'sm', md: 'md' }}
                colorScheme="red"
                variant="ghost"
                _hover={{ bg: 'red.50' }}
              >
                <FaTrashAlt />
                <Text ml={2} display={{ base: 'none', md: 'block' }}>Clear Cart</Text>
              </Button>
            </HStack>

            {/* Products Header */}
            <HStack 
              justifyContent={'space-between'} 
              w={'full'} 
              px={8}
              display={{ base: 'none', sm: 'flex' }}
              color="gray.500"
              fontWeight="medium"
            >
              <Text>Products</Text>
              <Text>Quantity</Text>
              <Text>Price</Text>
            </HStack>

            {/* Product Items */}
            <VStack w="full" gap={{ base: 3, md: 4 }} px={{ base: 2, sm: 4 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                <Box 
                  p={{ base: 3, md: 4 }}
                  borderRadius={{ base: 'lg', md: 'xl' }}
                  border="1px"
                  borderColor="gray.100"
                  _hover={{ bg: 'gray.50' }}
                >
                  <HStack 
                    justifyContent={'space-between'} 
                    w={'full'}
                    flexDir={{ base: 'column', sm: 'row' }}
                    gap={{ base: 3, md: 4 }}  
                  >
                    <Checkbox>
                      <HStack gap={{ base: 3, md: 6 }}>  
                        <Image 
                          src={image2} 
                          alt='image 2' 
                          w={{ base: '70px', sm: '80px', md: '100px' }}
                          h={{ base: '70px', sm: '80px', md: '100px' }}
                          objectFit="cover"
                          borderRadius="xl"
                          shadow="md"
                        />
                        <VStack align="start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold">Semen Gresik</Text>
                          <Text color={'gray.500'}>Grey</Text>
                          <Text color={'blue.500'} fontSize="sm">In Stock</Text>
                        </VStack>
                      </HStack>
                    </Checkbox>

                    <HStack 
                      gap={{ base: 2, md: 4 }}
                      alignSelf={{ base: 'flex-start', sm: 'center' }}
                      ml={{ base: 4, sm: 8, md: 0 }}
                    >
                      <Box 
                        bg="white" 
                        shadow="md" 
                        borderRadius="full" 
                        px={4}
                        py={2}
                      >
                        <HStack gap={4}>  
                          <IconButton 
                            aria-label="Decrease quantity"
                            onClick={() => decrementQuantity(0)} // Pass index 0 for first item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaMinus />
                          </IconButton>
                          <Text minW="20px" textAlign="center" fontWeight="medium">{quantities[0]}</Text>
                          <IconButton 
                            aria-label="Increase quantity"
                            onClick={() => incrementQuantity(0)} // Pass index 0 for first item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaPlus />
                          </IconButton>
                        </HStack>
                      </Box>
                      <IconButton
                        aria-label="Delete item"
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </HStack>

                    <Text 
                      fontWeight="bold"
                      fontSize={{ base: 'md', md: 'lg' }}
                      color="blue.600"
                    >
                      Rp.300.000,00
                    </Text>
                  </HStack>
                </Box>
              </motion.div>
              <Separator />
            </VStack>

            {/* Repeat the product item structure for other items */}
            <VStack w="full" gap={{ base: 3, md: 4 }} px={{ base: 2, sm: 4 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                <Box 
                  p={{ base: 3, md: 4 }}
                  borderRadius={{ base: 'lg', md: 'xl' }}
                  border="1px"
                  borderColor="gray.100"
                  _hover={{ bg: 'gray.50' }}
                >
                  <HStack 
                    justifyContent={'space-between'} 
                    w={'full'}
                    flexDir={{ base: 'column', sm: 'row' }}
                    gap={{ base: 3, md: 4 }}  
                  >
                    <Checkbox>
                      <HStack gap={{ base: 3, md: 6 }}>  
                        <Image 
                          src={image2} 
                          alt='image 2' 
                          w={{ base: '70px', sm: '80px', md: '100px' }}
                          h={{ base: '70px', sm: '80px', md: '100px' }}
                          objectFit="cover"
                          borderRadius="xl"
                          shadow="md"
                        />
                        <VStack align="start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold">Semen Gresik</Text>
                          <Text color={'gray.500'}>Grey</Text>
                          <Text color={'blue.500'} fontSize="sm">In Stock</Text>
                        </VStack>
                      </HStack>
                    </Checkbox>

                    <HStack 
                      gap={{ base: 2, md: 4 }}
                      alignSelf={{ base: 'flex-start', sm: 'center' }}
                      ml={{ base: 4, sm: 8, md: 0 }}
                    >
                      <Box 
                        bg="white" 
                        shadow="md" 
                        borderRadius="full" 
                        px={4}
                        py={2}
                      >
                        <HStack gap={4}>  
                          <IconButton 
                            aria-label="Decrease quantity"
                            onClick={() => decrementQuantity(1)} // Pass index 1 for second item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaMinus />
                          </IconButton>
                          <Text minW="20px" textAlign="center" fontWeight="medium">{quantities[1]}</Text>
                          <IconButton 
                            aria-label="Increase quantity"
                            onClick={() => incrementQuantity(1)} // Pass index 1 for second item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaPlus />
                          </IconButton>
                        </HStack>
                      </Box>
                      <IconButton
                        aria-label="Delete item"
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </HStack>

                    <Text 
                      fontWeight="bold"
                      fontSize={{ base: 'md', md: 'lg' }}
                      color="blue.600"
                    >
                      Rp.300.000,00
                    </Text>
                  </HStack>
                </Box>
              </motion.div>
              <Separator />
            </VStack>

            <VStack w="full" gap={{ base: 3, md: 4 }} px={{ base: 2, sm: 4 }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                <Box 
                  p={{ base: 3, md: 4 }}
                  borderRadius={{ base: 'lg', md: 'xl' }}
                  border="1px"
                  borderColor="gray.100"
                  _hover={{ bg: 'gray.50' }}
                >
                  <HStack 
                    justifyContent={'space-between'} 
                    w={'full'}
                    flexDir={{ base: 'column', sm: 'row' }}
                    gap={{ base: 3, md: 4 }}  
                  >
                    <Checkbox>
                      <HStack gap={{ base: 3, md: 6 }}>  
                        <Image 
                          src={image2} 
                          alt='image 2' 
                          w={{ base: '70px', sm: '80px', md: '100px' }}
                          h={{ base: '70px', sm: '80px', md: '100px' }}
                          objectFit="cover"
                          borderRadius="xl"
                          shadow="md"
                        />
                        <VStack align="start" gap={1}>
                          <Text fontSize="lg" fontWeight="bold">Semen Gresik</Text>
                          <Text color={'gray.500'}>Grey</Text>
                          <Text color={'blue.500'} fontSize="sm">In Stock</Text>
                        </VStack>
                      </HStack>
                    </Checkbox>

                    <HStack 
                      gap={{ base: 2, md: 4 }}
                      alignSelf={{ base: 'flex-start', sm: 'center' }}
                      ml={{ base: 4, sm: 8, md: 0 }}
                    >
                      <Box 
                        bg="white" 
                        shadow="md" 
                        borderRadius="full" 
                        px={4}
                        py={2}
                      >
                        <HStack gap={4}>  
                          <IconButton 
                            aria-label="Decrease quantity"
                            onClick={() => decrementQuantity(2)} // Pass index 2 for third item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaMinus />
                          </IconButton>
                          <Text minW="20px" textAlign="center" fontWeight="medium">{quantities[2]}</Text>
                          <IconButton 
                            aria-label="Increase quantity"
                            onClick={() => incrementQuantity(2)} // Pass index 2 for third item
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                          >
                            <FaPlus />
                          </IconButton>
                        </HStack>
                      </Box>
                      <IconButton
                        aria-label="Delete item"
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </HStack>

                    <Text 
                      fontWeight="bold"
                      fontSize={{ base: 'md', md: 'lg' }}
                      color="blue.600"
                    >
                      Rp.300.000,00
                    </Text>
                  </HStack>
                </Box>
              </motion.div>
              <Separator />
            </VStack>
          </VStack>
        </Box>

        {/* Summary Section */}
        <Box 
          bg="white" 
          shadow={{ base: 'md', md: 'xl' }}
          borderRadius={{ base: 'lg', md: '2xl' }}
          w={{ base: '100%', lg: '30%' }}
          position={{ base: 'relative', lg: 'sticky' }}
          top={{ lg: '20px' }}
          p={{ base: 4, md: 6 }}
        >
          <VStack gap={{ base: 3, md: 4 }}>  
            <Text
              w="full"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="bold"
              pb={{ base: 3, md: 4 }}
              borderBottom="1px"
              borderColor="gray.100"
            >
              Order Summary
            </Text>
            
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text color={'gray.600'}>Subtotal</Text>
              <Text fontWeight="medium">Rp.300.000,00</Text>
            </HStack>
            
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text color={'gray.600'}>Discount</Text>
              <Text fontWeight="medium" color="green.500">- Rp.0</Text>
            </HStack>
            
            <Box w="full" h="1px" bg="gray.100" my={2} />
            
            <HStack justifyContent={'space-between'} w={'full'}>
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold" fontSize="xl" color="blue.600">
                Rp.300.000,00
              </Text>
            </HStack>
            
            <Button 
              w={'full'} 
              size={{ base: 'md', md: 'lg' }}
              fontSize={{ base: 'sm', md: 'md' }}
              colorScheme="blue"
              borderRadius="xl"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
              }}
            >
              Checkout Now
            </Button>
          </VStack>
        </Box>
      </HStack>
    </VStack>
  )
}

export default Cart
