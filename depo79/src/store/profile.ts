import { create } from "zustand";
import { useAuthStore } from "./auth";
import { Alamat } from "./alamat";

interface Profile {
  _id: string;
  nama: string;
  nomorhp: string;
  alamat: Alamat;
  jeniskelamin: string;
}

interface CreateProfileData {
  nama: string;
  nomorhp: string;
  jeniskelamin: string;
}

interface ProfileState {
  profile: Profile | null;
  profileMap: Record<string, Profile>;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  fetchProfileReviews: () => Promise<void>;
  createProfile: (profileData: CreateProfileData) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  updateProfileName: (name: string) => void; // Function to update profile name
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  profileMap: {},
  loading: false,
  error: null,

  // Update profile name in store
  updateProfileName: (name) => {
    set((state) => {
      if (state.profile) {
        return {
          profile: {
            ...state.profile, // Retain the existing profile data
            nama: name, // Update the name
          },
        };
      }
      return {}; // If profile doesn't exist, return empty object
    });
  },

  // Fetch the user's profile
  fetchProfile: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.log("User not authenticated");
      set({ error: "User not authenticated", loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/profile/account", {
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
    } catch (error: unknown) {
      console.log("Error during profile fetch:", error instanceof Error ? error.message : String(error));
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all profiles (if needed)
  fetchProfiles: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.log("User not authenticated");
      set({ error: "User not authenticated", loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/profile/account", {  // Adjusted API endpoint for multiple profiles
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
    } catch (error: unknown) {
      console.log("Error during profiles fetch:", error instanceof Error ? error.message : String(error));
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },

  // Create a new profile
  createProfile: async (profileData: CreateProfileData) => {
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
        body: JSON.stringify(profileData),
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
    } catch (error: unknown) {
      console.log("Error during profile creation:", error instanceof Error ? error.message : String(error));
      set({ error: error instanceof Error ? error.message : String(error) });
    }
  },

  // Update an existing profile
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
    } catch (error: unknown) {
      console.log("Error during profile update:", error instanceof Error ? error.message : String(error));
      set({ error: error instanceof Error ? error.message : String(error) });
    }
  },

  // Fetch profile reviews if required
  fetchProfileReviews: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/profile/reviews", { method: "GET" }); // Adjusted endpoint for reviews

      if (!response.ok) throw new Error("Failed to fetch profile reviews");

      const data = await response.json();
      if (data.success) {
        // Handle the review data if necessary
        console.log("Fetched profile reviews:", data.reviews);
      } else {
        console.log("Error fetching profile reviews:", data.message);
        set({ error: data.message });
      }
    } catch (error: unknown) {
      console.log("Error during profile reviews fetch:", error instanceof Error ? error.message : String(error));
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },
}));
