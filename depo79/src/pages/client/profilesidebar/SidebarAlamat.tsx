import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { LuMapPin } from 'react-icons/lu'
import { Field } from '../../../components/ui/field'
import { useProfileStore } from '../../../store/profile'

function SidebarAlamat() {
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const alamat = profile?.alamat;

    if (!alamat) {
        return <Text>Loading alamat...</Text>;
    }

    return (
        <Box p={[4, 6, 8]}>
            <VStack align="start" gap={[4, 6, 8]} w="100%">
                <HStack gap={[3, 4, 6]} wrap="wrap">
                    <LuMapPin size={40} />
                    <Text fontWeight="bold" fontSize={["2xl", "3xl", "4xl"]}>
                        INFORMASI ALAMAT
                    </Text>
                </HStack>
                <VStack 
                    mt={[6, 8, 10]} 
                    align="start" 
                    gap={[3, 4]} 
                    w={["100%", "80%", "40%"]}
                >
                    <Field label="Provinsi" maxW="100%">
                        <Input value={alamat.provinsi} readOnly={true} size={["sm", "md"]} />
                    </Field>
                    <Field label="Kota" maxW="100%">
                        <Input value={alamat.kota} readOnly={true} size={["sm", "md"]} />
                    </Field>
                    <Field label="Kode Pos" maxW="100%">
                        <Input value={alamat.kodepos} readOnly={true} size={["sm", "md"]} />
                    </Field>
                    <Field label="Kelurahan" maxW="100%">
                        <Input value={alamat.kelurahan} readOnly={true} size={["sm", "md"]} />
                    </Field>
                    <Field label="Kecamatan" maxW="100%">
                        <Input value={alamat.kecamatan} readOnly={true} size={["sm", "md"]} />
                    </Field>
                    <Field label="Detail" maxW="100%">
                        <Input value={alamat.detail} readOnly={true} size={["sm", "md"]} />
                    </Field>
                </VStack>
            </VStack>
        </Box>
    );
}

export default SidebarAlamat;