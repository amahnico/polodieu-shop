import { create } from 'zustand';

const savedCart = JSON.parse(localStorage.getItem('polodieu_cart') || '[]');

export const useCartStore = create((set, get) => ({
  cart: savedCart,
  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find((item) => item.id === product.id);
    const nextCart = existing
      ? cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      : [...cart, { ...product, qty: 1 }];
    localStorage.setItem('polodieu_cart', JSON.stringify(nextCart));
    set({ cart: nextCart });
  },
  removeFromCart: (id) => {
    const nextCart = get().cart.filter((item) => item.id !== id);
    localStorage.setItem('polodieu_cart', JSON.stringify(nextCart));
    set({ cart: nextCart });
  },
  clearCart: () => {
    localStorage.removeItem('polodieu_cart');
    set({ cart: [] });
  },
  totalItems: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
  totalPrice: () => get().cart.reduce((sum, item) => sum + item.price * item.qty, 0)
}));
