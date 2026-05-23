"use client";

import React from "react";

const C = {
  green: '#00A651',
  dark: '#006B3F',
  accent: '#7ED957',
  black: '#1E1E1E',
  gray: '#5C6770',
  light: '#F3F5F7',
  white: '#FFFFFF',
} as const;

const TRUST_STATS = [
  { value: '100%', label: 'Chính hãng', sub: 'Từ NSX toàn cầu' },
  { value: '50K+', label: 'SKU sẵn kho', sub: 'Giao ngay hôm nay' },
  { value: '24h', label: 'Giao hàng', sub: 'Toàn quốc' },
  { value: '10+', label: 'Năm kinh nghiệm', sub: 'Phân phối linh kiện' },
];



export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: C.black }}>

      {/* PCB grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${C.green}55 1px, transparent 1px), linear-gradient(90deg, ${C.green}55 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Circuit trace SVG */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="pcb" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M20 120h80v-50h60v50h80" fill="none" stroke={C.green} strokeWidth="1.5" />
              <path d="M0 180h60v-40h120v40h60" fill="none" stroke={C.green} strokeWidth="1.5" />
              <path d="M60 0v60h40v60h-40v120" fill="none" stroke={C.green} strokeWidth="1.5" />
              <circle cx="100" cy="70" r="4" fill={C.green} />
              <circle cx="160" cy="180" r="4" fill={C.green} />
              <circle cx="60" cy="120" r="3" fill={C.green} />
              <circle cx="200" cy="60" r="3" fill={C.green} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pcb)" />
        </svg>
      </div>

      {/* Glow blob */}
      <div
        className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${C.green}22 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 w-full">
        <div className="max-w-3xl">

          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold mb-7 border"
            style={{ borderColor: `${C.green}45`, background: `${C.green}12`, color: C.accent }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} />
            Official Components Distributor · Vietnam
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6 text-white"
            style={{ fontFamily: 'var(--font-exo2, sans-serif)' }}
          >
            Reliable<br />
            Components.{' '}
            <span className="block" style={{ color: C.green }}>Powering Innovation.</span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Phân phối chính hãng IC, MCU, Power, Sensor, Connector và linh kiện công nghiệp từ hơn 200 thương hiệu toàn cầu hàng đầu.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-16">
            <a
              href="#rfq"
              className="px-6 py-3 rounded font-semibold text-sm transition-all hover:brightness-110 active:scale-[.97]"
              style={{ background: C.green, color: C.white }}
            >
              Yêu cầu báo giá (RFQ)
            </a>
            <a
              href="/products"
              className="px-6 py-3 rounded font-semibold text-sm border transition-all hover:bg-white/10 text-white"
              style={{ borderColor: 'rgba(255,255,255,0.22)' }}
            >
              Xem danh mục sản phẩm →
            </a>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="text-2xl font-bold mb-0.5" style={{ color: C.green, fontFamily: 'var(--font-exo2, sans-serif)' }}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white">{stat.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
