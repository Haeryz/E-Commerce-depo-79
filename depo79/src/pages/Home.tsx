import { Box, Image, Separator, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FaChevronRight, FaChevronLeft} from "react-icons/fa";
import Banner from "../assets/Intersect.png";
import Banner2 from "../assets/image 2.png";
import BarangBaru from "../components/home/BarangBaru";
import BarangRekomendasi from "../components/home/BarangRekomendasi";
import ReviewScroll from "../components/home/ReviewScroll";

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const totalImages = 2;

  const scroll = (direction: 'left' | 'right') => {
    setSlideDirection(direction === 'left' ? -1 : 1);
    
    if (direction === 'left') {
      setCurrentIndex(prev => (prev === 0 ? totalImages - 1 : prev - 1));
    } else {
      setCurrentIndex(prev => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  return (
    <VStack mt={7} overflow={"hidden"} px={{ base: 4, md: 0 }}>
      <Box 
        w={{ base: "100%", md: "95%" }} 
        h={{ base: "30vh", md: "70vh", lg: "85vh" }} 
        position="relative"
        overflow="hidden"
        borderRadius={{ base: "20px", md: "30px" }}
        boxShadow="lg"
      >
        <IconButton
          aria-label="Scroll left"
          position="absolute"
          left={{ base: 0, md: 2 }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => scroll('left')}
          colorScheme="blackAlpha"
          rounded="full"
          size={{ base: "sm", md: "md" }}
          disabled={false} // Remove disable condition to allow continuous scrolling
        >
          <FaChevronLeft />
        </IconButton>
        <IconButton
          aria-label="Scroll right"
          position="absolute"
          right={{ base: 0, md: 2 }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          onClick={() => scroll('right')}
          colorScheme="blackAlpha"
          rounded="full"
          size={{ base: "sm", md: "md" }}
          disabled={false} // Remove disable condition to allow continuous scrolling
        >
          <FaChevronRight />
        </IconButton>
        <Box 
          w="100%" 
          h="100%"
          position="relative"
          overflow="hidden"
          borderRadius="inherit"
        >
          <HStack 
            gap={0}
            position="absolute"
            height="100%"
            width={`${totalImages * 100}%`}
            transform={`translateX(${-currentIndex * (100 / totalImages)}%)`}
            transition={`transform 0.5s ${slideDirection === 1 ? 'ease-in-out' : 'ease-in-out'}`}
          >
            <Box 
              w={`${100 / totalImages}%`}
              h="100%"
              borderRadius="inherit"
              overflow="hidden"
            >
              <Image 
                src={Banner}
                alt="Banner"
                objectFit="cover"
                h="100%"
                w="100%"
                transition="transform 0.5s ease"
                _hover={{
                  transform: "scale(1.02)"
                }}
              />
            </Box>
            <Box 
              w={`${100 / totalImages}%`}
              h="100%"
              borderRadius="inherit"
              overflow="hidden"
            >
              <Image 
                src={Banner2}
                alt="Banner 2"
                objectFit="cover"
                h="100%"
                w="100%"
                transition="transform 0.5s ease"
                _hover={{
                  transform: "scale(1.02)"
                }}
              />
            </Box>
          </HStack>
        </Box>
      </Box>

      <Box justifyItems={"center"} textAlign="center">
        <Text fontWeight={"bold"} fontSize={{ base: "3xl", md: 60 }} mt={10}>
          BAHAN BARU
        </Text>

        <Text color={"gray.500"}>
          Bahan Bangunan Terbaru. Dapatkan Untuk Rumahmu
        </Text>

        <Text color={"gray.500"}>
          Sekarang Juga
        </Text>
      </Box>

      <Box justifyItems={"center"} mt={10} w="full">
        <BarangBaru />
      </Box>

      <Separator variant={"solid"} size={"xs"} mb={5} mt={5} borderColor={"gray.500"}/>

      <Box justifyItems={"center"} textAlign="center">
        <Text fontWeight={"bold"} fontSize={{ base: "3xl", md: 60 }} mt={10}>
          BAHAN REKOMENDASI
        </Text>

        <Text color={"gray.500"}>
          Bahan Bangunan Terbaru. Dapatkan Untuk Rumahmu
        </Text>

        <Text color={"gray.500"}>
          Sekarang Juga
        </Text>
      </Box>

      <Box justifyItems={"center"} mt={10} w="full">
        <BarangRekomendasi />
      </Box>

      <Box justifyItems={"center"} mt={10} w="full">
        <ReviewScroll />
      </Box>
    </VStack>
  );
};

export default Home;
