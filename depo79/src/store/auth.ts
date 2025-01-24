import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
    name: string;
    email: string;
    role: "customer" | "admin";
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: (callback?: () => void) => void;
    registerUser: (
        name: string,
        email: string,
        password: string,
        role: "customer" | "admin"
    ) => Promise<{ otpRequired: boolean; email: string }>; // Update return type
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    loginUser: (email: string, password: string, turnstileToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    const tokenFromCookies = Cookies.get("authToken");
    const userFromCookies = Cookies.get("user");

    return {
        user: userFromCookies ? JSON.parse(userFromCookies) : null, // Improved error handling
        token: tokenFromCookies || null,
        isAuthenticated: !!tokenFromCookies,
        setUser: (user) => {
            Cookies.set("user", JSON.stringify(user), { expires: 1 });
            set({ user, isAuthenticated: true });
        },
        setToken: (token) => {
            Cookies.set("authToken", token, { expires: 1 });
            set({ token, isAuthenticated: true });
        },
        logout: (callback?: () => void) => {
            Cookies.remove("authToken");
            Cookies.remove("user");
            set({ user: null, token: null, isAuthenticated: false });
            if (callback) callback();
        },

        registerUser: async (name, email, password, role) => {
            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password, role }),
                });

                if (response.ok) {
                    // Return an object indicating OTP is required
                    return { otpRequired: true, email };
                } else {
                    throw new Error("Error during registration");
                }
            } catch (error) {
                console.error("Error registering user:", error);
                throw new Error("An error occurred during registration.");
            }
        },

        verifyOtp: async (email, otp) => {
            try {
                const otpResponse = await fetch("/api/auth/verify-otp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, otp }),
                });

                const otpData = await otpResponse.json();

                if (otpResponse.ok) {
                    return { success: true };
                } else {
                    return { success: false, error: otpData.error };
                }
            } catch (error) {
                console.error("OTP verification failed:", error);
                return { success: false, error: "An error occurred during OTP verification." };
            }
        },

        loginUser: async (email, password, turnstileToken) => {
            try {
                const response = await fetch("api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, turnstileToken }),
                });

                const data = await response.json();

                if (response.ok) {
                    set({ user: data.user, isAuthenticated: true });
                    set({ token: data.token });
                    Cookies.set("authToken", data.token, { expires: 1 });
                    Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
                    alert("Login successful");
                    
                    // Redirect based on user role
                    if (data.user.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                } else {
                    alert("Invalid credentials");
                }
            } catch (error) {
                alert("An error occurred during login.: " + error);
            }
        },
    };
});
