import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { LuMapPin } from "react-icons/lu";
import { Avatar } from '../../../components/ui/avatar';
import { Field } from '../../../components/ui/field';
import { NativeSelectField, NativeSelectRoot } from '../../../components/ui/native-select';

function SidebarProfile() {
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
                        name='Mewing ohio'
                        src='https://bit.ly/broken-link'
                        colorPalette={"teal"}
                        size={"2xl"}
                    />
                    <Text fontWeight={"bold"} fontSize={"2xl"}>
                        Mewing Ohio
                    </Text>
                </HStack>
            </VStack>
            <VStack mt={10} align={"start"} gapY={5}>
                <Field label="Email" maxW={"40%"} invalid errorText="Invalid email">
                    <Input placeholder='me@example.com' />
                </Field>
                <Field label="Password" maxW={"40%"} >
                    <Input placeholder='me@example.com' />
                </Field>
                <Field label="Nomor Telefon" maxW={"40%"} >
                    <Input placeholder='me@example.com' />
                </Field>
                <Field label="Jenis Kelamin" maxW={"40%"} >
                    <NativeSelectRoot>
                        <NativeSelectField items={["Pria", "Perempuan"]} />
                    </NativeSelectRoot>
                </Field>
            </VStack>
        </Box>
    )
}

export default SidebarProfile