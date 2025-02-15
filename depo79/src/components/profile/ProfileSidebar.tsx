import { HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { Link } from 'react-router-dom';

function ProfileSidebar() {
    const [selected, setSelected] = useState("profile-sidebar");

    const handleSelect = (key: string) => {
        setSelected(key);
    };

    return (
        <VStack align="stretch" h={"100%"}>
            <Text fontWeight="bold" fontSize={["md", "xs", "xl"]} color={"black"}>
                Settings
            </Text>
            <HStack
                onClick={() => handleSelect("profile-sidebar")}
                cursor="pointer"
                color={selected === "profile-sidebar" ? "black" : "gray.500"}
                fontSize={["sm", "md", "md"]}
            >
                <IoPersonOutline size={20} />
                <Link to="profile-sidebar">
                    <Text
                        fontWeight={selected === "profile-sidebar" ? "bold" : "normal"}
                        fontSize={["2xs", "xs", "md"]} color={"black"}
                    >
                        Informasi Pribadi
                    </Text>
                </Link>
            </HStack>
            <HStack
                onClick={() => handleSelect("alamat-sidebar")}
                cursor="pointer"
                color={selected === "alamat-sidebar" ? "black" : "gray.500"}
                fontSize={["2xs", "md", "md"]}
            >
                <LuMapPin size={20} />
                <Link to="alamat-sidebar">
                    <Text
                        fontWeight={selected === "alamat-sidebar" ? "bold" : "normal"}
                        fontSize={["2xs", "xs", "md"]}
                    >
                        Informasi Alamat
                    </Text>
                </Link>
            </HStack>
        </VStack>
    );
}

export default ProfileSidebar;