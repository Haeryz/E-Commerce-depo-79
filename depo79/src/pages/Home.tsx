import { Box, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Banner from "../assets/Intersect.png";
import BarangBaru from "../components/home/BarangBaru";

const Home: React.FC = () => {

  return (
    <VStack mt={7}>
      <Box>
        <Image 
        src={Banner}
        />
      </Box>

      <Box justifyItems={"center"}>
        <Text fontWeight={"bold"} fontSize={60} mt={10}>
          BAHAN BARU
        </Text>

        <Text color={"gray.500"}>
          Bahan Bangunan Terbaru. Dapatkan Untuk Rumahmu
        </Text>

        <Text color={"gray.500"}>
          Sekarang Juga
        </Text>
      </Box>

      <Box justifyItems={"center"} mt={10}>
        <BarangBaru />
      </Box>
    </VStack>
  );
};

export default Home;
