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
            const mappedData = data.map((item: any) => ({
                _id: parseInt(item.id),
                nama: item.name
            }));
            set({ provinsi: mappedData, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch provinsi', loading: false });
        }
    },

    fetchKota: async (provinsiId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: any) => ({
                _id: parseInt(item.id),
                provinsiId: parseInt(item.province_id),
                nama: item.name
            }));
            set({ kota: mappedData, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch kota', loading: false });
        }
    },

    fetchKecamatan: async (kotaId: number) => {
        set({ loading: true, error: null });
        try {
            // Changed API URL structure
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kotaId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: any) => ({
                _id: parseInt(item.id),
                kotaId: parseInt(item.regency_id),
                nama: item.name
            }));
            set({ kecamatan: mappedData, loading: false });
            console.log('Fetched kecamatan:', mappedData); // Add logging for debugging
        } catch (error) {
            console.error('Error in fetchKecamatan:', error); // Add error logging
            set({ error: 'Failed to fetch kecamatan', loading: false });
        }
    },

    fetchKelurahan: async (kecamatanId: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatanId}.json`);
            const data = await response.json();
            const mappedData = data.map((item: any) => ({
                _id: parseInt(item.id),
                kecamatanId: parseInt(item.districts_id),
                nama: item.name
            }));
            set({ kelurahan: mappedData, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch kelurahan', loading: false });
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
            set({ error: 'Failed to fetch kodepos', loading: false });
        }
    },
}));
