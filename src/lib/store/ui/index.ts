import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  // Theme
  theme: "light" | "dark";

  // Navigation
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  // Modals
  createPostModalOpen: boolean;
  deleteConfirmModalOpen: boolean;
  editPostModalOpen: boolean;
  deleteCategoryModalOpen: boolean;

  // Selected items
  selectedPostId: string | null;
  selectedCategoryId: string | null;

  // Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Modal actions
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openDeleteConfirmModal: (postId: string) => void;
  closeDeleteConfirmModal: () => void;
  openEditPostModal: (postId: string) => void;
  closeEditPostModal: () => void;
  openDeleteCategoryModal: (categoryId: string) => void;
  closeDeleteCategoryModal: () => void;

  // Selection actions
  setSelectedPostId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      theme: "light",
      sidebarOpen: false,
      mobileMenuOpen: false,
      createPostModalOpen: false,
      deleteConfirmModalOpen: false,
      editPostModalOpen: false,
      deleteCategoryModalOpen: false,
      selectedPostId: null,
      selectedCategoryId: null,

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Mobile menu actions
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Modal actions
      openCreatePostModal: () => set({ createPostModalOpen: true }),
      closeCreatePostModal: () => set({ createPostModalOpen: false }),

      openDeleteConfirmModal: (postId) =>
        set({
          deleteConfirmModalOpen: true,
          selectedPostId: postId,
        }),
      closeDeleteConfirmModal: () =>
        set({
          deleteConfirmModalOpen: false,
          selectedPostId: null,
        }),

      openEditPostModal: (postId) =>
        set({
          editPostModalOpen: true,
          selectedPostId: postId,
        }),
      closeEditPostModal: () =>
        set({
          editPostModalOpen: false,
          selectedPostId: null,
        }),

      openDeleteCategoryModal: (categoryId) =>
        set({
          deleteCategoryModalOpen: true,
          selectedCategoryId: categoryId,
        }),
      closeDeleteCategoryModal: () =>
        set({
          deleteCategoryModalOpen: false,
          selectedCategoryId: null,
        }),

      // Selection actions
      setSelectedPostId: (id) => set({ selectedPostId: id }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      clearSelection: () =>
        set({ selectedPostId: null, selectedCategoryId: null }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
