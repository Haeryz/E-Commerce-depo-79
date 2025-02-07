import { create } from "zustand";

interface SearchResult {
  _id: string;
  nama: string;
  harga_jual: number;
  harga_beli: number; // Add this
  stok: number; // Add this
  diskon: number; // Add this
  berat: {    // Add this
    value: number;
    unit: string;
  };
  image: string;
  keterangan?: string;
  score: number;
  highlights: Array<{
    path: string;
    texts: Array<{
      value: string;
      type: string;
    }>;
  }>;
}

interface SearchState {
  results: SearchResult[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  fetchSuggestions: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  suggestions: [],
  loading: false,
  error: null,

  fetchSuggestions: async (query: string) => {
    if (!query.trim()) {
      set({ suggestions: [], results: [] });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`/api/product/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      
      const data = await response.json();
      if (data.success) {
        // Transform and validate the search results
        const results = data.products.map((product: any) => ({
          _id: product._id || '',
          nama: product.nama || '',
          harga_jual: product.harga_jual || 0,
          harga_beli: product.harga_beli || 0,
          stok: product.stok || 0,
          diskon: product.diskon || 0,
          berat: {
            value: product.berat?.value || 0,
            unit: product.berat?.unit || ''
          },
          image: product.image || '',
          keterangan: product.keterangan || '',
          score: product.score || 0,
          highlights: product.highlights || []
        }));

        set({ 
          results,
          suggestions: results.map(result => result.nama)
        });
      } else {
        set({ error: data.message });
      }
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },

  clearResults: () => {
    set({ results: [], suggestions: [] });
  }
}));