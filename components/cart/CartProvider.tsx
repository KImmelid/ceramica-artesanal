"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: number; name: string; price: number; qty: number; stock?: number };
type CartState = { items: CartItem[] };
type CartContextType = {
  items: CartItem[];
  add: (item: { id: number; name: string; price: number; stock?: number }, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  inc: (id: number, by?: number) => void;
  dec: (id: number, by?: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(state));
    } catch {}
  }, [state]);

  const api: CartContextType = useMemo(() => ({
    items: state.items,
    add: (item, qty = 1) => {
      setState((s) => {
        const exists = s.items.find((i) => i.id === item.id);
        if (exists) {
          const max = item.stock ?? exists.stock ?? Infinity;
          const nextQty = Math.min(max, exists.qty + qty);
          return { items: s.items.map((i) => i.id === item.id ? { ...i, qty: nextQty, stock: max === Infinity ? i.stock : max } : i) };
        }
        const max = item.stock ?? Infinity;
        const initialQty = Math.min(max, qty);
        return { items: [...s.items, { ...item, qty: initialQty }] };
      });
    },
    remove: (id) => setState((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    setQty: (id, qty) => setState((s) => ({ items: s.items.map((i) => {
      if (i.id !== id) return i;
      const min = 1;
      const max = i.stock ?? Infinity;
      const next = Math.min(max, Math.max(min, Math.floor(qty || 1)));
      return { ...i, qty: next };
    }) })),
    inc: (id, by = 1) => setState((s) => ({ items: s.items.map((i) => {
      if (i.id !== id) return i;
      const max = i.stock ?? Infinity;
      return { ...i, qty: Math.min(max, i.qty + by) };
    }) })),
    dec: (id, by = 1) => setState((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty - by) } : i) })),
    clear: () => setState({ items: [] }),
    total: state.items.reduce((acc, i) => acc + i.price * i.qty, 0),
    count: state.items.reduce((acc, i) => acc + i.qty, 0),
    open,
    openDrawer: () => setOpen(true),
    closeDrawer: () => setOpen(false),
  }), [state, open]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
