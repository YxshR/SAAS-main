'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AdminUser, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  login: (user: AdminUser, tokens: { accessToken: string; refreshToken: string }) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUser: (user: Partial<AdminUser>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (user, tokens) => {
        // Store tokens in localStorage
        localStorage.setItem('admin_access_token', tokens.accessToken)
        localStorage.setItem('admin_refresh_token', tokens.refreshToken)
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      logout: () => {
        // Clear tokens from localStorage
        localStorage.removeItem('admin_access_token')
        localStorage.removeItem('admin_refresh_token')
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)