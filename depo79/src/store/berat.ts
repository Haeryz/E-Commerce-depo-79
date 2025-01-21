import { create } from "zustand";

interface Berat {
    _id: string;
    nama: string;
}

interface BeratState {
    beratMap: Record<string, string>;
    loading: boolean;
    error: string | null;
    fetchBerat: () => Promise<void>;
}

export const useBeratStore = create<BeratState>((set) => ({
    beratMap: {},
    loading: false,
    error: null,

    fetchBerat: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/berat"); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error("Failed to fetch berat data");
            }
            const data = await response.json();
            if (data.success) {
                const beratMap = data.berats.reduce(
                    (acc: Record<string, string>, berat: Berat) => {
                        acc[berat._id] = berat.nama;
                        return acc;
                    },
                    {}
                );
                set({ beratMap });
            } else {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },
}));
