// src/services/authService.js
import api from '@/lib/api';

// Demo credentials that work WITHOUT a backend running
const DEMO_USERS = {
  'admin@smartretail.com': {
    password: 'Admin@123',
    user: { _id: 'demo-admin', name: 'Aarav Sharma', email: 'admin@smartretail.com', role: 'Admin', store: 'Central Flagship', isActive: true },
  },
  'manager@smartretail.com': {
    password: 'Manager@123',
    user: { _id: 'demo-manager', name: 'Meera Iyer', email: 'manager@smartretail.com', role: 'Manager', store: 'Mall Outlet', isActive: true },
  },
  'cashier@smartretail.com': {
    password: 'Cashier@123',
    user: { _id: 'demo-cashier', name: 'Rohan Das', email: 'cashier@smartretail.com', role: 'Cashier', store: 'Airport Kiosk', isActive: true },
  },
};

const DEMO_TOKEN = 'demo-offline-token';

const tryDemoLogin = (email, password) => {
  const entry = DEMO_USERS[email?.toLowerCase()];
  if (entry && entry.password === password) {
    return { token: DEMO_TOKEN, user: entry.user };
  }
  return null;
};

export const authService = {
  login: async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      return data;
    } catch (err) {
      // If backend is offline or unreachable, fall back to demo mode
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';
      if (isNetworkError) {
        const demo = tryDemoLogin(values.email, values.password);
        if (demo) return demo;
        throw new Error('Invalid demo credentials. Try Admin, Manager, or Cashier buttons.');
      }
      throw err;
    }
  },

  getMe: async () => {
    const token = localStorage.getItem('smart-retail-token');
    if (token === DEMO_TOKEN) {
      // In demo mode, reconstruct user from stored auth
      const stored = JSON.parse(localStorage.getItem('smart-retail-auth') || '{}');
      return { user: stored?.state?.user };
    }
    const { data } = await api.get('/auth/me');
    return data;
  },

  forgotPassword: async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return data;
    } catch {
      // Demo mode — pretend it worked
      if (DEMO_USERS[email?.toLowerCase()]) {
        return { message: `Password reset link sent to ${email} (demo mode — check your inbox won't actually have mail)` };
      }
      return { message: `If ${email} is registered, a reset link has been sent.` };
    }
  },

  resetPassword: async (email, password) => {
    try {
      const { data } = await api.post('/auth/reset-password', { email, password });
      return data;
    } catch {
      return { message: 'Password reset successful (demo mode).' };
    }
  },
};