import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { LuMapPin } from 'react-icons/lu'
import { Field } from '../../../components/ui/field'
import { NativeSelectField, NativeSelectRoot } from '../../../components/ui/native-select'

function SidebarAlamat() {
    return (
        <Box >
            <VStack align={"start"}>
                <HStack gapX={10}>
                    <LuMapPin size={40} />
                    <Text fontWeight={"bold"} fontSize={"4xl"}>
                        INFORMASI ALAMAT
                    </Text>
                </HStack>
                <VStack mt={10} align={"start"} gapY={3} w={"40%"}>
                    <Field label="Alamat lengkap" maxW={"100%"}>
                        <Input placeholder='Jalan, No, RT/RW (deskripsi)' />
                    </Field>
                    <Field label="Nomor Telefon">
                        <NativeSelectRoot>
                            <NativeSelectField items={["Pria", "Perempuan"]} />
                        </NativeSelectRoot>
                    </Field>
                    <Field label="Nomor Telefon">
                        <NativeSelectRoot>
                            <NativeSelectField items={["Pria", "Perempuan"]} />
                        </NativeSelectRoot>
                    </Field>
                    <Field label="Nomor Telefon" >
                        <NativeSelectRoot>
                            <NativeSelectField items={["Pria", "Perempuan"]} />
                        </NativeSelectRoot>
                    </Field>
                    <Field label="Nomor Telefon" >
                        <NativeSelectRoot>
                            <NativeSelectField items={["Pria", "Perempuan"]} />
                        </NativeSelectRoot>
                    </Field>
                    <Field label="Alamat lengkap">
                        <Input placeholder='Jalan, No, RT/RW (deskripsi)' />
                    </Field>
                </VStack>
            </VStack>
        </Box>
    )
}

export default SidebarAlamat