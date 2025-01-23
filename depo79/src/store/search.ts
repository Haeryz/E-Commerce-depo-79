import { create } from "zustand";

interface SearchState {
  suggestions: string[];
  loading: boolean;
  error: string | null;
  fetchSuggestions: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  suggestions: [],
  loading: false,
  error: null,

  fetchSuggestions: async (query: string) => {
    if (!query.trim()) {
      set({ suggestions: [] });
      return;
    }

    set({ loading: true, error: null });

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      
      const data = await response.json();
      set({ suggestions: data.suggestions });
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },
}));
