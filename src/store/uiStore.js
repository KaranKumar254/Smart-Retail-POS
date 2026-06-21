import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  search: '',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearch: (search) => set({ search }),
}));
