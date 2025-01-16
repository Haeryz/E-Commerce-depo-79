import { create } from "zustand";

interface Product {
    _id: string;
    nama: string;
}

interface ProductState {
    productMap: Record<string, string>;
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    productMap: {},
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
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
}));
