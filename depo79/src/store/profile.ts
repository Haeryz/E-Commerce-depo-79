import { create } from "zustand";

interface Profile {
    _id: string;
    nama: string; // New field added
    nomorhp: string;
    alamat: string;
    jeniskelamin: string;
}

interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/profile"); // Replace with your API endpoint
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
}));
