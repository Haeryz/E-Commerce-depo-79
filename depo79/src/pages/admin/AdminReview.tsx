import { Box, HStack, Separator, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from '../../components/ui/color-mode'
import { Rating } from '../../components/ui/rating'
import { FaStar } from "react-icons/fa6";
import { ProgressBar, ProgressRoot } from '../../components/ui/progress';
import { Avatar } from '../../components/ui/avatar';
import { StatLabel, StatRoot, StatValueText } from '../../components/ui/stat';

const AdminReview = () => {
  const { colorMode } = useColorMode()

  return (
    <Box display="flex" height="100vh" p={4} w={'85%'} gap={4}>
      <Box height="100%"
        w="100%"
        p={4}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        borderRadius={8}
        boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
      >
        <VStack w={'100%'} h={'100%'}>
          <HStack p={4} w={'100%'} justifyContent={'space-between'}>
            <VStack w={'30%'}>
              <StatRoot>
                <StatLabel info="Total Semua Review">Total Review</StatLabel>
                <StatValueText>10.0k</StatValueText>
              </StatRoot>
            </VStack>

            <Separator orientation={'vertical'} h={32} size={'lg'} />

            <VStack w={'30%'}>
              <Text>
                Averange Rating
              </Text>
              <HStack>
                <Text fontSize={'lg'}>
                  4.8
                </Text>
                <Rating defaultValue={4} size={'lg'} disabled />
              </HStack>
            </VStack>

            <Separator orientation={'vertical'} h={32} size={'lg'} />

            <VStack w={'30%'}>
              <HStack w={'100%'}>
                <FaStar />
                <Text>
                  5
                </Text>
                <ProgressRoot w={'240px'} variant={'subtle'}>
                  <ProgressBar borderRadius={10} />
                </ProgressRoot>
              </HStack >
              <HStack w={'100%'}>
                <FaStar />
                <Text>
                  4
                </Text>
                <ProgressRoot w={'240px'} variant={'subtle'}>
                  <ProgressBar borderRadius={10} />
                </ProgressRoot>
              </HStack>
              <HStack w={'100%'}>
                <FaStar />
                <Text>
                  3
                </Text>
                <ProgressRoot w={'240px'} variant={'subtle'}>
                  <ProgressBar borderRadius={10} />
                </ProgressRoot>
              </HStack>
              <HStack w={'100%'}>
                <FaStar />
                <Text>
                  2
                </Text>
                <ProgressRoot w={'240px'} variant={'subtle'}>
                  <ProgressBar borderRadius={10} />
                </ProgressRoot>
              </HStack>
              <HStack w={'100%'}>
                <FaStar />
                <Text>
                  1
                </Text>
                <ProgressRoot w={'240px'} variant={'subtle'}>
                  <ProgressBar borderRadius={10} />
                </ProgressRoot>
              </HStack>
            </VStack>
          </HStack>

          <Separator size={'lg'} />

          <HStack w={'100%'} h={'30%'} align={'start'} p={3} justifyContent={'space-between'}>
            <Box w={'7%'} h={'42%'} >
              <Avatar size={'full'} />
            </Box>
            <VStack m={4}>
              <Text fontSize={'lg'}>
                Muhammad Sumbul 
              </Text>
              <Text>
                Kayu Manis
              </Text>
            </VStack>
            <VStack w={'70%'} align={'start'}>
              <HStack>
              <Rating defaultValue={4} size={'lg'}/>
              <Text>24 - 02 - 2003</Text>
              </HStack>
              <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
              </Text>
            </VStack>
          </HStack>

          <Separator size={'lg'} />

          <HStack w={'100%'} h={'30%'} align={'start'} p={3} justifyContent={'space-between'}>
            <Box w={'7%'} h={'42%'} >
              <Avatar size={'full'} />
            </Box>
            <VStack m={4}>
              <Text fontSize={'lg'}>
                Muhammad Sumbul 
              </Text>
              <Text>
                Kayu Manis
              </Text>
            </VStack>
            <VStack w={'70%'} align={'start'}>
              <HStack>
              <Rating defaultValue={4} size={'lg'}/>
              <Text>24 - 02 - 2003</Text>
              </HStack>
              <Text>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </Box>


  )
}

export default AdminReview