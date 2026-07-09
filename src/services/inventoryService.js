
import { inventoryItems } from '@/mock/data';

const isOffline = (err) => !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

let mockInventory = inventoryItems.map((i, idx) => ({ ...i, _id: `inv-${idx}` }));

export const inventoryService = {
  getAll: async () => {
    try {
      const { data } = await api.get('/inventory');
      return data.items;
    } catch (err) {
      if (isOffline(err)) return mockInventory;
      throw err;
    }
  },
  getSummary: async () => {
    try {
      const { data } = await api.get('/inventory/summary');
      return data.summary;
    } catch (err) {
      if (isOffline(err)) return {
        totalItems: mockInventory.length,
        lowStock: mockInventory.filter((i) => i.stock <= i.threshold).length,
        totalValue: mockInventory.reduce((s, i) => s + i.stock * 100, 0),
      };
      throw err;
    }
  },
  adjustStock: async (productId, delta, reason) => {
    try {
      const { data } = await api.put(`/inventory/${productId}/stock`, { delta, reason });
      return data;
    } catch (err) {
      if (isOffline(err)) {
        mockInventory = mockInventory.map((i) =>
          i._id === productId ? { ...i, stock: Math.max(0, i.stock + delta) } : i
        );
        return { success: true };
      }
      throw err;
    }
  },
  getLogs: async (productId) => {
    try {
      const { data } = await api.get(`/inventory/${productId}/logs`);
      return data.logs;
    } catch (err) {
      if (isOffline(err)) return [];
      throw err;
    }
  },
};
