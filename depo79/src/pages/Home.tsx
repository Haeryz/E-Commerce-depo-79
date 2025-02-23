import { Alert, AlertTitle, AlertDescription, Box, Image, Separator, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Banner2 from "../assets/image 2.png";
import BarangBaru from "../components/home/BarangBaru";
import BarangRekomendasi from "../components/home/BarangRekomendasi";
import ReviewScroll from "../components/home/ReviewScroll";

const Home: React.FC = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Add your profile check logic here
  useEffect(() => {
    // Replace this with your actual profile check logic
    const checkProfile = () => {
      const userProfile = localStorage.getItem('userProfile');
      setIsProfileComplete(!!userProfile);
    };
    
    checkProfile();
  }, []);

  return (
    <VStack mt={7} overflow={"hidden"} px={{ base: 4, md: 0 }}>
      {!isProfileComplete && (
        <Box
          position="fixed"
          bottom="4"
          right="4"
          zIndex="toast"
        >
          <Alert.Root 
            status='warning'
            variant='solid'
            borderRadius='md'
            w={{ base: "300px", md: "350px" }}
            boxShadow="lg"
          >
            <Box p={3}>
              <AlertTitle>Profile Incomplete!</AlertTitle>
              <AlertDescription>
                Please complete your profile to get the best experience.
              </AlertDescription>
            </Box>
          </Alert.Root>
        </Box>
      )}
      
      <Box 
        w={{ base: "100%", md: "95%" }} 
        h={{ base: "30vh", md: "70vh", lg: "85vh" }} 
        position="relative"
        overflow="hidden"
        borderRadius={{ base: "20px", md: "30px" }}
        boxShadow="lg"
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
