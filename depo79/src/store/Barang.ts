import { create } from "zustand";

interface Product {
    _id: string;
    nama: string;
    harga_jual: number;
    harga_beli: number;
    stok: number;
    terjual?: number;
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
    product: Product | null; // Single product state
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    fetchProducts: (page?: number, limit?: number) => Promise<void>;
    fetchProductById: (id: string) => Promise<void>; // Fetch single product by ID
}


export const useProductStore = create<ProductState>((set) => ({
    products: [],
    product: null, // Initial state for a single product is null
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
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },

    fetchProductById: async (id: string) => {
        set({ loading: true, error: null });
        console.log('Fetching product with ID:', id); // Log the ID to confirm it's correct
    
        try {
            const response = await fetch(`/api/product/${id}`);
            console.log('API Response Status:', response.status); // Log the response status for debugging
    
            if (!response.ok) {
                throw new Error("Failed to fetch product");
            }
    
            const data = await response.json();
            console.log('API Response:', data); // Log the full response to confirm it has the expected structure
    
            if (data.success) {
                set({ product: data.product }); // This should update the product state
                console.log('Product fetched and set:', data.product); // Log the product object that is being set
            } else {
                set({ error: data.message });
                console.log('Error setting product:', data.message); // Log any error messages
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
            console.log('Error during API call:', error instanceof Error ? error.message : 'An unknown error occurred'); // Log error during API call
        } finally {
            set({ loading: false });
        }
    },
}));
