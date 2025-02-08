import { Box, Button, Input, Stack, Text } from '@chakra-ui/react';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Importing useNavigate and useLocation for navigation
import { useAuthStore } from '../../store/auth';  // Importing auth store

const OtpForm: React.FC = () => {
    const [otp, setOtp] = useState<string>(''); // State for OTP input
    const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false); // Flag to indicate OTP verification process
    const [email, setEmail] = useState<string>(''); // State to store email

    const navigate = useNavigate();  // For navigation after OTP verification
    const location = useLocation();  // To access the query parameters

    const verifyOtp = useAuthStore((state) => state.verifyOtp); // Assuming verifyOtp function is in your store

    // Extract email from the query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailFromQuery = queryParams.get('email');
        if (emailFromQuery) {
            setEmail(emailFromQuery); // Set the email from query params
        } else {
            alert("Email is required for OTP verification.");
        }
    }, [location]);

    const handleVerifyOtp = async () => {
        setIsVerifyingOtp(true);
        try {
            if (!email || !otp) {
                alert("Please provide both email and OTP.");
                return;
            }
            const { success, error } = await verifyOtp(email, otp); // Verifying OTP with backend
            if (success) {
                alert("OTP verified successfully! Your account is now activated.");
                navigate('/login');  // Redirect to login page after successful OTP verification
            } else {
                alert(`OTP verification failed. ${error || "Please try again."}`);
            }
        } catch (error) {
            console.error("OTP verification failed:", error);
            alert("An error occurred while verifying OTP.");
        } finally {
            setIsVerifyingOtp(false);
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
                OTP Verification
            </Text>

            <Stack gap="4" align="flex-start">
                <Input
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    borderRadius="30px"
                    padding="8px 16px"
                />

                <Box display="flex" justifyContent="center" width="full">
                    <Button
                        onClick={handleVerifyOtp}
                        colorScheme="blue"
                        width="auto"
                        borderRadius="50px"
                        pl={10}
                        pr={10}
                        loading={isVerifyingOtp}
                    >
                        Verify OTP
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default OtpForm;
