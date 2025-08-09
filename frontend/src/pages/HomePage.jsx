import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    getProducts(q)
      .then((list) => { if (!ignore) setProducts(list); })
      .catch((e) => { if (!ignore) setError(e.message || 'Erreur'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [q]);

  const title = useMemo(() => (q ? `منتجات مطابقة لـ "${q}"` : 'منتجاتنا الشتوية دافئة وذات جودة عالية.'), [q]);

  return (
    <div className="space-y-10 bg-white text-black">
      {/* Hero heading */}
      <section className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{title}</h1>
        {!q && (
          <>
            <Link to="#" className="link link-hover text-red-600">مشاهدة المزيد</Link>
            <p className="opacity-70 mt-1">اختر من مجموعتنا لتبقى أنيقًا في كل يوم.</p>
          </>
        )}
        <div className="mt-3 h-px bg-gray-300"></div>
      </section>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-72" />
          ))}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            
            <ProductCard key={p.id} product={p} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center opacity-70">لا توجد منتجات.</div>
          )}
        </div>
      )}

      {/* Category banners */}
      {!q && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-center">تسوق حسب الفئات</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop" alt="Winter" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div className="text-white font-extrabold text-xl">WINTER COLLECTION</div>
                <Link to="#" className="btn bg-black text-white">تسوق الآن</Link>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1532678465554-94846274c297?q=80&w=1200&auto=format&fit=crop" alt="Summer" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div className="text-white font-extrabold text-xl">SUMMER COLLECTION</div>
                <Link to="#" className="btn bg-black text-white">تسوق الآن</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
