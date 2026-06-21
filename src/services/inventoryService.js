import api from '@/lib/api';

export const inventoryService = {
  getAll: async () => {
    const { data } = await api.get('/inventory');
    return data.items;
  },
  getSummary: async () => {
    const { data } = await api.get('/inventory/summary');
    return data.summary;
  },
  adjustStock: async (productId, delta, reason) => {
    const { data } = await api.put(`/inventory/${productId}/stock`, { delta, reason });
    return data;
  },
  getLogs: async (productId) => {
    const { data } = await api.get(`/inventory/${productId}/logs`);
    return data.logs;
  },
};
