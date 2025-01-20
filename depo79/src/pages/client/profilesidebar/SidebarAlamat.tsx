import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { LuMapPin } from 'react-icons/lu'
import { Field } from '../../../components/ui/field'
import { useProfileStore } from '../../../store/profile'  

function SidebarAlamat() {
    const { profile, fetchProfile } = useProfileStore();  // Access profile and fetchProfile from store

    useEffect(() => {
        fetchProfile();  // Fetch profile data when the component mounts
    }, [fetchProfile]);

    // Ensure profile and alamat exist before trying to access them
    const alamat = profile?.alamat;

    if (!alamat) {
        return <Text>Loading alamat...</Text>;  // Display loading if alamat is not yet available
    }

    return (
        <Box>
            <VStack align={"start"}>
                <HStack gapX={10}>
                    <LuMapPin size={40} />
                    <Text fontWeight={"bold"} fontSize={"4xl"}>
                        INFORMASI ALAMAT
                    </Text>
                </HStack>
                <VStack mt={10} align={"start"} gapY={3} w={"40%"}>
                    <Field label="Provinsi" maxW={"100%"}>
                        <Input value={alamat.provinsi} readOnly={true} />
                    </Field>
                    <Field label="Kota" maxW={"100%"}>
                        <Input value={alamat.kota} readOnly={true} />
                    </Field>
                    <Field label="Kode Pos" maxW={"100%"}>
                        <Input value={alamat.kodepos} readOnly={true} />
                    </Field>
                    <Field label="Kelurahan" maxW={"100%"}>
                        <Input value={alamat.kelurahan} readOnly={true} />
                    </Field>
                    <Field label="Kecamatan" maxW={"100%"}>
                        <Input value={alamat.kecamatan} readOnly={true} />
                    </Field>
                    <Field label="Detail" maxW={"100%"}>
                        <Input value={alamat.detail} readOnly={true} />
                    </Field>
                </VStack>
            </VStack>
        </Box>
    );
}

export default SidebarAlamat;
