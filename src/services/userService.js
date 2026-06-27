import api from '@/lib/api';

const MOCK_USERS = [
  { _id: 'u1', name: 'Aarav Sharma', email: 'admin@smartretail.com', role: 'Admin', store: 'Central Flagship', isActive: true, createdAt: '2024-01-01' },
  { _id: 'u2', name: 'Meera Iyer', email: 'manager@smartretail.com', role: 'Manager', store: 'Mall Outlet', isActive: true, createdAt: '2024-02-15' },
  { _id: 'u3', name: 'Rohan Das', email: 'cashier@smartretail.com', role: 'Cashier', store: 'Airport Kiosk', isActive: true, createdAt: '2024-03-10' },
  { _id: 'u4', name: 'Sneha Pillai', email: 'sneha@smartretail.com', role: 'Cashier', store: 'Central Flagship', isActive: true, createdAt: '2024-04-05' },
];

const isOffline = (err) => !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

export const userService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/users');
      return data.users;
    } catch (err) {
      if (isOffline(err)) return MOCK_USERS;
      throw err;
    }
  },
  create: async (payload) => {
    try {
      const { data } = await api.post('/users', payload);
      return data.user;
    } catch (err) {
      if (isOffline(err)) return { _id: `u${Date.now()}`, ...payload, isActive: true, createdAt: new Date().toISOString() };
      throw err;
    }
  },
  update: async (id, payload) => {
    try {
      const { data } = await api.put(`/users/${id}`, payload);
      return data.user;
    } catch (err) {
      if (isOffline(err)) return { _id: id, ...payload };
      throw err;
    }
  },
  remove: async (id) => {
    try {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    } catch (err) {
      if (isOffline(err)) return { success: true };
      throw err;
    }
  },
};