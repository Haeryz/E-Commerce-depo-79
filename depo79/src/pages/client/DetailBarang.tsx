import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Rating } from '../../components/ui/rating'
import mainImage from '../../assets/placeholder/placeholder1.png'
import image2 from '../../assets/placeholder/placeholder2.png'
import image3 from '../../assets/placeholder/placeholder3.png'
import image4 from '../../assets/placeholder/placeholder4.png'

function DetailBarang() {
    return (
        <Box>
            <VStack align={"start"} ml={10} mt={3} mb={3}>
                <HStack gapX={40}>
                    <VStack align={"start"}>
                        <Text fontWeight={"bold"} fontSize={"4xl"}>SEMEN GRESIK</Text>
                        <HStack>
                            <Rating readOnly defaultValue={4} colorPalette={'yellow'} />
                            <Text fontWeight={'bold'}>
                                (4.5)
                            </Text>
                            <Text fontWeight={'normal'}>
                                225 reviews
                            </Text>
                            <Text fontWeight={'normal'}>
                                2090 terjual
                            </Text>
                        </HStack>
                        <Box>
                            <Text fontWeight={'bold'} fontSize={'xl'}>
                                Rp. 57.000
                            </Text>
                        </Box>
                    </VStack>
                    <VStack align={'center'}>
                        <Image 
                        src={mainImage}
                        alt='main image'
                        aspectRatio={4 / 3}
                        width={"70%"}
                        />
                        <HStack gapX={8} align={'center'} justify={'center'}>
                            <Image 
                            src={image2}
                            alt='image 2'
                            aspectRatio={1 / 1}
                            width={"20%"}
                            />
                            <Image 
                            src={image3}
                            alt='image 2'
                            aspectRatio={1 / 1}
                            width={"20%"}
                            />
                            <Image 
                            src={image4}
                            alt='image 2'
                            aspectRatio={1 / 1}
                            width={"20%"}
                            />
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    )
}

export default DetailBarang