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
        <Box>
            <VStack align={"start"}>
                <HStack gapX={10}>
                    <LuMapPin size={40} />
                    <Text fontWeight={"bold"} fontSize={"4xl"}>
                        INFORMASI PRIBADI
                    </Text>
                </HStack>
                <HStack mt={10} pl={10} pr={10} gapX={20}>
                    <Avatar
                        name={profile?.nama || defaultProfile.nama}
                        src='https://bit.ly/broken-link'
                        colorPalette={"teal"}
                        size={"2xl"}
                    />
                    <Text fontWeight={"bold"} fontSize={"2xl"}>
                        {profile?.nama || defaultProfile.nama}
                    </Text>
                    <Tooltip content={"Edit"}>
                        <IconButton aria-label="Edit Profile" rounded="full">
                            <MdEdit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content={"Create"}>
                        <IconButton aria-label="Create Profile" rounded="full">
                            <MdEdit />
                        </IconButton>
                    </Tooltip>
                </HStack>
            </VStack>
            <VStack mt={10} align={"start"} gapY={5}>
                <Field label="Email" maxW={"40%"}>
                    <Input placeholder='me@example.com' value={email?.email} readOnly />
                </Field>
                <Field label="Nama" maxW={"40%"}>
                    <Input placeholder={defaultProfile.nama} value={profile?.nama || defaultProfile.nama} readOnly />
                </Field>
                <Field label="Nomor Telefon" maxW={"40%"}>
                    <Input placeholder={defaultProfile.nomorhp} value={profile?.nomorhp || defaultProfile.nomorhp} readOnly />
                </Field>
                <Field label="Jenis Kelamin" maxW={"40%"}>
                    <Input placeholder={defaultProfile.jeniskelamin} value={profile?.jeniskelamin || defaultProfile.jeniskelamin} readOnly />
                </Field>
            </VStack>
        </Box>
    );
}

export default SidebarProfile;
