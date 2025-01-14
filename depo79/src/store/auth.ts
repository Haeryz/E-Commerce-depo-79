import { create } from "zustand";

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
    registerUser: (name: string, email: string, password: string, role: "customer" | "admin") => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: true }),
    setToken: (token) => set({ token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),

    // Register the user action
    registerUser: async (name, email, password, role) => {
        try {
            // Register the user
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

            // After successful registration, log the user in
            const loginResponse = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                set({ user: { name, email, role }, token: loginData.token, isAuthenticated: true });
                alert("User registered and logged in successfully");
            } else {
                alert("Error logging in after registration");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred while registering.");
        }
    },

    // Add the loginUser action here
    loginUser: async (email, password) => {
        try {
            const response = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                set({ user: data.user, token: data.token, isAuthenticated: true });
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
