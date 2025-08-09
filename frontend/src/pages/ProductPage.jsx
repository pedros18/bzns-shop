import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts, formatDZD, getWhatsAppDigits } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { WILAYAS } from '../lib/dz';
import { useCart } from '../store/cart';

function OptionPills({ options = [], value, onChange }) {
  if (!options || options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const v = String(opt);
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(v)}
            className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

function Quantity({ value, onChange }) {
  return (
    <div className="join">
      <button type="button" className="btn btn-outline join-item" onClick={() => onChange(Math.max(1, value - 1))}>-</button>
      <input className="input input-bordered w-14 text-center join-item" value={value} onChange={(e)=> onChange(Math.max(1, parseInt(e.target.value||'1',10)||1))} />
      <button type="button" className="btn btn-outline join-item" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  // UI state
  const [activeIdx, setActiveIdx] = useState(0);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [username, setUsername] = useState('');

  const addToCart = useCart((s)=> s.add);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setError('');
      try {
        const p = await getProduct(id);
        if (ignore) return;
        setProduct(p);
        setActiveIdx(0);
        setColor(Array.isArray(p?.colors) && p.colors[0] ? p.colors[0] : '');
        setSize(Array.isArray(p?.sizes) && p.sizes[0] ? p.sizes[0] : '');
        // related
        const all = await getProducts();
        if (!ignore) setRelated(all.filter((x)=> String(x.id) !== String(id)).slice(0, 8));
      } catch (e) {
        if (!ignore) setError(e.message || 'Erreur');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const images = useMemo(() => {
    const arr = Array.isArray(product?.images) && product.images.length ? product.images : [product?.image].filter(Boolean);
    return arr;
  }, [product]);


  const breadcrumb = (
    <nav className="text-sm breadcrumbs">
      <ul>
        <li><Link to="/">الرئيسية</Link></li>
        {product?.category && <li>{product.category}</li>}
        <li className="opacity-70">{product?.name}</li>
      </ul>
    </nav>
  );

  const onConfirm = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !wilaya) {
      alert('الرجاء إدخال الاسم ورقم الهاتف والولاية');
      return;
    }
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          qty, color, size,
          customer_name: fullName,
          phone, wilaya, commune, username,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert('تم إرسال طلبك بنجاح!');
    } catch (err) {
      alert('تعذر إرسال الطلب: ' + (err.message || ''));
    }
  };

  const waUrl = useMemo(() => {
    const phoneDz = getWhatsAppDigits();
    const lines = [
      `السلام عليكم! أريد طلب المنتج: ${product?.name}`,
      `السعر: ${formatDZD(product?.price)}`,
      color ? `اللون: ${color}` : '',
      size ? `المقاس: ${size}` : '',
      `الكمية: ${qty}`,
      fullName ? `الاسم: ${fullName}` : '',
      phone ? `الهاتف: ${phone}` : '',
      wilaya ? `الولاية: ${wilaya}` : '',
      commune ? `البلدية: ${commune}` : '',
      username ? `المعرف: ${username}` : '',
    ].filter(Boolean).join('\n');
    return `https://wa.me/${phoneDz}?text=${encodeURIComponent(lines)}`;
  }, [product, color, size, qty, fullName, phone, wilaya, commune, username]);

  if (loading) return <div className="skeleton h-80" />;
  if (error) return <div className="alert alert-error"><span>{error}</span></div>;
  if (!product) return <div className="alert"><span>المنتج غير موجود.</span></div>;

  return (
    <div className="space-y-6 bg-white">
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl font-bold text-blue-600">{formatDZD(product.price)}</div>
        </div>
        
        {/* Product image for mobile */}
        <div className="px-4 mb-6">
          <div className="rounded-md overflow-hidden border border-gray-200 bg-white">
            <img src={images[activeIdx]} alt={product.name} className="w-full h-auto object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button key={i} onClick={()=>setActiveIdx(i)} className={`h-16 aspect-square border ${i===activeIdx?'border-primary':'border-gray-200'} overflow-hidden rounded`}>
                  <img src={src} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Form box for mobile */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6 mx-4">
          <div className="text-center font-medium mb-4">أضف معلوماتك في الأسفل لطلب هذا المنتج</div>
          <form className="space-y-3" onSubmit={onConfirm}>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" 
              placeholder="الاسم بالكامل" 
              value={fullName} 
              onChange={(e)=>setFullName(e.target.value)} 
            />
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" 
              placeholder="رقم الهاتف" 
              value={phone} 
              onChange={(e)=>setPhone(e.target.value)} 
            />
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black" 
              value={wilaya} 
              onChange={(e)=>setWilaya(e.target.value)}
            >
              <option value="" className="text-gray-500">الولاية</option>
              {WILAYAS.map((w)=> <option key={w} value={w}>{w}</option>)}
            </select>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" 
              placeholder="البلدية" 
              value={commune} 
              onChange={(e)=>setCommune(e.target.value)} 
            />
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" 
              placeholder="Username(Facebook,Instagram)" 
              value={username} 
              onChange={(e)=>setUsername(e.target.value)} 
            />
            
            {/* Size and Color options for mobile */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div>
                <div className="mb-2 font-medium text-center">اللون</div>
                <div className="flex justify-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`btn btn-sm ${color === c ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div>
                <div className="mb-2 font-medium text-center">المقاس</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`btn btn-sm ${size === s ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="flex justify-center items-center gap-3 my-4">
              <button 
                type="button" 
                className="w-12 h-12 border border-gray-300 rounded flex items-center justify-center text-lg font-bold bg-white"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                -
              </button>
              <input 
                className="w-16 h-12 text-center border border-gray-300 rounded font-bold bg-white" 
                value={qty} 
                onChange={(e)=> setQty(Math.max(1, parseInt(e.target.value||'1',10)||1))} 
              />
              <button 
                type="button" 
                className="w-12 h-12 border border-gray-300 rounded flex items-center justify-center text-lg font-bold bg-white"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">انقر هنا لتأكيد الطلب</button>
              <button type="button" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg" onClick={()=>addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, qty, color, size })}>إضافة للسلة</button>
              <a href={waUrl} target="_blank" rel="noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg block text-center">أنقر هنا للطلب عبر الواتساب</a>
            </div>
          </form>
        </div>

        {/* Related products for mobile */}
        <section className="mt-8 px-4">
          <h2 className="text-xl font-bold mb-4 text-center">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 gap-4">
            {related.slice(0, 2).map((p)=> <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        {breadcrumb}
        <div className="h-px bg-gray-300 my-4" />

        <div className="grid grid-cols-2 gap-10">
          {/* Form section - left */}
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-center">{product.name}</h1>
            <div className="text-2xl font-bold text-center">{formatDZD(product.price)}</div>

            {/* Form box for desktop */}
            <div className="border border-gray-300 rounded-lg p-6">
              <div className="text-center font-medium mb-4">أضف معلوماتك في الأسفل لطلب هذا المنتج</div>
              <form className="space-y-3" onSubmit={onConfirm}>
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" placeholder="الاسم بالكامل" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
                  <input className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" placeholder="رقم الهاتف" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black" value={wilaya} onChange={(e)=>setWilaya(e.target.value)}>
                    <option value="" className="text-gray-500">الولاية</option>
                    {WILAYAS.map((w)=> <option key={w} value={w}>{w}</option>)}
                  </select>
                  <input className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" placeholder="البلدية" value={commune} onChange={(e)=>setCommune(e.target.value)} />
                </div>
                <input className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500" placeholder="Username(Facebook,Instagram)" value={username} onChange={(e)=>setUsername(e.target.value)} />
                
                {/* Size and Color options for desktop */}
                {Array.isArray(product.colors) && product.colors.length > 0 && (
                  <div>
                    <div className="mb-2 font-medium text-center">اللون</div>
                    <div className="flex justify-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`btn btn-sm ${color === c ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                  <div>
                    <div className="mb-2 font-medium text-center">المقاس</div>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`btn btn-sm ${size === s ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center items-center gap-3">
                  <Quantity value={qty} onChange={setQty} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">انقر هنا لتأكيد الطلب</button>
                  <button type="button" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg" onClick={()=>addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, qty, color, size })}>إضافة للسلة</button>
                </div>
                <div className="text-center">
                  <a href={waUrl} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full inline-block">أنقر هنا للطلب عبر الواتساب</a>
                </div>
              </form>
            </div>
          </div>

          {/* Gallery - right */}
          <div>
            <div className="rounded-md overflow-hidden border border-gray-200 bg-white max-w-md">
              <img src={images[activeIdx]} alt={product.name} className="w-full h-auto object-cover max-h-96" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto max-w-md">
                {images.map((src, i) => (
                  <button key={i} onClick={()=>setActiveIdx(i)} className={`h-16 aspect-square border ${i===activeIdx?'border-primary':'border-gray-200'} overflow-hidden rounded`}>
                    <img src={src} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products for desktop */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p)=> <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
