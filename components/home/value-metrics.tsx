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

export function ValueMetrics() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TRUST_STATS.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border transition-all duration-200 hover:shadow-md"
            style={{ 
              background: C.light, 
              borderColor: 'rgba(0,0,0,0.06)' 
            }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: C.green, fontFamily: 'var(--font-exo2, sans-serif)' }}>
              {stat.value}
            </div>
            <div className="text-sm font-bold" style={{ color: C.black }}>{stat.label}</div>
            <div className="text-xs mt-1" style={{ color: C.gray }}>{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
