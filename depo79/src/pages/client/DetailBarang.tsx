import { Box, Button, HStack, Image, Text, VStack, Separator } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Rating } from '../../components/ui/rating'
import mainImage from '../../assets/placeholder/placeholder1.png'
import image2 from '../../assets/placeholder/placeholder2.png'
import image3 from '../../assets/placeholder/placeholder3.png'
import image4 from '../../assets/placeholder/placeholder4.png'
import BarangRekomendasi from '../../components/home/BarangRekomendasi'
import { GiWeight } from "react-icons/gi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { FaCartShopping, FaStar } from "react-icons/fa6";


function DetailBarang() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <Box >
            <VStack align={"start"} ml={10} mt={3} mb={3}>
                <HStack gapX={30}>
                    <VStack align={"start"}>
                        <Text fontWeight={"bold"} fontSize={"4xl"}>SEMEN GRESIK</Text>
                        <HStack>
                            <Rating readOnly defaultValue={4} colorPalette={'yellow'} />
                            <Text fontWeight={'bold'}>
                                (4.5)
                            </Text>
                            <Text fontWeight={'normal'}>
                                225
                            </Text>
                            <Text>
                                reviews
                            </Text>
                            <Text fontWeight={'normal'}>
                                2090
                            </Text>
                            <Text>
                                Terjual
                            </Text>
                        </HStack>
                        <Box>
                            <Text fontWeight={'bold'} fontSize={'xl'}>
                                Rp. 57.000
                            </Text>
                        </Box>
                        <Box bg="bg" shadow="md" borderRadius="md" pl={120} pr={120}>
                            <VStack>
                                <HStack>
                                    <RiDiscountPercentFill />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Discount
                                    </Text>
                                </HStack>
                                <Separator />
                                <HStack>
                                    <FaCartShopping />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Stok
                                    </Text>
                                </HStack>
                                <Separator />
                                <HStack>
                                    <GiWeight />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Berat
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <Box bg="bg" shadow="md" borderRadius="md" pl={78} pr={78}>
                            <VStack>
                                <HStack>
                                    <RiDiscountPercentFill />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Discount
                                    </Text>
                                </HStack>
                                <Separator />
                                <HStack>
                                    <FaCartShopping />
                                    <Text fontWeight={'normal'} pt={5} pb={5}>
                                        Stok
                                    </Text>
                                </HStack>
                                <Separator />
                                <Button borderRadius={15} alignSelf={'center'} mb={3}>
                                    Tambah Ke Keranjang
                                </Button>
                            </VStack>
                        </Box>
                        <Button alignSelf={'center'} bg="bg" shadow="md" borderRadius="md" pl={87} pr={87} color={'black'} pb={16} pt={16} mt={5}>
                            <FaStar />
                            Lihat Semua Rating
                        </Button>
                    </VStack>
                    <VStack align={'center'} bg="bg" shadow="md" mr={2} borderRadius={15}>
                        <Image
                            src={mainImage}
                            alt='main image'
                            aspectRatio={4 / 3}
                            width={"50%"}
                            mt={10}
                            borderRadius={10}
                        />
                        <HStack gapX={8} align={'center'} justify={'center'} mt={5} mb={10}>
                            <Image
                                src={image2}
                                alt='image 2'
                                aspectRatio={1 / 1}
                                width={"15%"}
                                borderRadius={10}
                            />
                            <Image
                                src={image3}
                                alt='image 2'
                                aspectRatio={1 / 1}
                                width={"15%"}
                                borderRadius={10}
                            />
                            <Image
                                src={image4}
                                alt='image 2'
                                aspectRatio={1 / 1}
                                width={"15%"}
                                borderRadius={10}
                            />
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
            <HStack>
                <VStack>
                    <Text textStyle={'2xl'} alignSelf={'flex-start'} fontWeight={'bold'} mt={10} ml={5} mb={10}>
                        BEBERAPA BAHAN LAIN
                    </Text>
                    <HStack pl={5} mb={5}>
                        <BarangRekomendasi />
                    </HStack>
                </VStack>
            </HStack>

        </Box>

    )
}

export default DetailBarang