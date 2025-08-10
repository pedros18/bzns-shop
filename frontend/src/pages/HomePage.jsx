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
    
    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching products with query:', q);
        
        const list = await getProducts(q);
        console.log('Products received:', list);
        
        if (!ignore) {
          setProducts(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        console.error('Error fetching products:', e);
        if (!ignore) {
          setError(e.message || 'خطأ في تحميل المنتجات');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProducts();
    
    return () => { 
      ignore = true; 
    };
  }, [q]);

  const title = useMemo(() => (q ? `منتجات مطابقة لـ "${q}"` : 'منتجاتنا الشتوية دافئة وذات جودة عالية.'), [q]);

  return (
    <div className="space-y-10 bg-white text-black min-h-screen p-4">
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

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-lg opacity-70">لا توجد منتجات.</div>
              <div className="text-sm mt-2 opacity-50">تحقق من اتصال الإنترنت أو حاول مرة أخرى.</div>
            </div>
          )}
        </div>
      )}

      {/* Category banners */}
      {!q && !loading && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-center">تسوق حسب الفئات</h2>
          <div className="grid grid-cols-1 gap-4">
  {/* Winter Collection */}
  <div className="relative rounded-lg overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1618354691373-d851c1b49c56?q=80&w=1200&auto=format&fit=crop"
      alt="Winter Clothes"
      className="w-full h-48 object-cover"
    />
    <div className="absolute inset-0 bg-black/30" />
    <div className="absolute inset-0 flex items-center justify-between px-6">
      <div className="text-white font-extrabold text-xl">WINTER COLLECTION</div>
      <Link
        to="#"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        تسوق الآن
      </Link>
    </div>
  </div>

  {/* Summer Collection */}
  <div className="relative rounded-lg overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop"
      alt="Summer Clothes"
      className="w-full h-48 object-cover"
    />
    <div className="absolute inset-0 bg-black/30" />
    <div className="absolute inset-0 flex items-center justify-between px-6">
      <div className="text-white font-extrabold text-xl">SUMMER COLLECTION</div>
      <Link
        to="#"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        تسوق الآن
      </Link>
    </div>
  </div>
</div>

        </section>
      )}
    </div>
  );
}