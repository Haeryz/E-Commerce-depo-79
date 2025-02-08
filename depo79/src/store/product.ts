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
    terjual?: number;  // Add this property
    reviews?: Array<{  // Add this property
        _id: string;
        user: {
            _id: string;
            nama: string;
        };
        rating: number;
        comment: string;
    }>;
}

interface ProductState {
    products: Product[];
    productMap: Record<string, string>;
    productDetail: Product | null;
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    fetchProductReviewsPaginated: (id: string, page: number, limit: number) => Promise<void>;
    adminProducts: Product[];
    fetchAdminProducts: (page?: number, limit?: number) => Promise<void>;
    totalPages: number;
    currentPage: number;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    productMap: {},
    productDetail: null,
    loading: false,
    error: null,
    adminProducts: [],
    totalPages: 1,
    currentPage: 1,

    fetchProducts: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("/api/product");
            if (!response.ok) {
                throw new Error("Failed to fetch product data");
            }
            const data = await response.json();
            if (data.success) {
                set({ 
                    products: data.products,
                    productMap: data.products.reduce(
                        (acc: Record<string, string>, product: Product) => {
                            acc[product._id] = product.nama;
                            return acc;
                        },
                        {}
                    )
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

    fetchProductReviewsPaginated: async (id: string, page: number, limit: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/product/${id}?page=${page}&limit=${limit}`);
            if (!response.ok) throw new Error("Failed to fetch paginated reviews");
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

    fetchAdminProducts: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/product?page=${page}&limit=${limit}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch admin product data");
            }
            
            const data = await response.json();
            if (data.success) {
                set({ 
                    adminProducts: data.products,
                    totalPages: data.pagination.totalPages,
                    currentPage: page // Use the page parameter directly
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

    createProduct: async (product: Product) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error("Failed to create product");
            }
            const data = await response.json();
            if (!data.success) {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },
    updateProduct: async (id: string, product: Product) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error("Failed to update product");
            }
            const data = await response.json();
            if (!data.success) {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },
    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/product/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }
            const data = await response.json();
            if (!data.success) {
                set({ error: data.message });
            }
        } catch (error: unknown) {
            set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
            set({ loading: false });
        }
    },
}));