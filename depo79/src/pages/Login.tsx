"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const loginUser = useAuthStore((state) => state.loginUser); // Get the loginUser action

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await loginUser(email, password); // Call the loginUser action from the store
    };

    return (
        <Box mt={20} maxW="sm" mx="auto" p={4} borderWidth={1} borderRadius="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Login
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack gap="4" align="flex-start">
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
                    </Field>

                    <Button type="submit" colorScheme="blue" width="full">
                        Submit
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default Login;
