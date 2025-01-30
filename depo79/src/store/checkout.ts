import { create } from "zustand";

interface Checkout {
    _id: string;
    buktiTransfer: string;
    nama: string;
    pembayaran: "Transfer" | "COD";
    status: "Belum Dibayar" | "Dibayar" | "Dikirim" | "Diterima";
    grandTotal: number;
    createdAt: string;
    updatedAt: string;
}

interface CheckoutState {
    checkouts: Checkout[];
    currentCheckout: Checkout | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchCheckouts: () => Promise<void>;
    fetchCheckoutById: (id: string) => Promise<void>;
    createCheckout: (data: FormData) => Promise<void>;
    updateCheckout: (id: string, data: FormData) => Promise<void>;
    deleteCheckout: (id: string) => Promise<void>;
    clearError: () => void;
}

const useCheckoutStore = create<CheckoutState>((set, get) => ({
    checkouts: [],
    currentCheckout: null,
    loading: false,
    error: null,

    fetchCheckouts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            set({ checkouts: data.checkouts });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch checkouts' });
        } finally {
            set({ loading: false });
        }
    },

    fetchCheckoutById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout/${id}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            set({ currentCheckout: data.checkout });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch checkout' });
        } finally {
            set({ loading: false });
        }
    },

    createCheckout: async (formData: FormData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            const { checkouts } = get();
            set({
                checkouts: [...checkouts, data.checkout],
                currentCheckout: data.checkout
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create checkout' });
        } finally {
            set({ loading: false });
        }
    },

    updateCheckout: async (id: string, formData: FormData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout/${id}`, {
                method: 'PUT',
                body: formData
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            const { checkouts } = get();
            set({
                checkouts: checkouts.map(checkout =>
                    checkout._id === id ? data.checkout : checkout
                ),
                currentCheckout: data.checkout
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update checkout' });
        } finally {
            set({ loading: false });
        }
    },

    deleteCheckout: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            const { checkouts } = get();
            set({
                checkouts: checkouts.filter(checkout => checkout._id !== id),
                currentCheckout: null
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete checkout' });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null })
}));

export default useCheckoutStore;