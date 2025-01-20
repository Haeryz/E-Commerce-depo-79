"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role] = useState<'customer' | 'admin'>("customer");
    const [otpRequired, setOtpRequired] = useState<boolean>(false);
    const [emailForOtp, setEmailForOtp] = useState<string>("");

    const registerUser = useAuthStore((state) => state.registerUser);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const result = await registerUser(name, email, password, role);
            if (result.otpRequired) {
                setOtpRequired(true);
                setEmailForOtp(result.email);
                // Navigate to OTP verification page after registration
                navigate(`/verify-otp?email=${encodeURIComponent(result.email)}`);
            } else {
                alert("Registration failed.");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Box
            mt={135}
            mb={232}
            w="md"
            mx="auto"
            p={6}
            borderWidth={2}
            borderRadius="30px"
            border="1px solid #000"
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
        >
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Register
            </Text>

            {!otpRequired ? (
                <form onSubmit={handleSubmit}>
                    <Stack gap="4" align="flex-start">
                        <Field label="Username">
                            <Input
                                value={name}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                placeholder="Enter username"
                                borderRadius="30px"
                                padding="8px 16px"
                            />
                        </Field>
                        <Field label="Email">
                            <Input
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                borderRadius="30px"
                                padding="8px 16px"
                            />
                        </Field>
                        <Field label="Password">
                            <PasswordInput
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                borderRadius="30px"
                                padding="8px 16px"
                            />
                        </Field>
                        <Field label="Re-entry Password">
                            <PasswordInput
                                value={confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                placeholder="Re-entry password"
                                borderRadius="30px"
                                padding="8px 16px"
                            />
                        </Field>

                        <Box display="flex" justifyContent="center" width="full">
                            <Button type="submit" colorScheme="blue" width="auto" borderRadius="50px" pl={10} pr={10}>
                                Register
                            </Button>
                        </Box>
                    </Stack>
                </form>
            ) : (
                <Text textAlign="center">
                    Check your email for the OTP and enter it below:
                </Text>
            )}
        </Box>
    );
};

export default Register;
