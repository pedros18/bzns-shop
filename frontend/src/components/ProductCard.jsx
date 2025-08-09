import React from 'react';
import { Link } from 'react-router-dom';
import { formatDZD } from '../lib/api';

export default function ProductCard({ product }) {
  const hasSale = product.old_price && Number(product.old_price) > Number(product.price);
  const categories = [product.category].filter(Boolean);

  return (
    <div className="group card bg-white shadow-sm overflow-hidden border border-base-200 hover:border-blue-500 transition-colors">
      <div className="relative">
        {hasSale && <span className="absolute top-2 start-2 bg-black text-white text-xs px-2 py-1 rounded">تخفيض!</span>}
        <Link to={`/product/${product.id}`} className="block">
          <figure className="aspect-[4/5] bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </figure>
        </Link>
      </div>
      <div className="card-body p-4 text-start">
        {categories.length > 0 && (
          <div className="text-[11px] tracking-wide uppercase opacity-70">
            {categories.join(', ')}
          </div>
        )}
        <h2 className="mt-1 text-base font-bold leading-snug line-clamp-2 min-h-[44px] text-black">{product.name}</h2>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-primary font-extrabold">{formatDZD(product.price)}</div>
          {hasSale && (
            <div className="opacity-50 line-through">{formatDZD(product.old_price)}</div>
          )}
        </div>
        <div className="mt-3">
          <Link to={`/product/${product.id}`} className="btn w-full rounded-none bg-black text-white hover:bg-red-600 group-hover:bg-red-600">
            تحديد أحد الخيارات
          </Link>
        </div>
      </div>
    </div>
  );
}
