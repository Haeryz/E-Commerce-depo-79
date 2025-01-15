import { create } from "zustand";

interface Product {
    _id: string;
    nama: string;
    harga_jual: number;
    harga_beli: number;
    stok: number;
    diskon: number;
    berat: {
        value: number;
        unit: string;
    };
    letak_rak?: string;
    keterangan?: string;
    kategori: string;
    image: string;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("api/product"); // Update the URL as needed
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            if (data.success) {
                set({ products: data.products });
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
