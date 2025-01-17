import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { IoPersonOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { Link } from 'react-router-dom';

function ProfileSidebar() {
    return (
        <Box boxShadow={"0px 8px 20px 8px rgba(0, 0, 0, 0.2)"} maxW={"20%"} maxH={"90%"} bg={'white'} borderRadius={'10px'} pb={200} pt={200} mb={10} mt={10}>
            <VStack>
                <Box>
                    <Text fontWeight={'bold'} fontSize={"l"}>
                        Settings
                    </Text>
                    <Box mt={5}>
                        <HStack>
                            <IoPersonOutline />
                            <Link to={'/profile'}>
                                <Text>Profile</Text>
                            </Link>
                        </HStack>
                    </Box>
                    <Box mt={5}>
                        <HStack>
                            <LuMapPin />
                            <Link to={'/profile'}>
                                <Text>Alamat</Text>
                            </Link>
                        </HStack>
                    </Box>
                </Box>
            </VStack>
        </Box>
    )
}

export default ProfileSidebar