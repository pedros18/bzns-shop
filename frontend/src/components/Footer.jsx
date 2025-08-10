import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 footer-dark w-full">
      <div className="w-full px-4 md:px-6 py-12">
        <div className="flex flex-col items-center gap-2 mb-8">
          {/* Simple hanger-like logo */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-90"><path d="M12 2a2 2 0 0 0-2 2 1 1 0 1 0 2 0 .5.5 0 0 1 1 0c0 .356-.19.682-.5.862L6 8v2l6-3.5L18 10V8l-4.5-2.7A2.5 2.5 0 0 0 13 4a2 2 0 0 0-2-2Z"/><path d="M3 12.75A2.75 2.75 0 0 1 5.75 10h12.5A2.75 2.75 0 0 1 21 12.75v.5a1.75 1.75 0 0 1-1.75 1.75H4.75A1.75 1.75 0 0 1 3 13.25v-.5Z"/></svg>
          <div className="text-lg font-bold">BZNS-SHOP</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="space-y-2 text-center md:text-start">
            <div className="text-xl font-extrabold">مرحبًا بكم في BZNS-SHOP!</div>
            <p className="text-white/80">نقدم لكم تجربة تسوق مميزة مع خدمة التوصيل لجميع الولايات والدفع عند الاستلام.</p>
          </div>

          <div className="text-center md:text-start">
            <div className="font-semibold mb-2">عن المتجر</div>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="link link-hover text-white/80">الرئيسية</a></li>
              <li><a href="#" className="link link-hover text-white/80">اتصل بنا</a></li>
              <li><a href="#" className="link link-hover text-white/80">الشحن والتسليم</a></li>
              <li><a href="#" className="link link-hover text-white/80">طرق الدفع</a></li>
            </ul>
          </div>

          <div className="text-center md:text-start">
            <div className="font-semibold mb-2">مواعيد العمل</div>
            <p className="text-white/80">من السبت إلى الخميس من 10:00 صباحًا إلى 22:00 مساءً</p>
            <div className="mt-4 font-semibold">تواصل معنا</div>
            <div className="flex gap-3 justify-center md:justify-start mt-2">
              <a aria-label="Instagram" href="#" className="btn btn-sm btn-circle"></a>
              <a aria-label="TikTok" href="#" className="btn btn-sm btn-circle">🎵</a>
              <a aria-label="Facebook" href="#" className="btn btn-sm btn-circle">f</a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-white/60">© {new Date().getFullYear()} BZNS-SHOP</div>
      </div>
    </footer>
  );
}
