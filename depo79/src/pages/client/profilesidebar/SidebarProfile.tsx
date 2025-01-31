import { Box, HStack, Input, Text, VStack, Button as ChakraButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md"; // Ganti dengan ikon person
import { Avatar } from "../../../components/ui/avatar";
import { Field } from "../../../components/ui/field";
import { useAuthStore } from "../../../store/auth";
import { useProfileStore } from "../../../store/profile";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

function SidebarProfile() {
  const email = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const createProfile = useProfileStore((state) => state.createProfile);

  // Local state for form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // State for create profile form
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGender, setNewGender] = useState("");

  // Fetch the user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Populate form with current profile data when dialog is opened
  const handleDialogOpen = () => {
    setName(profile?.nama || "");
    setPhone(profile?.nomorhp || "");
    setGender(profile?.jeniskelamin || "");
  };

  // Reset create form fields
  const handleCreateDialogOpen = () => {
    setNewName("");
    setNewPhone("");
    setNewGender("");
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

  // Handle create profile submission
  const handleCreate = async () => {
    const newProfile = {
      nama: newName,
      nomorhp: newPhone,
      jeniskelamin: newGender,
    };

    try {
      await createProfile(newProfile);
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <Box px={[4, 6, 10]} py={5}>
      <VStack align="start" height={"100%"}>
        <HStack gapX={4} wrap="wrap">
          <MdPerson size={40} /> {/* Ganti dengan ikon person */}
          <Text fontWeight="bold" fontSize={["2xl", "3xl", "4xl"]} color={"black"}>
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
            name={profile?.nama || "Rusdi"}
            src="https://bit.ly/broken-link"
            colorPalette="teal"
            size={["2xl", "2xl", "full"]}
            width={["100px", "100px", "100px"]}
            height={["100px", "100px", "100px"]}
          />
          <Text fontWeight="bold" fontSize={["lg", "xl", "2xl"]} color={"black"}>
            {profile?.nama || "Rusdaaaaaaai"}
          </Text>
        </HStack>
      </VStack>
      <VStack mt={10} align="start">
        <Field label="Email" maxW={["100%", "70%", "100%"]}>
          <Input placeholder="me@example.com" value={email?.email} readOnly />
        </Field>
        <Field label="Nama" maxW={["100%", "70%", "100%"]}>
          <Input placeholder="Nama" value={profile?.nama} readOnly />
        </Field>
        <Field label="Nomor Telefon" maxW={["100%", "70%", "100%"]}>
          <Input placeholder="Nomor Telefon" value={profile?.nomorhp} readOnly />
        </Field>
        <Field label="Jenis Kelamin" maxW={["100%", "70%", "100%"]}>
          <Input placeholder="Jenis Kelamin" value={profile?.jeniskelamin} readOnly />
        </Field>

        {/* Button Edit Profile dan Create Account */}
        <HStack spacing={4} mt={4} width="30%">
          <DialogRoot role="dialog">
            <DialogTrigger asChild>
              <ChakraButton
                colorScheme="blue"
                flex={1} // Membagi ruang secara merata
                onClick={handleDialogOpen}
              >
                Edit Profile
              </ChakraButton>
            </DialogTrigger>
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

          <DialogRoot role="dialog">
            <DialogTrigger asChild>
              <ChakraButton
                colorScheme="teal"
                flex={1} // Membagi ruang secara merata
                onClick={handleCreateDialogOpen}
              >
                Create Account
              </ChakraButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Profile</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <Field label="Name">
                  <Input
                    placeholder="Enter your name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </Field>
                <Field label="Phone Number" mt={4}>
                  <Input
                    placeholder="Enter your phone number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </Field>
                <Field label="Gender" mt={4}>
                  <Input
                    placeholder="Enter your gender"
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                  />
                </Field>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button colorPalette="blue" onClick={handleCreate}>
                  Create Profile
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </HStack>
      </VStack>
    </Box>
  );
}

export default SidebarProfile;