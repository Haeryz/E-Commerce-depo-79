import { create } from "zustand";
import { useAuthStore } from "./auth";

export interface Alamat {
    _id: string;
    user: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    kodepos: number;
    detail: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface AlamatState {
    alamat: Alamat | null;
    loading: boolean;
    error: string | null;
    fetchAlamat: () => Promise<void>;
    createAlamat: (alamat: Omit<Alamat, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<void>;
    updateAlamat: (alamat: Alamat) => Promise<void>;
}

export const useAlamatStore = create<AlamatState>((set) => ({
    alamat: null,
    loading: false,
    error: null,

    fetchAlamat: async () => {
        const { token } = useAuthStore.getState();
        if (!token) {
            set({ error: "User not authenticated", loading: false });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/alamat", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch address");

            const data = await response.json();
            if (data.success) {
                set({ alamat: data.alamat });
            } else {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : String(error) });
        } finally {
            set({ loading: false });
        }
    },

    createAlamat: async (alamat) => {
        const { token } = useAuthStore.getState();
        if (!token) {
            set({ error: "User not authenticated" });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/alamat", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(alamat),
            });

            if (!response.ok) throw new Error("Failed to create address");

            const data = await response.json();
            if (data.success) {
                set({ alamat: data.alamat });
            } else {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : String(error) });
        } finally {
            set({ loading: false });
        }
    },

    updateAlamat: async (alamat) => {
        const { token } = useAuthStore.getState();
        if (!token) {
            set({ error: "User not authenticated" });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await fetch(`/api/alamat/${alamat._id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(alamat),
            });

            if (!response.ok) throw new Error("Failed to update address");

            const data = await response.json();
            if (data.success) {
                set({ alamat: data.alamat });
            } else {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : String(error) });
        } finally {
            set({ loading: false });
        }
    },
}));
