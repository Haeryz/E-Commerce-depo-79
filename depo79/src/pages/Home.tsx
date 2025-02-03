import { Box, Image, Separator, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Banner from "../assets/Intersect.png";
import BarangBaru from "../components/home/BarangBaru";
import BarangRekomendasi from "../components/home/BarangRekomendasi";
import ReviewScroll from "../components/home/ReviewScroll";

const Home: React.FC = () => {

  return (
    <VStack mt={7} overflow={"hidden"} px={{ base: 4, md: 0 }}>
      <Box>
        <Image 
        src={Banner}
        alt="Banner"
        />
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
