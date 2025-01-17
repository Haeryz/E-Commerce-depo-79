import { HStack, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { Link } from 'react-router-dom';

function ProfileSidebar() {
    const [selected, setSelected] = useState("profile-sidebar");

    const handleSelect = (key) => {
        setSelected(key);
    };

    return (
        <VStack align="stretch" minH="70vh">
            <Text fontWeight="bold" fontSize="xl">
                Settings
            </Text>
            <HStack
                onClick={() => handleSelect("profile-sidebar")}
                cursor="pointer"
                color={selected === "profile-sidebar" ? "black" : "gray.500"}
            >
                <IoPersonOutline />
                <Link to="profile-sidebar">
                    <Text
                        fontWeight={selected === "profile-sidebar" ? "bold" : "normal"}
                    >
                        Informasi Pribadi
                    </Text>
                </Link>
            </HStack>
            <HStack
                onClick={() => handleSelect("alamat-sidebar")}
                cursor="pointer"
                color={selected === "alamat-sidebar" ? "black" : "gray.500"}
            >
                <LuMapPin />
                <Link to="alamat-sidebar">
                    <Text
                        fontWeight={selected === "alamat-sidebar" ? "bold" : "normal"}
                    >
                        Informasi Alamat
                    </Text>
                </Link>
            </HStack>
        </VStack>
    );
}

export default ProfileSidebar;
