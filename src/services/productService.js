import api from '@/lib/api';
import { topProducts } from '@/mock/data';

const isOffline = (err) => !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

const mockProducts = topProducts.map((p) => ({ ...p, _id: String(p.id) }));

export const productService = {
  getAll: async ({ search = '', category = 'All' } = {}) => {
    try {
      const { data } = await api.get('/products', { params: { search, category } });
      return data.products;
    } catch (err) {
      if (isOffline(err)) {
        return mockProducts.filter((p) => {
          const bySearch = !search || [p.name, p.sku, p.barcode].join(' ').toLowerCase().includes(search.toLowerCase());
          const byCategory = category === 'All' || p.category === category;
          return bySearch && byCategory;
        });
      }
      throw err;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch (err) {
      if (isOffline(err)) return mockProducts.find((p) => String(p.id) === String(id)) || null;
      throw err;
    }
  },
  getByBarcode: async (barcode) => {
    try {
      const { data } = await api.get(`/products/barcode/${barcode}`);
      return data.product;
    } catch (err) {
      if (isOffline(err)) {
        const found = mockProducts.find((p) => p.barcode.includes(barcode));
        if (!found) throw new Error('No product matched the barcode');
        return found;
      }
      throw err;
    }
  },
  getTop: async (limit = 5) => {
    try {
      const { data } = await api.get('/products/top', { params: { limit } });
      return data.products;
    } catch (err) {
      if (isOffline(err)) return mockProducts.slice(0, limit);
      throw err;
    }
  },
  create: async (payload) => {
    try {
      const { data } = await api.post('/products', payload);
      return data.product;
    } catch (err) {
      if (isOffline(err)) return { _id: `p${Date.now()}`, ...payload };
      throw err;
    }
  },
  update: async (id, payload) => {
    try {
      const { data } = await api.put(`/products/${id}`, payload);
      return data.product;
    } catch (err) {
      if (isOffline(err)) return { _id: id, ...payload };
      throw err;
    }
  },
  remove: async (id) => {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (err) {
      if (isOffline(err)) return { success: true };
      throw err;
    }
  },
};