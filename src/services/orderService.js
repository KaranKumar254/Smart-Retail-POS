import api from '@/lib/api';
import { recentTransactions, orders } from '@/mock/data';

const isOffline = (err) => !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

let mockOrders = [...orders];

export const orderService = {
  getAll: async (status = 'All') => {
    try {
      const { data } = await api.get('/orders', { params: { status } });
      return data.orders;
    } catch (err) {
      if (isOffline(err)) {
        return status === 'All' ? mockOrders : mockOrders.filter((o) => o.status === status);
      }
      throw err;
    }
  },
  getRecent: async (limit = 5) => {
    try {
      const { data } = await api.get('/orders/recent', { params: { limit } });
      return data.orders;
    } catch (err) {
      if (isOffline(err)) return recentTransactions.slice(0, limit);
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (err) {
      if (isOffline(err)) return mockOrders.find((o) => o.id === id) || null;
      throw err;
    }
  },
  checkout: async ({ items, customer, payment }) => {
    try {
      const { data } = await api.post('/orders/checkout', { items, customer, payment });
      return data.order;
    } catch (err) {
      if (isOffline(err)) {
        const newOrder = {
          _id: `demo-${Date.now()}`,
          orderNumber: `ORD-${9000 + mockOrders.length + 1}`,
          customerName: customer?.name || 'Walk-in Customer',
          items,
          payment,
          status: 'Completed',
          createdAt: new Date().toISOString(),
        };
        mockOrders = [newOrder, ...mockOrders];
        return newOrder;
      }
      throw err;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      return data.order;
    } catch (err) {
      if (isOffline(err)) {
        mockOrders = mockOrders.map((o) => (o.id === id ? { ...o, status } : o));
        return mockOrders.find((o) => o.id === id);
      }
      throw err;
    }
  },
};