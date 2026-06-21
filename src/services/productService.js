import api from '@/lib/api';

export const productService = {
  getAll: async ({ search = '', category = 'All' } = {}) => {
    const { data } = await api.get('/products', { params: { search, category } });
    return data.products;
  },
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  },
  getByBarcode: async (barcode) => {
    const { data } = await api.get(`/products/barcode/${barcode}`);
    return data.product;
  },
  getTop: async (limit = 5) => {
    const { data } = await api.get('/products/top', { params: { limit } });
    return data.products;
  },
  create: async (payload) => {
    const { data } = await api.post('/products', payload);
    return data.product;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data.product;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};
