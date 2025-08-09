import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../store/cart';

function MobileMenu({ open, onClose, q, setQ, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] rtl">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 bottom-0 right-0 w-80 max-w-[90vw] bg-white shadow-2xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold">القائمة</div>
          <button onClick={onClose} aria-label="إغلاق" className="btn btn-ghost btn-circle text-xl">×</button>
        </div>
        <form onSubmit={onSubmit} className="mb-4">
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            <input value={q} onChange={(e)=>setQ(e.target.value)} type="text" className="grow" placeholder="ما الذي تبحث عنه؟" />
          </label>
        </form>
        <nav className="menu text-black">
          <ul className="menu w-full">
            <li><Link to="/" onClick={onClose}>الرئيسية</Link></li>
            <li><Link to="#" onClick={onClose}>اتصل بنا</Link></li>
            <li><Link to="#" onClick={onClose}>الشحن والتسليم</Link></li>
            <li><Link to="#" onClick={onClose}>طرق الدفع</Link></li>
            <li><Link to="#" onClick={onClose}>سياسة الإرجاع</Link></li>
            <li><Link to="#" onClick={onClose}>خدمة الزبائن</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

function NavBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [open, setOpen] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = q ? `/?q=${encodeURIComponent(q)}` : '/';
    setOpen(false);
    navigate(next);
  };

  const count = items.reduce((a,b)=> a + (b.qty||1), 0);

  return (
    <header className="bg-white border-b border-base-200 sticky top-0 z-50 rtl text-black w-full">
      {/* Full-width bar with padding only */}
      <div className="w-full px-4 md:px-6">
        <div className="grid grid-cols-3 items-center min-h-[72px]">
          {/* Left: Menu button (mobile) */}
          <div className="justify-self-start md:hidden">
            <button className="btn btn-ghost btn-circle" onClick={()=>setOpen(true)} aria-label="القائمة">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
          </div>

          {/* Left: Search (desktop only) */}
          <div className="hidden md:block">
            <form onSubmit={onSubmit} className="max-w-2xl">
              <label className="input input-bordered flex items-center gap-2 w-full bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                <input value={q} onChange={(e)=>setQ(e.target.value)} type="text" className="grow" placeholder="ما الذي تبحث عنه؟" />
              </label>
            </form>
          </div>

          {/* Center: Logo */}
          <div className="justify-self-center">
            <Link to="/" className="inline-flex items-center gap-2 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2a2 2 0 0 0-2 2 1 1 0 1 0 2 0 .5.5 0 0 1 1 0c0 .356-.19.682-.5.862L6 8v2l6-3.5L18 10V8l-4.5-2.7A2.5 2.5 0 0 0 13 4a2 2 0 0 0-2-2Z"/><path d="M3 12.75A2.75 2.75 0 0 1 5.75 10h12.5A2.75 2.75 0 0 1 21 12.75v.5a1.75 1.75 0 0 1-1.75 1.75H4.75A1.75 1.75 0 0 1 3 13.25v-.5Z"/></svg>
              <span className="font-extrabold tracking-wide">Dripdrop.dz</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="justify-self-end flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="btn btn-ghost btn-circle text-black">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386a1.125 1.125 0 0 1 1.026.684l.383.957m0 0L7.5 12.75m-2.455-8.109h13.424c.977 0 1.69.95 1.39 1.886l-1.59 5.024a1.875 1.875 0 0 1-1.79 1.314H8.25m-3.205-8.224L7.5 12.75m0 0L6 15.75m1.5-3 7.177.018M6 19.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm12-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" /></svg>
                <span className="badge badge-sm indicator-item bg-red-600 text-white">{count}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-2 text-sm font-medium text-black">
          <Link className="hover:text-red-600" to="/">الرئيسية</Link>
          <Link className="hover:text-red-600" to="#">اتصل بنا</Link>
          <Link className="hover:text-red-600" to="#">الشحن والتسليم</Link>
          <Link className="hover:text-red-600" to="#">طرق الدفع</Link>
          <Link className="hover:text-red-600" to="#">سياسة الإرجاع</Link>
          <Link className="hover:text-red-600" to="#">خدمة الزبائن</Link>
        </nav>
      </div>
      <MobileMenu open={open} onClose={()=>setOpen(false)} q={q} setQ={setQ} onSubmit={onSubmit} />
    </header>
  );
}

export default NavBar;
