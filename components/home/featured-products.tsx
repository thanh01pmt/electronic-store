"use client";

import React, { useState } from "react";

const C = {
  green: '#00A651',
  dark: '#006B3F',
  accent: '#7ED957',
  black: '#1E1E1E',
  gray: '#5C6770',
  light: '#F3F5F7',
  white: '#FFFFFF',
} as const;

interface Product {
  id: string;
  partNumber: string;
  description: string;
  manufacturer: string;
  package: string;
  stock: number;
  price: string;
  isNew: boolean;
  isRoHS: boolean;
}

const PRODUCTS: Product[] = [
  { id: '1', partNumber: 'STM32F103C8T6', description: 'ARM Cortex-M3 MCU, 72MHz, 64KB Flash, 20KB RAM', manufacturer: 'STMicroelectronics', package: 'LQFP-48', stock: 2400, price: '45.000', isNew: false, isRoHS: true },
  { id: '2', partNumber: 'LM2596S-5.0', description: 'SIMPLE SWITCHER Power Converter, 150kHz, 3A Step-Down', manufacturer: 'Texas Instruments', package: 'D2PAK-5', stock: 850, price: '18.500', isNew: false, isRoHS: true },
  { id: '3', partNumber: 'ESP32-WROOM-32E', description: 'Wi-Fi + BT + BLE MCU Module, 240MHz Dual-core, 4MB Flash', manufacturer: 'Espressif Systems', package: 'Module', stock: 1200, price: '95.000', isNew: true, isRoHS: true },
  { id: '4', partNumber: 'TLP521-4GB', description: 'Optocoupler 4-Channel, Transistor Output, 80mA', manufacturer: 'Toshiba Electronic', package: 'DIP-16', stock: 3600, price: '12.000', isNew: false, isRoHS: true },
  { id: '5', partNumber: 'ACS712ELCTR-20A', description: 'Hall-Effect Linear Current Sensor, ±20A range, SOIC-8', manufacturer: 'Allegro MicroSystems', package: 'SOIC-8', stock: 480, price: '38.000', isNew: false, isRoHS: true },
  { id: '6', partNumber: 'NRF24L01+T', description: '2.4GHz RF Transceiver, -100dBm RX sensitivity, 2Mbps', manufacturer: 'Nordic Semiconductor', package: 'QFN-20', stock: 920, price: '22.000', isNew: true, isRoHS: true },
];

const svgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function IconCheck() { return <svg viewBox="0 0 20 20" width="16" height="16" {...svgProps} strokeWidth={2}><path d="M4 10l4 4 8-8" /></svg> }

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

function Badge({ label, variant = 'default' }: { label: string; variant?: 'green' | 'blue' | 'amber' | 'red' | 'default' }) {
  const styles: Record<string, React.CSSProperties> = {
    green: { background: `${C.green}18`, color: C.dark },
    blue: { background: '#3B8BD418', color: '#185FA5' },
    amber: { background: '#EF9F2718', color: '#854F0B' },
    red: { background: '#E24B4A15', color: '#A32D2D' },
    default: { background: 'rgba(0,0,0,0.06)', color: C.gray },
  };
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded"
      style={styles[variant]}
    >
      {label}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const stockVariant = product.stock > 1000 ? 'green' : product.stock > 0 ? 'amber' : 'red';
  const stockLabel = product.stock > 0 ? `${product.stock.toLocaleString()} sẵn kho` : 'Hết hàng';

  return (
    <div
      className="bg-white rounded-xl border flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
      style={{ borderColor: 'rgba(0,0,0,0.08)' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ background: C.light, borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-bold text-sm leading-tight" style={{ color: C.black, fontFamily: 'var(--font-exo2, sans-serif)' }}>
            {product.partNumber}
          </p>
          <div className="flex gap-1 flex-shrink-0">
            {product.isNew && <Badge label="New" variant="blue" />}
            {product.isRoHS && <Badge label="RoHS" variant="green" />}
          </div>
        </div>
        <p className="text-xs font-medium" style={{ color: C.gray }}>{product.manufacturer}</p>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: C.gray }}>{product.description}</p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge label={product.package} />
          <Badge label={stockLabel} variant={stockVariant} />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold" style={{ color: C.black }}>{product.price}₫</p>
            <p className="text-xs" style={{ color: C.gray }}>/ cái (1–99 pcs)</p>
          </div>
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000) }}
            className="px-3 py-1.5 rounded text-xs font-semibold transition-all hover:brightness-110 active:scale-[.97] flex items-center gap-1.5"
            style={{ background: added ? C.dark : C.green, color: C.white }}
          >
            {added ? <><IconCheck /> Đã thêm</> : 'Thêm RFQ'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
        <SectionHeading
          title="Sản phẩm nổi bật"
          subtitle="Linh kiện được đặt hàng nhiều nhất, luôn sẵn kho với giá cạnh tranh."
        />
        <a href="/products" className="text-sm font-medium hover:underline flex-shrink-0" style={{ color: C.green }}>
          Xem tất cả →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
