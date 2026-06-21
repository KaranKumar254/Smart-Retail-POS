import api from '@/lib/api';

export const userService = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data.users;
  },
  create: async (payload) => {
    const { data } = await api.post('/users', payload);
    return data.user;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.user;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};