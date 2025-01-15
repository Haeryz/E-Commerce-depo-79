"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>(""); // For re-entry password
    const [role] = useState<'customer' | 'admin'>("customer");  // Role is fixed here, no need for setRole

    const registerUser = useAuthStore((state) => state.registerUser);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if the passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        await registerUser(name, email, password, role); // Send the real password
    };

    return (
        <Box mt={20} w="md" mx="auto" p={6} borderWidth={2} borderRadius="30px" border="1px solid #000" boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Register
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack gap="4" align="flex-start">
                    <Field label="Username">
                        <Input
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder="Enter username"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor="#D9D9D9"
                        />
                    </Field>

                    <Field label="Email">
                        <Input
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor="#D9D9D9"
                        />
                    </Field>

                    <Field label="Password">
                        <PasswordInput
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor="#D9D9D9"
                        />
                    </Field>

                    <Field label="Re-entry Password">
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            placeholder="Re-entry password"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor="#D9D9D9"
                        />
                    </Field>

                    <Box display="flex" justifyContent="center" width="full">
                        <Text>
                            Sudah Punya Akun ? Login{" "}
                            <Link to="/login">
                                <Text as="span" color="blue.500" cursor="pointer">
                                    Disini
                                </Text>
                            </Link>
                        </Text>
                    </Box>

                    <Box display="flex" justifyContent="center" width="full">
                        <Button type="submit" colorScheme="blue" width="auto" borderRadius="50px" pl={10} pr={10}>
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default Register;
