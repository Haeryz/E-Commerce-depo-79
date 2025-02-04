import { create } from "zustand";

interface SearchResult {
  _id: string;
  nama: string;
  harga_jual: number;
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
        const results = data.products as SearchResult[];
        set({ 
          results,
          // Extract suggestions from highlighted matches
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
