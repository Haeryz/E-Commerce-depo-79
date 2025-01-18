import { create } from "zustand";
import { useAuthStore } from "./auth";

interface Profile {
    _id: string;
    nama: string;
    nomorhp: string;
    alamat: string;
    jeniskelamin: string;
}

interface ProfileState {
    profile: Profile | null;
    profileMap: Record<string, Profile>;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    fetchProfiles: () => Promise<void>;
    createProfile: (profile: Profile) => Promise<void>;
    updateProfile: (profile: Profile) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    profileMap: {},
    loading: false,
    error: null,

    fetchProfile: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            console.log("User not authenticated");
            set({ error: "User not authenticated", loading: false });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch profile data");

            const data = await response.json();
            if (data.success) {
                console.log("Profile data fetched:", data.profile);
                set({ profile: data.profile });
            } else {
                console.log("Error fetching profile:", data.message);
                set({ error: data.message });
            }
        } catch (error: any) {
            console.log("Error during profile fetch:", error.message);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchProfiles: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            console.log("User not authenticated");
            set({ error: "User not authenticated", loading: false });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/profile", {  // Adjusted API endpoint for multiple profiles
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch profiles");

            const data = await response.json();
            if (data.success) {
                const profiles = data.profiles.reduce(
                    (map: Record<string, Profile>, profile: Profile) => {
                        map[profile._id] = profile;
                        return map;
                    },
                    {}
                );
                console.log("Fetched profiles:", profiles);
                set({ profileMap: profiles });
            } else {
                console.log("Error fetching profiles:", data.message);
                set({ error: data.message });
            }
        } catch (error: any) {
            console.log("Error during profiles fetch:", error.message);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    createProfile: async (profile: Profile) => {
        const { token } = useAuthStore.getState();
        if (!token) {
            console.log("User not authenticated");
            set({ error: "User not authenticated" });
            return;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) throw new Error("Failed to create profile");

            const data = await response.json();
            if (data.success) {
                console.log("Profile created:", data.profile);
                set({ profile: data.profile });
            } else {
                console.log("Error creating profile:", data.message);
                set({ error: data.message });
            }
        } catch (error: any) {
            console.log("Error during profile creation:", error.message);
            set({ error: error.message });
        }
    },

    updateProfile: async (profile: Profile) => {
        const { token } = useAuthStore.getState();
        if (!token) {
            console.log("User not authenticated");
            set({ error: "User not authenticated" });
            return;
        }

        try {
            const response = await fetch(`/api/profile/${profile._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const data = await response.json();
            if (data.success) {
                console.log("Profile updated:", data.profile);
                set({ profile: data.profile });
            } else {
                console.log("Error updating profile:", data.message);
                set({ error: data.message });
            }
        } catch (error: any) {
            console.log("Error during profile update:", error.message);
            set({ error: error.message });
        }
    },
}));
