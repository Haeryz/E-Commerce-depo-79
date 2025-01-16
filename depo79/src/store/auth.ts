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

export const useAuthStore = create<AuthState>((set) => {
    const tokenFromCookies = Cookies.get("authToken");
    const userFromCookies = Cookies.get("user");

    console.log("Refreshing page...");
    console.log("Token from cookies:", tokenFromCookies);
    console.log("User from cookies:", userFromCookies);

    return {
        user: userFromCookies ? JSON.parse(userFromCookies) : null, // Improved error handling
        token: tokenFromCookies || null,
        isAuthenticated: !!tokenFromCookies,
        setUser: (user) => {
            console.log("Setting user:", user);
            Cookies.set("user", JSON.stringify(user), { expires: 1 });
            set({ user, isAuthenticated: true });
        },
        setToken: (token) => {
            console.log("Setting token:", token);
            Cookies.set("authToken", token, { expires: 1 });
            set({ token, isAuthenticated: true });
        },

        logout: () => {
            console.log("Logging out...");
            Cookies.remove("authToken");
            Cookies.remove("user");
            set({ user: null, token: null, isAuthenticated: false });
        },

        registerUser: async (name, email, password, role) => {
            console.log("Registering user:", { name, email, role });
            try {
                const response = await fetch("api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password, role }),
                });

                if (!response.ok) {
                    console.error("Error registering user:", response);
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
                    console.log("Login successful, user data:", loginData);
                    set({ user: { name, email, role }, isAuthenticated: true });
                    set({ token: loginData.token });
                    Cookies.set("authToken", loginData.token, { expires: 1 });
                    Cookies.set("user", JSON.stringify({ name, email, role }), { expires: 1 }); // Ensure user data is also set correctly
                    alert("User registered and logged in successfully");
                } else {
                    console.error("Error logging in after registration:", loginData);
                    alert("Error logging in after registration");
                }
            } catch (error) {
                console.error("Error during registration:", error);
                alert("An error occurred while registering.");
            }
        },

        loginUser: async (email, password, turnstileToken) => {
            console.log("Logging in user:", { email, password });
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
                    console.log("Login successful, user data:", data);
                    set({ user: data.user, isAuthenticated: true });
                    set({ token: data.token });
                    Cookies.set("authToken", data.token, { expires: 1 });
                    Cookies.set("user", JSON.stringify(data.user), { expires: 1 }); // Store user data in cookies correctly
                    alert("Login successful");
                } else {
                    console.error("Invalid credentials:", data);
                    alert("Invalid credentials");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An error occurred while logging in.");
            }
        },
    };
});
