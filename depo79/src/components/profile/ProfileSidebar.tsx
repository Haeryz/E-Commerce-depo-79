import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { Link } from 'react-router-dom';

function ProfileSidebar() {
    return (
        <VStack
            align="stretch"
            minH="70vh" 
        >
            <Text fontWeight="bold" fontSize="xl">
                Settings
            </Text>
            <HStack>
                <IoPersonOutline />
                <Link to="profile-sidebar">
                    <Text>Informasi Pribadi</Text>
                </Link>
            </HStack>
            <HStack>
                <LuMapPin />
                <Link to="alamat-sidebar">
                    <Text>Informasi Alamat</Text>
                </Link>
            </HStack>
        </VStack>
    );
}

export default ProfileSidebar;
