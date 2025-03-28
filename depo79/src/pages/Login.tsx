"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";
import { useColorModeValue } from "../components/ui/color-mode";
import Turnstile from "react-turnstile";
import { toaster } from "../components/ui/toaster";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const loginUser = useAuthStore((state) => state.loginUser); // Get the loginUser action
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const bgColor = useColorModeValue("gray.100", "gray.800"); // Light and dark mode bg
    const textColor = useColorModeValue("black", "white"); // Light and dark mode text color
    const inputBgColor = useColorModeValue("gray.200", "gray.700"); // Light and dark mode input background

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!turnstileToken) {
            toaster.create({ title: "Turnstile token is required", type: "error" });
            return;
        }

        try {
            const result = await loginUser(email, password, turnstileToken);
            
            if (result.success) {
                // Show success toast
                toaster.create({ 
                    title: "Login Successful", 
                    type: "success",
                });
                
                if (result.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }    
            }
        } catch (error) {
            toaster.create({ title: error as string, type: "error" });
        }
    };

    return (
        <Box
            mt={{ base: "4", md: "185px" }}
            mb={{ base: "4", md: "500px" }}
            mx="auto"
            width={{ base: "90%", sm: "80%", md: "60%", lg: "40%" }}
            maxWidth="500px"
            p={{ base: 4, md: 6 }}
            borderWidth={2}
            borderRadius="30px"
            border="1px solid #000"
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
            bg={bgColor}
            color={textColor}
        >
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                Login
            </Text>

            <form onSubmit={handleSubmit}>
                <Stack gap="4" align="flex-start">
                    <Field label="Email">
                        <Input
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value.replace(/\s/g, ""))
                            }
                            placeholder="Enter Email"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor={inputBgColor}
                            _selection={{
                                backgroundColor: "#2563eb",
                                color: "white",
                            }}
                        />
                    </Field>

                    <Field label="Password">
                        <PasswordInput
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor={inputBgColor}
                            _selection={{
                                backgroundColor: "#2563eb",
                                color: "white",
                            }}
                        />
                    </Field>

                    <Box display="flex" justifyContent="center" width="100%">
                        <Turnstile
                            sitekey="0x4AAAAAAA5XlhkyPKe_seiW"
                            onSuccess={(token) => setTurnstileToken(token)}
                        />
                    </Box>

                    <Box display="flex" justifyContent="center" width="full">
                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="l"
                            borderRadius="50px"
                            pl={10}
                            pr={10}
                        >
                            Submit
                        </Button>
                    </Box>

                    <Box display="flex" justifyContent="center" width="full">
                        <Text>
                            Belum memiliki akun ? Registrasi{" "}
                            <Link to="/register">
                                <Text as="span" color="blue.500" cursor="pointer">
                                    disini
                                </Text>
                            </Link>
                        </Text>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default Login;
