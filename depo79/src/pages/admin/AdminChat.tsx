import { Box, HStack, Input, Text, VStack, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Avatar } from '../../components/ui/avatar'
import { FiSend } from 'react-icons/fi'

const AdminChat = () => {
  const { colorMode } = useColorMode()
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"]

  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  return (
    <Box display="flex" height="100vh" w="85%" p={4}>
      <Box
        height="100%"
        w="100%"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        borderRadius={16}
        overflow="hidden"
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.1)"
      >
        <HStack w={'100%'} align="start" h="100%" gap={0}>
          {/* Contacts Section */}
          <VStack 
            w={'25%'} 
            align={'stretch'} 
            h="100%"
            borderRight="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
          >
            <Box p={4} borderBottom="1px solid" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}>
              <Input 
                placeholder="Search" 
                bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} 
                border="none"
                borderRadius="full"
                _focus={{ boxShadow: 'none' }}
              />
            </Box>
            <VStack 
              overflowY="auto" 
              h="calc(100% - 72px)" 
              w="100%" 
              gap={0}
            >
              <HStack 
                p={4} 
                w="100%" 
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Avatar name="Shane Nelson" colorPalette={pickPalette("Shane Nelson")} />
                <VStack align="start" gap={1}>
                  <Text fontWeight="medium">Aingmacan</Text>
                  <Text fontSize="sm" color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    Last message here...
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>

          {/* Chat Section */}
          <VStack
            bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
            w={'75%'}
            h="100%"
            gap={0}
          >
            <Box 
              w="100%" 
              p={4} 
              borderBottom="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
            >
              <Text fontWeight="medium">Aingmacan</Text>
            </Box>

            <VStack w="100%" h="calc(100% - 140px)" p={4} overflowY="auto" gap={4}>
              <HStack w="100%" justify="flex-start">
                <VStack align="start" maxW="70%">
                  <Box
                    bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
                    px={4}
                    py={2}
                    borderRadius="2xl"
                  >
                    <Text>Hi, how can I help you today?</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.500" pl={2}>09:41</Text>
                </VStack>
              </HStack>

              <HStack w="100%" justify="flex-end">
                <VStack align="end" maxW="70%">
                  <Box
                    bg={colorMode === 'light' ? 'blue.500' : 'blue.600'}
                    px={4}
                    py={2}
                    borderRadius="2xl"
                    color="white"
                  >
                    <Text>I have a question about my order</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.500" pr={2}>09:42</Text>
                </VStack>
              </HStack>
            </VStack>

            <Box 
              w="100%" 
              p={4} 
              borderTop="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
            >
              <HStack w="100%" gap={3}>
                <Input
                  placeholder="iMessage"
                  bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
                  borderRadius="full"
                  border="none"
                  _focus={{ boxShadow: 'none' }}
                />
                <IconButton
                  aria-label="Send message"
                  colorScheme="blue"
                  borderRadius="full"
                  size="md"
                >
                  <FiSend />
                </IconButton>
              </HStack>
            </Box>
          </VStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default AdminChat