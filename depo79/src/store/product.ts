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
    productMap: Record<string, string>;
    productDetail: Product | null;
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    productMap: {},
    productDetail: null,
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/product");
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }
            const data = await response.json();
            if (data.success) {
                const productMap = data.products.reduce(
                    (acc: Record<string, string>, product: Product) => {
                        acc[product._id] = product.nama;
                        return acc;
                    },
                    {}
                );
                set({ productMap });
            } else {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },

    fetchProductById: async (id: string) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch(`/api/product/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }
            const data = await response.json();
            if (data.success) {
                set({ productDetail: data.product });
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