import { create } from "zustand";

interface CartItem {
    _id: string;
    product: {
        _id: string;
        nama: string;
        harga_jual: number;
        image: string;
    };
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    loading: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    total: 0,
    loading: false,
    error: null,

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/cart');
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            }
        } catch (error) {
            set({ error: 'Failed to fetch cart' });
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (productId: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            }
        } catch (error) {
            set({ error: 'Failed to add item to cart' });
        } finally {
            set({ loading: false });
        }
    },

    removeFromCart: async (productId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            }
        } catch (error) {
            set({ error: 'Failed to remove item from cart' });
        } finally {
            set({ loading: false });
        }
    },
}));
