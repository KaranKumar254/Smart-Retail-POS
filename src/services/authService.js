import api from '@/lib/api';

export const authService = {
  login: async (values) => {
    const { data } = await api.post('/auth/login', values);
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async (email, password) => {
    const { data } = await api.post('/auth/reset-password', { email, password });
    return data;
  },
};