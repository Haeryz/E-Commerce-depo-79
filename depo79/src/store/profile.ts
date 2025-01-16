import { create } from "zustand";

interface Profile {
    _id: string;
    nama: string;
    nomorhp: string;
    alamat: string;
    jeniskelamin: string;
}

interface ProfileState {
    profile: Profile | null; // Current user profile
    profileMap: Record<string, Profile>; // Map of all profiles by user ID
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    fetchProfiles: () => Promise<void>; // Fetch multiple profiles
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    profileMap: {}, // Initialize an empty profile map
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/profile"); // API for the current user profile
            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }
            const data = await response.json();
            if (data.success) {
                set({ profile: data.profile });
            } else {
                set({ error: data.message });
            }
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchProfiles: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/profile"); // API for fetching all profiles
            if (!response.ok) {
                throw new Error("Failed to fetch profiles");
            }
            const data = await response.json();
            if (data.success) {
                const profiles = data.profiles.reduce((map: Record<string, Profile>, profile: Profile) => {
                    map[profile._id] = profile;
                    return map;
                }, {});
                set({ profileMap: profiles });
            } else {
                set({ error: data.message });
            }
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
}));
