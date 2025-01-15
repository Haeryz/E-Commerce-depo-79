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
    logout: () => void;
    registerUser: (
        name: string,
        email: string,
        password: string,
        role: "customer" | "admin"
    ) => Promise<void>;
    loginUser: (email: string, password: string, turnstileToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: Cookies.get("authToken") || null, // Initialize token from cookies
    isAuthenticated: !!Cookies.get("authToken"), // Check if token exists in cookies

    setUser: (user) => set({ user, isAuthenticated: true }),
    setToken: (token) => {
        Cookies.set("authToken", token, { expires: 1 });
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        // Remove the token from cookies
        Cookies.remove("authToken");

        // Update the store state to reflect logout
        set({ user: null, token: null, isAuthenticated: false });

        // Force page refresh to apply changes
        window.location.reload();
    },

    registerUser: async (name, email, password, role) => {
        try {
            const response = await fetch("api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (!response.ok) {
                alert("Error registering user");
                return;
            }

            const loginResponse = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                set({ user: { name, email, role }, isAuthenticated: true });
                set({ token: loginData.token });
                Cookies.set("authToken", loginData.token, { expires: 1 });
                alert("User registered and logged in successfully");
            } else {
                alert("Error logging in after registration");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred while registering.");
        }
    },

    // Updated loginUser to accept the turnstileToken argument
    loginUser: async (email, password, turnstileToken) => {
        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, turnstileToken }), // Include turnstileToken in the request
            });

            const data = await response.json();

            if (response.ok) {
                // Now, we get the user data from the response
                set({ user: data.user, isAuthenticated: true });
                set({ token: data.token });
                Cookies.set("authToken", data.token, { expires: 1 });
                alert("Login successful");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred while logging in.");
        }
    },
}));
