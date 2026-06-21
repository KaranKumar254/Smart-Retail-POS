import api from '@/lib/api';

export const orderService = {
  getAll: async (status = 'All') => {
    const { data } = await api.get('/orders', { params: { status } });
    return data.orders;
  },
  getRecent: async (limit = 5) => {
    const { data } = await api.get('/orders/recent', { params: { limit } });
    return data.orders;
  },
  getById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  },
  // items: [{ productId, quantity }]
  checkout: async ({ items, customer, payment }) => {
    const { data } = await api.post('/orders/checkout', { items, customer, payment });
    return data.order;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data.order;
  },
};
