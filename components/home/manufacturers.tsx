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

const MANUFACTURERS = [
  'Texas Instruments', 'STMicroelectronics', 'NXP Semiconductors',
  'Renesas Electronics', 'Infineon Technologies', 'Microchip Technology',
  'Espressif Systems', 'Nordic Semiconductor', 'Allegro MicroSystems',
  'Toshiba Electronic', 'Vishay Intertechnology', 'Murata Manufacturing',
];

function SectionHeading({ title, subtitle, center = false }: { title: string; subtitle?: string; center?: boolean }) {
  return (
    <div style={{ textAlign: center ? 'center' : undefined }}>
      <div className="flex items-center gap-3 mb-3" style={{ justifyContent: center ? 'center' : undefined }}>
        <span className="block h-px w-8" style={{ background: C.green }} />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.green }}>VICHIP Electronics</span>
        <span className="block h-px w-8" style={{ background: C.green }} />
      </div>
      <h2
        className="text-3xl font-bold leading-tight mb-3"
        style={{ color: C.black, fontFamily: 'var(--font-exo2, sans-serif)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm leading-relaxed" style={{ color: C.gray, maxWidth: center ? 520 : undefined, margin: center ? '0 auto' : undefined }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Manufacturers() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ background: C.light }}>
      <div className="text-center mb-12">
        <SectionHeading
          title="Nhà sản xuất toàn cầu"
          subtitle="Đại lý ủy quyền và phân phối chính hãng từ các thương hiệu điện tử hàng đầu thế giới."
          center
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {MANUFACTURERS.map((brand) => (
          <div
            key={brand}
            className="bg-white rounded-lg border flex items-center justify-center p-4 text-center transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
            style={{ borderColor: 'rgba(0,0,0,0.07)', minHeight: 60 }}
          >
            <span className="text-xs font-semibold" style={{ color: C.gray }}>{brand}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs mt-5" style={{ color: C.gray }}>
        + hơn 200 thương hiệu khác trong danh mục phân phối của VICHIP
      </p>
    </section>
  );
}
