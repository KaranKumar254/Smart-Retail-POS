import { create } from 'zustand';

export const usePOSStore = create((set, get) => ({
  cart: [],
  paymentMethod: 'Cash',
  discount: 0,

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
      };
    }),

  updateQuantity: (id, delta) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cart: [] }),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  setDiscount: (discount) => set({ discount }),

  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getTax: () => {
    return get().getSubtotal() * 0.05; // 5% Tax
  },

  getDiscountAmount: () => {
    return (get().getSubtotal() * get().discount) / 100;
  },

  getGrandTotal: () => {
    return (
      get().getSubtotal() +
      get().getTax() -
      get().getDiscountAmount()
    );
  },

  getItemCount: () => {
    return get().cart.reduce(
      (count, item) => count + item.quantity,
      0
    );
  },

  isCartEmpty: () => {
    return get().cart.length === 0;
  },
}));