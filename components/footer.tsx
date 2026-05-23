"use client";

import React from "react";
import Link from "next/link";


const C = {
  green: '#00A651',
  dark: '#006B3F',
  accent: '#7ED957',
  black: '#1E1E1E',
  gray: '#5C6770',
  light: '#F3F5F7',
  white: '#FFFFFF',
} as const;

const FOOTER_LINKS = {
  'Sản phẩm': [
    { name: 'IC & Logic', href: '/products' },
    { name: 'MCU & Vi điều khiển', href: '/products' },
    { name: 'Power & Nguồn', href: '/products' },
    { name: 'Sensor & Cảm biến', href: '/products' },
    { name: 'Connector', href: '/products' },
    { name: 'Relay & Switch', href: '/products' },
    { name: 'Industrial Automation', href: '/products' },
  ],
  'Giải pháp': [
    { name: 'SMT / EMS Manufacturing', href: '/rigid-pcb-fab' },
    { name: 'Industrial Automation', href: '/pcb-assembly' },
    { name: 'Embedded Systems', href: '/products' },
    { name: 'Hardware Startup', href: '/pcb-tech-capabilities' },
    { name: 'Dealer & Reseller', href: '/contact-us' },
    { name: 'Semiconductor Solutions', href: '/products' },
  ],
  'Tài nguyên': [
    { name: 'Tra cứu linh kiện', href: '/products' },
    { name: 'RFQ / Báo giá', href: '#rfq' },
    { name: 'Tài liệu kỹ thuật', href: '/docs' },
    { name: 'Cross Reference', href: '/products' },
    { name: 'Về VICHIP', href: '/about' },
    { name: 'Chính sách bảo hành', href: '/shipping-and-returns' },
    { name: 'Liên hệ', href: '/contact-us' },
  ],
};

const svgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function IconIC() { 
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}>
      <rect x="8" y="8" width="16" height="16" rx="2" />
      <line x1="8" y1="12" x2="4" y2="12" />
      <line x1="8" y1="16" x2="4" y2="16" />
      <line x1="8" y1="20" x2="4" y2="20" />
      <line x1="24" y1="12" x2="28" y2="12" />
      <line x1="24" y1="16" x2="28" y2="16" />
      <line x1="24" y1="20" x2="28" y2="20" />
      <line x1="12" y1="8" x2="12" y2="4" />
      <line x1="20" y1="8" x2="20" y2="4" />
      <line x1="12" y1="24" x2="12" y2="28" />
      <line x1="20" y1="24" x2="20" y2="28" />
      <rect x="11" y="11" width="10" height="10" rx="1" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded flex items-center justify-center text-white" style={{ background: C.green }}>
                <IconIC />
              </div>
              <div>
                <p className="font-bold text-white leading-none" style={{ fontFamily: 'var(--font-exo2, sans-serif)' }}>
                  VI<span style={{ color: C.accent }}>CHIP</span>
                </p>
                <p className="text-xs tracking-[0.15em]" style={{ color: C.gray }}>ELECTRONICS</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Phân phối linh kiện điện tử công nghiệp chính hãng. Trusted Components. Scalable Supply.
            </p>
            <div className="space-y-1.5 text-xs animate-fade-in" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <p>📍 41 Street 2, Van Phuc Urban Area, Ho Chi Minh City</p>
              <p>📞 +84 982 295 846</p>
              <p>✉ info@vichip.com</p>
              <p>🌐 www.vichip.com</p>
            </div>
          </div>

          {/* Dynamic columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-white mb-4">{heading}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-xs transition-colors hover:text-white" 
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)' }}
        >
          <p>© {new Date().getFullYear()} VICHIP Electronics. All rights reserved.</p>
          <div className="flex gap-5">
            {['Điều khoản sử dụng', 'Chính sách bảo mật', 'Cookies'].map((label) => (
              <a key={label} href="#" className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
