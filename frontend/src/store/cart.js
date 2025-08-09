import { create } from 'zustand';

const persisted = JSON.parse(localStorage.getItem('cart_v1') || '[]');

export const useCart = create((set, get) => ({
  items: persisted,
  add(item) {
    const items = [...get().items];
    const key = `${item.id}-${item.color||''}-${item.size||''}`;
    const idx = items.findIndex((x)=> x.key === key);
    if (idx >= 0) {
      items[idx] = { ...items[idx], qty: (items[idx].qty || 0) + (item.qty || 1) };
    } else {
      items.push({ ...item, key, qty: item.qty || 1 });
    }
    localStorage.setItem('cart_v1', JSON.stringify(items));
    set({ items });
  },
  setQty(key, qty) {
    const q = Math.max(1, parseInt(qty || 1, 10));
    const items = get().items.map((it)=> it.key === key ? { ...it, qty: q } : it);
    localStorage.setItem('cart_v1', JSON.stringify(items));
    set({ items });
  },
  remove(key) {
    const items = get().items.filter((x)=> x.key !== key);
    localStorage.setItem('cart_v1', JSON.stringify(items));
    set({ items });
  },
  clear() {
    localStorage.removeItem('cart_v1');
    set({ items: [] });
  },
}));
