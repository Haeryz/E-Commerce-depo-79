"use client";

import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Field } from "../components/ui/field";
import { PasswordInput } from "../components/ui/password-input";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { useColorModeValue } from "../components/ui/color-mode";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const loginUser = useAuthStore((state) => state.loginUser); // Get the loginUser action
    const navigate = useNavigate(); // Initialize the useNavigate hook

    // Dynamically set background color and text color based on the color mode
    const bgColor = useColorModeValue("gray.100", "gray.800"); // Light and dark mode bg
    const textColor = useColorModeValue("black", "white"); // Light and dark mode text color
    const inputBgColor = useColorModeValue("gray.200", "gray.700"); // Light and dark mode input background

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Call the loginUser action from the store
            await loginUser(email, password);

            // If no errors, navigate to the home page
            navigate("/");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Box
            mt={20}
            w="md"
            mx="auto"
            p={6}
            borderWidth={2}
            borderRadius="30px"
            border="1px solid #000"
            boxShadow="0px 8px 20px 8px rgba(0, 0, 0, 0.2)"
            bg={bgColor} // Dynamically apply bgColor here
            color={textColor} // Dynamically apply textColor here
        >
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
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor={inputBgColor} // Dynamically set input background color
                        />
                    </Field>

                    <Field label="Password">
                        <PasswordInput
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            borderRadius="30px"
                            padding="8px 16px"
                            backgroundColor={inputBgColor} // Dynamically set input background color
                        />
                    </Field>

                    <Box display="flex" justifyContent="center" width="full">
                        <Button type="submit" colorScheme="blue" width="l" borderRadius="50px" pl={10} pr={10}>
                            Submit
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default Login;
