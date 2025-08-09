import React from 'react';
import { useCart } from '../store/cart';
import { formatDZD } from '../lib/api';

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const total = items.reduce((a, b)=> a + Number(b.price||0) * (b.qty||1), 0);
  return (
    <div className="rtl space-y-4">
      <h1 className="text-2xl font-extrabold">سلة التسوق</h1>
      {items.length === 0 ? (
        <div className="alert">لا توجد منتجات في السلة.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it)=> (
            <div key={it.key} className="flex items-center gap-3 border p-3 rounded">
              <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-bold">{it.name}</div>
                <div className="text-sm opacity-70">{it.color} {it.size}</div>
                <div className="text-sm">{formatDZD(it.price)}</div>
              </div>
              <input type="number" min={1} className="input input-bordered w-20" value={it.qty}
                onChange={(e)=> setQty(it.key, e.target.value)} />
              <button className="btn" onClick={()=> remove(it.key)}>حذف</button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">المجموع: {formatDZD(total)}</div>
            <div className="flex gap-2">
              <button className="btn" onClick={clear}>تفريغ السلة</button>
              <button className="btn bg-black text-white">إتمام الشراء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
