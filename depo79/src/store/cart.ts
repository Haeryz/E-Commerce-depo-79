import { create } from "zustand";
import Cookies from "js-cookie";  // Add this import

interface CartItem {
    _id: string;
    product: {
        _id: string;
        nama: string;
        harga_jual: number;
        image: string;
        stok: number;
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
    updateCartItem: (productId: string, quantity: number) => Promise<void>;
    updateLocalQuantity: (productId: string, quantity: number) => void;
    syncWithServer: (productId: string, quantity: number) => Promise<void>;
    removeLocalItem: (productId: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    total: 0,
    loading: false,
    error: null,

    fetchCart: async () => {
        set({ loading: true, error: null });
        try {
            const token = Cookies.get("authToken");
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            set({ error: 'Failed to fetch cart' + error });
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (productId: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
            const token = Cookies.get("authToken");
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            set({ error: 'Failed to add item to cart'+ error });
        } finally {
            set({ loading: false });
        }
    },

    updateLocalQuantity: (productId: string, quantity: number) => {
        const { items } = get();
        const updatedItems = items.map(item =>
            item.product._id === productId
                ? { ...item, quantity }
                : item
        );
        
        const newTotal = updatedItems.reduce(
            (sum, item) => sum + (item.quantity * item.product.harga_jual),
            0
        );

        set({ items: updatedItems, total: newTotal });
    },

    syncWithServer: async (productId: string, quantity: number) => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity }),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
        } catch (error) {
            console.log('Failed to sync cart with server', error);
            get().fetchCart();
        }
    },

    updateCartItem: async (productId: string, quantity: number) => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity }),
            });
            const data = await response.json();
            if (data.success) {
                set({ items: data.cart.items, total: data.cart.total });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            set({ error: 'Failed to update cart item' + error });
        }
    },

    removeLocalItem: (productId: string) => {
        const { items } = get();
        const itemToRemove = items.find(item => item.product._id === productId);
        
        if (!itemToRemove) return;

        const updatedItems = items.filter(item => item.product._id !== productId);
        const newTotal = get().total - (itemToRemove.quantity * itemToRemove.product.harga_jual);
        
        set({ items: updatedItems, total: newTotal });
    },

    removeFromCart: async (productId: string) => {
        try {
            const token = Cookies.get("authToken");
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
        } catch (error) {
            // If deletion fails, refetch the cart to restore state
            get().fetchCart();
            set({ error: 'Failed to remove item from cart' + error });
        }
    },
}));
