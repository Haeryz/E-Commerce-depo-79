import { Box, HStack, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { LuMapPin } from "react-icons/lu";
import { Avatar } from '../../../components/ui/avatar';
import { Field } from '../../../components/ui/field';
import { Tooltip } from '../../../components/ui/tooltip';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '../../../store/auth';
import { useProfileStore } from '../../../store/profile';

function SidebarProfile() {
    const email = useAuthStore((state) => state.user);
    const profile = useProfileStore((state) => state.profile);
    const fetchProfile = useProfileStore((state) => state.fetchProfile);

    // Fetch the user profile on component mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Placeholder values
    const defaultProfile = {
        nama: "Rusdi",
        nomorhp: "+628123456789",
        jeniskelamin: "Pria",
    };

    return (
        <Box px={[4, 6, 10]} py={5}> {/* Responsive padding */}
            <VStack align={"start"}>
                <HStack gapX={4} wrap="wrap"> {/* Wrap for responsive layout */}
                    <LuMapPin size={40} />
                    <Text fontWeight={"bold"} fontSize={["2xl", "3xl", "4xl"]}> {/* Responsive font sizes */}
                        INFORMASI PRIBADI
                    </Text>
                </HStack>
                <HStack
                    mt={10}
                    px={[4, 6, 10]} /* Responsive padding */
                    gapX={[4, 10, 20]} /* Adjust spacing based on screen size */
                    wrap="wrap" /* Allow wrapping for smaller screens */
                    justify={["center", "start"]} /* Center items on small screens */
                >
                    <Avatar
                        name={profile?.nama || defaultProfile.nama}
                        src="https://bit.ly/broken-link"
                        colorPalette={"teal"}
                        size={["lg", "xl", "2xl"]} /* Responsive avatar size */
                    />
                    <Text fontWeight={"bold"} fontSize={["lg", "xl", "2xl"]}> {/* Responsive font sizes */}
                        {profile?.nama || defaultProfile.nama}
                    </Text>
                    <Tooltip content={"Edit"}>
                        <IconButton
                            aria-label="Edit Profile"
                            rounded="full"
                            size={["sm", "md"]}
                        >
                            <MdEdit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content={"Create"}>
                        <IconButton
                            aria-label="Create Profile"
                            rounded="full"
                            size={["sm", "md"]}
                        >
                            <MdEdit />
                        </IconButton>
                    </Tooltip>
                </HStack>
            </VStack>
            <VStack mt={10} align={"start"} >
                <Field label="Email" maxW={["100%", "70%", "40%"]}> {/* Adjust max width based on screen size */}
                    <Input placeholder="me@example.com" value={email?.email} readOnly />
                </Field>
                <Field label="Nama" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder={defaultProfile.nama} value={profile?.nama || defaultProfile.nama} readOnly />
                </Field>
                <Field label="Nomor Telefon" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder={defaultProfile.nomorhp} value={profile?.nomorhp || defaultProfile.nomorhp} readOnly />
                </Field>
                <Field label="Jenis Kelamin" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder={defaultProfile.jeniskelamin} value={profile?.jeniskelamin || defaultProfile.jeniskelamin} readOnly />
                </Field>
            </VStack>
        </Box>
    );
}

export default SidebarProfile;
