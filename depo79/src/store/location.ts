import { create } from "zustand";

interface Provinsi {
    _id: number;
    nama: string;
}

interface Kota {
    _id: number;
    provinsiId: number;
    nama: string;
}

interface Kecamatan {
    _id: number;
    kotaId: number;
    nama: string;
}

interface Kelurahan {
    _id: number;
    nama: string;
}

interface KodePos {
    _id: number;
    nama: string;
}

interface LokasiState {
    provinsi: Provinsi[];
    kota: Kota[];
    kecamatan: Kecamatan[];
    kelurahan: Kelurahan[];
    kodepos: KodePos[];
    loading: boolean;
    error: string | null;
    fetchProvinsi: () => Promise<void>;
    fetchKota: (provinsiId: number) => Promise<void>;
    fetchKecamatan: (kotaId: number) => Promise<void>;
    fetchKelurahan: (kecamatanId: number) => Promise<void>;
    fetchKodePos: (kelurahanId: number) => Promise<void>;
}

export const useLokasiStore = create<LokasiState>((set) => ({
    provinsi: [],
    kota: [],
    kecamatan: [],
    kelurahan: [],
    kodepos: [],
    loading: false,
    error: null,

    fetchProvinsi: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
            const data = await response.json();
            const mappedData = data.map((item: { id: string; name: string }) => ({
                _id: parseInt(item.id),
                nama: item.name
            }));
            set({ provinsi: mappedData, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch provinsi';
            console.error('Error in fetchProvinsi:', error);
            set({ error: errorMessage, loading: false });
        }
    },

    fetchKota: async (provinsiId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: { id: string; province_id: string; name: string }) => ({
                _id: parseInt(item.id),
                provinsiId: parseInt(item.province_id),
                nama: item.name
            }));
            set({ kota: mappedData, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch kota';
            console.error('Error in fetchKota:', error);
            set({ error: errorMessage, loading: false });
        }
    },

    fetchKecamatan: async (kotaId: number) => {
        set({ loading: true, error: null });
        try {
            // Changed API URL structure
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kotaId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: { id: string; regency_id: string; name: string; }) => ({
                _id: parseInt(item.id),
                kotaId: parseInt(item.regency_id),
                nama: item.name
            }));
            set({ kecamatan: mappedData, loading: false });
            console.log('Fetched kecamatan:', mappedData); // Add logging for debugging
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch kecamatan';
            console.error('Error in fetchKecamatan:', error); // Add error logging
            set({ error: errorMessage, loading: false });
        }
    },

    fetchKelurahan: async (kecamatanId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatanId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: { id: string; districts_id: string; name: string; }) => ({
                _id: parseInt(item.id),
                kecamatanId: parseInt(item.districts_id),
                nama: item.name
            }));
            set({ kelurahan: mappedData, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch kelurahan';
            console.error('Error in fetchKelurahan:', error);
            set({ error: errorMessage, loading: false });
        }
    },

    fetchKodePos: async (kelurahanId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kelurahanId}.json`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            set({ kodepos: data.kodepos, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch kodepos';
            console.error('Error in fetchKodePos:', error);
            set({ error: errorMessage, loading: false });
        }
    },
}));
