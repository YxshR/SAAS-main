import { create } from 'zustand'

interface AppState {
  activeBackend: 'nodejs' | 'rust'
  isBackendHealthy: boolean
  theme: 'light' | 'dark'
  sidebarOpen: boolean
}

interface AppActions {
  setActiveBackend: (backend: 'nodejs' | 'rust') => void
  setBackendHealth: (healthy: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set) => ({
  // State
  activeBackend: 'nodejs',
  isBackendHealthy: true,
  theme: 'light',
  sidebarOpen: false,

  // Actions
  setActiveBackend: (backend) => set({ activeBackend: backend }),
  setBackendHealth: (healthy) => set({ isBackendHealthy: healthy }),
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))