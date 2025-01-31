import { create } from "zustand";

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

interface PaymentUpdate {
    pembayaran: 'Transfer' | 'COD';
    buktiTransfer?: File;
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