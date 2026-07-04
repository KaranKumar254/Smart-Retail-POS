// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      register: async (values) => {
        try {
          const data = await authService.register(values);
          localStorage.setItem('smart-retail-token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
        } catch (error) {
          const message = error.response?.data?.message || error.message || 'Could not create account';
          throw new Error(message);
        }
      },

      login: async (values) => {
        try {
          const data = await authService.login(values);
          localStorage.setItem('smart-retail-token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
        } catch (error) {
          const message = error.response?.data?.message || error.message || 'Invalid email or password';
          throw new Error(message);
        }
      },

      forgotPassword: async (email) => {
        try {
          const data = await authService.forgotPassword(email);
          return data;
        } catch (error) {
          const message = error.response?.data?.message || error.message || 'Could not send reset instructions';
          throw new Error(message);
        }
      },

      resetPassword: async (email, token, password) => {
        try {
          const data = await authService.resetPassword(email, token, password);
          return data.message;
        } catch (error) {
          const message = error.response?.data?.message || error.message || 'Could not update password';
          throw new Error(message);
        }
      },

      refreshSession: async () => {
        const token = get().token;
        if (!token) return;
        // Skip API call for demo tokens — user is already set from persist
        if (token === 'demo-offline-token') return;
        try {
          const data = await authService.getMe();
          set({ user: data.user, isAuthenticated: true });
        } catch {
          localStorage.removeItem('smart-retail-token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      logout: () => {
        localStorage.removeItem('smart-retail-token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'smart-retail-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);