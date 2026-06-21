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

      login: async (values) => {
        try {
          const data = await authService.login(values);
          localStorage.setItem('smart-retail-token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
        } catch (error) {
          const message = error.response?.data?.message || 'Invalid email or password';
          throw new Error(message);
        }
      },

      forgotPassword: async (email) => {
        const data = await authService.forgotPassword(email);
        return data.message;
      },

      resetPassword: async (email, password) => {
        const data = await authService.resetPassword(email, password);
        return data.message;
      },

      refreshSession: async () => {
        const token = get().token;
        if (!token) return;
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
