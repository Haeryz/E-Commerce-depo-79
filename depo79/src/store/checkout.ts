import { create } from "zustand";
import axios from "axios";
import { useProfileStore } from "./profile"; // Add this import

// Enhanced interfaces to match backend models
interface CheckoutData {
    nama: string;
    cartId: string;
    nama_lengkap?: string;
    Email?: string;
    nomor_telefon?: string;
    alamat_lengkap: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    kodepos: string;
}

interface InitialCheckoutData {
    cartId: string;
    nama_lengkap?: string;
    Email?: string;
    nomor_telefon?: string;
    alamat_lengkap: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    kodepos: string;
}

interface PaymentUpdate {
    pembayaran: 'Transfer' | 'COD';
    buktiTransfer?: File;
}

interface CheckoutItem {
    _id: string;
    product: {
        _id: string;
        nama: string;
        harga_jual: number;
    };
    quantity: number;
    price: number;
}

interface Checkout {
    _id: string;
    buktiTransfer: string;
    nama: string;
    nama_lengkap?: string;
    Email?: string;
    nomor_telefon?: string;
    pembayaran: "Transfer" | "COD" | "Pending";
    status: "Pending" | "Menunggu Konfirmasi" | "Dibayar" | "Ditolak" | "Belum Dibayar" | "Dikirim" | "Diterima" | "Selesai";
    grandTotal: number;
    alamat_lengkap: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    kodepos: string;
    items: CheckoutItem[]; // Add this line
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
    createInitialCheckout: (data: CheckoutData) => Promise<string>; // Returns checkout ID
    uploadPaymentProof: (checkoutId: string, paymentData: PaymentUpdate) => Promise<void>;
    updateCheckout: (id: string, data: Partial<Checkout>) => Promise<void>; // Updated method signature
    deleteCheckout: (id: string) => Promise<void>;
    clearError: () => void;
    initializeCheckout: (data: InitialCheckoutData) => Promise<string>;
    fetchProfileCheckouts: (profileId: string) => Promise<void>; // Add this line
    addNewCheckout: (checkout: Checkout) => void; // Add this line
    updateCheckoutInStore: (updatedCheckout: Checkout) => void; // Add this line
}

const useCheckoutStore = create<CheckoutState>((set, get) => ({
    checkouts: [],
    currentCheckout: null,
    loading: false,
    error: null,

    // Add new methods to update store
    addNewCheckout: (checkout) => {
        set((state) => {
            const exists = state.checkouts.some(c => c._id === checkout._id);
            if (exists) {
                return state;
            }
            const newCheckouts = [checkout, ...state.checkouts];
            return {
                checkouts: newCheckouts,
                loading: false,
                error: null
            };
        });
    },

    updateCheckoutInStore: (updatedCheckout) => {
        set((state) => {
            const newCheckouts = state.checkouts.map((checkout) =>
                checkout._id === updatedCheckout._id ? updatedCheckout : checkout
            );
            return {
                checkouts: newCheckouts,
                currentCheckout: state.currentCheckout?._id === updatedCheckout._id 
                    ? updatedCheckout 
                    : state.currentCheckout,
                loading: false,
                error: null
            };
        });
    },

    fetchCheckouts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("/api/checkout");
            if (response.data.success) {
                set({ checkouts: response.data.checkouts });
            }
        } catch (error: any) {
            set({ error: error.message });
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

    createInitialCheckout: async (data: CheckoutData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            const { checkouts } = get();
            set({
                checkouts: [...checkouts, result.checkout],
                currentCheckout: result.checkout
            });

            return result.checkout._id; // Return the ID for the next step
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to create checkout' });
            throw error; // Re-throw to handle in the component
        } finally {
            set({ loading: false });
        }
    },

    uploadPaymentProof: async (checkoutId: string, paymentData: PaymentUpdate) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('pembayaran', paymentData.pembayaran);
            
            if (paymentData.pembayaran === 'Transfer' && paymentData.buktiTransfer) {
                formData.append('file', paymentData.buktiTransfer);
            }

            const response = await fetch(`/api/checkout/${checkoutId}/bukti-transfer`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            const { checkouts } = get();
            set({
                checkouts: checkouts.map(checkout =>
                    checkout._id === checkoutId ? result.checkout : checkout
                ),
                currentCheckout: result.checkout
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to upload payment proof' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateCheckout: async (id: string, data: Partial<Checkout>) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            const { checkouts } = get();
            set({
                checkouts: checkouts.map(checkout =>
                    checkout._id === id ? result.checkout : checkout
                ),
                currentCheckout: result.checkout
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update checkout' });
            throw error;
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

    clearError: () => set({ error: null }),

    initializeCheckout: async (data: InitialCheckoutData) => {
        set({ loading: true, error: null });
        try {
            // Get profile first to ensure we have it
            const profile = await useProfileStore.getState().profile;
            if (!profile) {
                throw new Error('No profile found');
            }

            const checkoutData = {
                ...data,
                nama: profile._id, // Add profile ID to checkout data
            };

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData)
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            // Update current checkout
            set({ currentCheckout: result.checkout });

            return result.checkout._id;
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to initialize checkout' });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    fetchProfileCheckouts: async (profileId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`/api/checkout/profile/${profileId}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            set({ checkouts: data.checkouts.filter(checkout => checkout.nama === profileId) });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch profile checkouts',
                checkouts: [] 
            });
        } finally {
            set({ loading: false });
        }
    },
}));

export default useCheckoutStore;