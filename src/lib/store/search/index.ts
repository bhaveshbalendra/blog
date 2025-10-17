import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PostFilters {
  search: string;
  categoryIds: string[]; // Changed from single categoryId to array
  published: boolean | null; // null = all, true = published only, false = draft only
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  sortBy: "createdAt" | "updatedAt" | "title" | "published";
  sortOrder: "asc" | "desc";
}

export interface SearchState {
  // Search query
  query: string;

  // Filters
  filters: PostFilters;

  // Pagination
  currentPage: number;
  pageSize: number;

  // Search state
  isSearching: boolean;
  searchHistory: string[];

  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<PostFilters>) => void;
  updateFilter: <K extends keyof PostFilters>(
    key: K,
    value: PostFilters[K]
  ) => void;
  toggleCategory: (categoryId: string) => void; // New action for toggling categories
  clearFilters: () => void;
  resetSearch: () => void;

  // Pagination actions
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;

  // Search history actions
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;

  // Search state actions
  setSearching: (searching: boolean) => void;
}

const initialFilters: PostFilters = {
  search: "",
  categoryIds: [], // Changed from null to empty array
  published: null,
  dateRange: {
    from: null,
    to: null,
  },
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      query: "",
      filters: initialFilters,
      currentPage: 1,
      pageSize: 10,
      isSearching: false,
      searchHistory: [],

      // Query actions
      setQuery: (query) => {
        set({ query });
        if (query.trim()) {
          get().addToHistory(query);
        }
      },

      // Filter actions
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1, // Reset to first page when filters change
        }));
      },

      updateFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1, // Reset to first page when filter changes
        }));
      },

      toggleCategory: (categoryId) => {
        set((state) => {
          const currentCategoryIds = state.filters.categoryIds || [];
          const isSelected = currentCategoryIds.includes(categoryId);

          const newCategoryIds = isSelected
            ? currentCategoryIds.filter((id) => id !== categoryId)
            : [...currentCategoryIds, categoryId];

          return {
            filters: { ...state.filters, categoryIds: newCategoryIds },
            currentPage: 1, // Reset to first page when filter changes
          };
        });
      },

      clearFilters: () => {
        set({
          filters: initialFilters,
          currentPage: 1,
        });
      },

      resetSearch: () => {
        set({
          query: "",
          filters: initialFilters,
          currentPage: 1,
          isSearching: false,
        });
      },

      // Pagination actions
      setPage: (page) => set({ currentPage: page }),

      nextPage: () => {
        const { currentPage } = get();
        set({ currentPage: currentPage + 1 });
      },

      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 1) {
          set({ currentPage: currentPage - 1 });
        }
      },

      setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
      },

      // Search history actions
      addToHistory: (query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        set((state) => {
          const newHistory = [
            trimmedQuery,
            ...state.searchHistory.filter((q) => q !== trimmedQuery),
          ];
          return {
            searchHistory: newHistory.slice(0, 10), // Keep only last 10 searches
          };
        });
      },

      clearHistory: () => set({ searchHistory: [] }),

      removeFromHistory: (query) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((q) => q !== query),
        }));
      },

      // Search state actions
      setSearching: (searching) => set({ isSearching: searching }),
    }),
    {
      name: "search-store",
      partialize: (state) => ({
        filters: state.filters,
        pageSize: state.pageSize,
        searchHistory: state.searchHistory,
      }),
    }
  )
);
