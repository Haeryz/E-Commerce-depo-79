"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput, PasswordStrengthMeter } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";

const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<'customer' | 'admin'>("customer");

    const registerUser = useAuthStore((state) => state.registerUser);  

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await registerUser(name, email, password, role);  
    };

    return (
        <Box mt={20} maxW="sm" mx="auto" p={4} borderWidth={1} borderRadius="md">
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
                        />
                    </Field>

                    <Field label="Email">
                        <Input
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                    </Field>

                    <Field label="Password">
                        <PasswordInput
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                        <PasswordStrengthMeter value={2} />
                    </Field>

                    <Button type="submit" colorScheme="blue" width="full">
                        Submit
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default Register;