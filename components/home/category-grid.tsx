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

interface Category {
  id: string;
  name: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { id: 'ic', name: 'IC & Logic', count: 12840 },
  { id: 'mcu', name: 'MCU', count: 3200 },
  { id: 'power', name: 'Power', count: 5670 },
  { id: 'sensor', name: 'Sensor', count: 2100 },
  { id: 'connector', name: 'Connector', count: 8900 },
  { id: 'relay', name: 'Relay', count: 1450 },
  { id: 'automation', name: 'Ind. Automation', count: 3800 },
  { id: 'embedded', name: 'Embedded', count: 960 },
];

const svgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function IconIC() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="8" y="8" width="16" height="16" rx="2" /><line x1="8" y1="12" x2="4" y2="12" /><line x1="8" y1="16" x2="4" y2="16" /><line x1="8" y1="20" x2="4" y2="20" /><line x1="24" y1="12" x2="28" y2="12" /><line x1="24" y1="16" x2="28" y2="16" /><line x1="24" y1="20" x2="28" y2="20" /><line x1="12" y1="8" x2="12" y2="4" /><line x1="20" y1="8" x2="20" y2="4" /><line x1="12" y1="24" x2="12" y2="28" /><line x1="20" y1="24" x2="20" y2="28" /><rect x="11" y="11" width="10" height="10" rx="1" /></svg> }
function IconMCU() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="6" y="6" width="20" height="20" rx="3" /><rect x="10" y="10" width="12" height="12" rx="1" /><circle cx="13" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="13" cy="19" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="19" r="1" fill="currentColor" stroke="none" /></svg> }
function IconPower() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><path d="M13 4 7 18h8l-2 10 12-16h-9l3-8z" /></svg> }
function IconSensor() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><circle cx="16" cy="16" r="3.5" /><path d="M8.5 8.5a10.6 10.6 0 0 0 0 15" /><path d="M23.5 8.5a10.6 10.6 0 0 1 0 15" /><path d="M11.5 11.5a6.4 6.4 0 0 0 0 9" /><path d="M20.5 11.5a6.4 6.4 0 0 1 0 9" /></svg> }
function IconConnector() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="4" y="10" width="8" height="12" rx="2" /><rect x="20" y="10" width="8" height="12" rx="2" /><line x1="12" y1="14" x2="20" y2="14" /><line x1="12" y1="18" x2="20" y2="18" /><line x1="7" y1="10" x2="7" y2="7" /><line x1="25" y1="10" x2="25" y2="7" /><line x1="7" y1="22" x2="7" y2="25" /><line x1="25" y1="22" x2="25" y2="25" /></svg> }
function IconRelay() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="8" y="10" width="16" height="12" rx="2" /><path d="M12 16h3l2-3 2 6 2-3h3" /><line x1="11" y1="6" x2="11" y2="10" /><line x1="21" y1="6" x2="21" y2="10" /><line x1="11" y1="22" x2="11" y2="26" /><line x1="21" y1="22" x2="21" y2="26" /></svg> }
function IconAutomation() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><circle cx="16" cy="16" r="4" /><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" /><line x1="16" y1="4" x2="16" y2="8" /><line x1="16" y1="24" x2="16" y2="28" /><line x1="4" y1="16" x2="8" y2="16" /><line x1="24" y1="16" x2="28" y2="16" /><path d="M7.5 7.5l3 3" /><path d="M21.5 21.5l3 3" /><path d="M7.5 24.5l3-3" /><path d="M21.5 10.5l3-3" /></svg> }
function IconEmbedded() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="4" y="8" width="24" height="16" rx="2" /><rect x="8" y="12" width="6" height="8" rx="1" /><line x1="17" y1="13" x2="23" y2="13" /><line x1="17" y1="16" x2="23" y2="16" /><line x1="17" y1="19" x2="20" y2="19" /></svg> }

const CAT_ICONS: Record<string, React.ReactNode> = {
  ic: <IconIC />, mcu: <IconMCU />, power: <IconPower />, sensor: <IconSensor />,
  connector: <IconConnector />, relay: <IconRelay />, automation: <IconAutomation />, embedded: <IconEmbedded />,
};

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
  )
}

function CategoryCard({ cat }: { cat: Category }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={`/products/part/result/${encodeURIComponent(cat.id.toUpperCase())}`}
      className="bg-white rounded-xl border flex flex-col items-center text-center p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: 'rgba(0,0,0,0.07)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-200"
        style={{ background: hovered ? C.green : C.light, color: hovered ? C.white : C.gray }}
      >
        {CAT_ICONS[cat.id]}
      </div>
      <p className="font-semibold text-sm mb-1" style={{ color: C.black }}>{cat.name}</p>
      <p className="text-xs" style={{ color: C.gray }}>{cat.count.toLocaleString()} sản phẩm</p>
    </a>
  )
}

export function CategoryGrid() {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: C.light }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeading
            title="Danh mục sản phẩm"
            subtitle="Hơn 50.000 SKU từ IC & MCU đến linh kiện tự động hóa công nghiệp. Tất cả chính hãng, sẵn kho."
            center
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
        </div>
      </div>
    </section>
  )
}
