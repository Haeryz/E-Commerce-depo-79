import {
  Box,
  HStack,
  Input,
  Text,
  VStack,
  Button as ChakraButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Local state for form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // State for create profile form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGender, setNewGender] = useState("");

  // Fetch the user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Populate form with current profile data when dialog is opened
  // const handleDialogOpen = () => {
  //   setName(profile?.nama || "");
  //   setPhone(profile?.nomorhp || "");
  //   setGender(profile?.jeniskelamin || "");
  // };

  // Reset create form fields
  const handleCreateDialogOpen = () => {
    setNewName("");
    setNewPhone("");
    setNewGender("");
    setIsCreateDialogOpen(false);
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

    setIsDialogOpen(false);
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
    <Box px={[4, 6, 10]} py={5} width="100%">
      <VStack align="start" spacing={[4, 6, 8]}>
        {/* Header */}
        <HStack gapX={4} wrap="wrap">
          <MdPerson size={40} />
          <Text fontWeight="bold" fontSize={["xl", "2xl", "3xl"]} color="black">
            INFORMASI PRIBADI
          </Text>
        </HStack>

        {/* Avatar dan Nama */}
        <HStack
          mt={[4, 6, 8]}
          // px={[2, 4, ]}
          gapX={[4, 6, 8]}
          wrap="wrap"
          justify={["start"]}
          alignItems="center"
        >
          <Avatar
            name={profile?.nama || "Username"}
            src="https://bit.ly/broken-link"
            colorPalette="teal"
            size={["xl", "2xl", "full"]}
            width={["80px", "100px", "120px"]}
            height={["80px", "100px", "120px"]}
          />
          <Text fontWeight="bold" fontSize={["lg", "xl", "2xl"]} color="black">
            {profile?.nama || "Username"}
          </Text>
        </HStack>

        {/* Form Informasi Pribadi */}
        <VStack mt={[4, 6, 8]} align="start" width="100%">
          <Field label="Email" width="100%">
            <Input placeholder="me@example.com" value={email?.email} readOnly />
          </Field>
          <Field label="Nama" width="100%">
            <Input placeholder="Nama" value={profile?.nama} readOnly />
          </Field>
          <Field label="Nomor Telefon" width="100%">
            <Input
              placeholder="Nomor Telefon"
              value={profile?.nomorhp}
              readOnly
            />
          </Field>
          <Field label="Jenis Kelamin" width="100%">
            <Input
              placeholder="Jenis Kelamin"
              value={profile?.jeniskelamin}
              readOnly
            />
          </Field>
        </VStack>

        {/* Button Edit Profile dan Create Account */}
        <HStack spacing={4} mt={4} width={["100%", "80%", "50%"]}>
          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(details) => setIsDialogOpen(details.open)}
            role="dialog"
          >
            <DialogTrigger asChild>
              <ChakraButton
                colorScheme="blue"
                flex={1}
                size={["sm", "md", "lg"]}
                onClick={() => setIsDialogOpen(true)}
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

          <DialogRoot
            open={isCreateDialogOpen}
            onOpenChange={(details) => setIsCreateDialogOpen(details.open)}
            role="dialog"
          >
            <DialogTrigger asChild>
              <ChakraButton
                colorScheme="teal"
                flex={1}
                size={["sm", "md", "lg"]}
                onClick={() => setIsCreateDialogOpen(true)}
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
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogActionTrigger>
                <Button colorPalette="blue" onClick={handleCreate}>
                  Create Profile
                </Button>
              </DialogFooter>
              <DialogCloseTrigger  onClick={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </DialogRoot>
        </HStack>
      </VStack>
    </Box>
  );
}

export default SidebarProfile;
