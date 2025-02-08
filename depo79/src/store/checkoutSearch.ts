import { create } from "zustand";

interface CheckoutSearchParams {
  query?: string;
  status?: string;
  payment?: string;
  startDate?: string;
  endDate?: string;
  minTotal?: number;
  maxTotal?: number;
}

interface CheckoutSearchState {
  searchResults: any[];
  isLoading: boolean;
  error: string | null;
  searchParams: CheckoutSearchParams;
  setSearchParams: (params: Partial<CheckoutSearchParams>) => void;
  searchCheckouts: () => Promise<void>;
  clearSearch: () => void;
}

export const useCheckoutSearchStore = create<CheckoutSearchState>((set, get) => ({
  searchResults: [],
  isLoading: false,
  error: null,
  searchParams: {},

  setSearchParams: (params) => {
    set((state) => ({
      searchParams: { ...state.searchParams, ...params }
    }));
  },

  searchCheckouts: async () => {
    set({ isLoading: true, error: null });
    const { searchParams } = get();

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/search/query?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        set({ searchResults: data.checkouts });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchParams: {},
      error: null
    });
  }
}));
