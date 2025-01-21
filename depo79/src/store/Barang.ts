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

interface Pagination {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

interface ProductState {
    products: Product[];
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    fetchProducts: (page: number, limit: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    pagination: {
        total: 0,
        page: 1,
        totalPages: 1,
        limit: 10,
    },
    loading: false,
    error: null,

    fetchProducts: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`api/product?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            if (data.success) {
                set({
                    products: data.products,
                    pagination: data.pagination,
                });
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
