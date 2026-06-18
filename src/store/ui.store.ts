import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  activeTheme: 'hospital-a' | 'hospital-b';
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'hospital-a' | 'hospital-b') => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  activeTheme: 'hospital-b',
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setTheme: (theme) => set({ activeTheme: theme }),
}));
