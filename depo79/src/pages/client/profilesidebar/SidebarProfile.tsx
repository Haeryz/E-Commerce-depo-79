import { Box, HStack, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { LuMapPin } from "react-icons/lu";
import { Avatar } from '../../../components/ui/avatar';
import { Field } from '../../../components/ui/field';
import { Tooltip } from '../../../components/ui/tooltip';
import { MdEdit } from 'react-icons/md';
import { useAuthStore } from '../../../store/auth';
import { useProfileStore } from '../../../store/profile';
import {
    DialogActionTrigger, DialogBody, DialogCloseTrigger,
    DialogContent, DialogFooter, DialogHeader, DialogRoot,
    DialogTitle, DialogTrigger
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

function SidebarProfile() {
    const email = useAuthStore((state) => state.user);
    const profile = useProfileStore((state) => state.profile);
    const fetchProfile = useProfileStore((state) => state.fetchProfile);
    const updateProfile = useProfileStore((state) => state.updateProfile);

    // Local state for form inputs
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');

    // Fetch the user profile on component mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Populate form with current profile data when dialog is opened
    const handleDialogOpen = () => {
        setName(profile?.nama || '');
        setPhone(profile?.nomorhp || '');
        setGender(profile?.jeniskelamin || '');
    };

    // Submit updated data
    const handleUpdate = async () => {
        if (!profile) return;
        const updatedProfile = {
            ...profile,
            nama: name,
            nomorhp: phone,
            jeniskelamin: gender,
        };

        try {
            await updateProfile(updatedProfile);
            fetchProfile(); // Refresh the profile data
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Box px={[4, 6, 10]} py={5}>
            <VStack align="start">
                <HStack gapX={4} wrap="wrap">
                    <LuMapPin size={40} />
                    <Text fontWeight="bold" fontSize={["2xl", "3xl", "4xl"]}>
                        INFORMASI PRIBADI
                    </Text>
                </HStack>
                <HStack
                    mt={10}
                    px={[4, 6, 10]}
                    gapX={[4, 10, 20]}
                    wrap="wrap"
                    justify={["center", "start"]}
                >
                    <Avatar
                        name={profile?.nama || 'Rusdi'}
                        src="https://bit.ly/broken-link"
                        colorPalette="teal"
                        size={["lg", "xl", "2xl"]}
                    />
                    <Text fontWeight="bold" fontSize={["lg", "xl", "2xl"]}>
                        {profile?.nama || 'Rusdi'}
                    </Text>
                    <DialogRoot role="dialog">
                        <Tooltip content="Edit">
                            <DialogTrigger asChild onChange={handleDialogOpen}>
                                <IconButton
                                    aria-label="Edit Profile"
                                    rounded="full"
                                    size={["sm", "md"]}
                                >
                                    <MdEdit />
                                </IconButton>
                            </DialogTrigger>
                        </Tooltip>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <Field label="Name">
                                    <Input
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Field>
                                <Field label="Phone Number" mt={4}>
                                    <Input
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Field>
                                <Field label="Gender" mt={4}>
                                    <Input
                                        placeholder="Enter your gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                </Field>
                            </DialogBody>
                            <DialogFooter>
                                <DialogActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogActionTrigger>
                                <Button colorPalette="blue" onClick={handleUpdate}>
                                    Save Changes
                                </Button>
                            </DialogFooter>
                            <DialogCloseTrigger />
                        </DialogContent>
                    </DialogRoot>
                </HStack>
            </VStack>
            <VStack mt={10} align="start">
                <Field label="Email" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder="me@example.com" value={email?.email} readOnly />
                </Field>
                <Field label="Nama" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder="Rusdi" value={profile?.nama || 'Rusdi'} readOnly />
                </Field>
                <Field label="Nomor Telefon" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder="+628123456789" value={profile?.nomorhp || '+628123456789'} readOnly />
                </Field>
                <Field label="Jenis Kelamin" maxW={["100%", "70%", "40%"]}>
                    <Input placeholder="Pria" value={profile?.jeniskelamin || 'Pria'} readOnly />
                </Field>
            </VStack>
        </Box>
    );
}

export default SidebarProfile;
