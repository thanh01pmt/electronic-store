/**
 * VICHIP Electronics — Landing Page (All-in-one)
 * Stack: Next.js 14 App Router · TypeScript · Tailwind CSS v3
 *
 * ─── SETUP ──────────────────────────────────────────────────────────────────
 *
 * 1) app/layout.tsx — thêm Google Fonts:
 *    import { Exo_2, Inter } from 'next/font/google'
 *    const exo2 = Exo_2({ subsets: ['latin'], weight: ['600','700'], variable: '--font-exo2' })
 *    const inter = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-inter' })
 *    <body className={`${exo2.variable} ${inter.variable} font-inter`}>
 *
 * 2) tailwind.config.js — thêm brand colors & fonts:
 *    theme: { extend: {
 *      colors: { vichip: { green:'#00A651', dark:'#006B3F', accent:'#7ED957',
 *                          black:'#1E1E1E', gray:'#5C6770', light:'#F3F5F7' } },
 *      fontFamily: { exo2:['var(--font-exo2)'], inter:['var(--font-inter)'] }
 *    }}
 *
 * 3) Dùng file này như page component:
 *    // app/page.tsx
 *    export { default } from '@/components/VichipLandingPage'
 */

'use client'

import React, { useState, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  green: '#00A651',
  dark: '#006B3F',
  accent: '#7ED957',
  black: '#1E1E1E',
  gray: '#5C6770',
  light: '#F3F5F7',
  white: '#FFFFFF',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  partNumber: string
  description: string
  manufacturer: string
  package: string
  stock: number
  price: string
  isNew: boolean
  isRoHS: boolean
}

interface RFQForm {
  name: string
  company: string
  phone: string
  email: string
  partNumber: string
  quantity: string
  note: string
}

interface Category {
  id: string
  name: string
  count: number
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'ic', name: 'IC & Logic', count: 12840 },
  { id: 'mcu', name: 'MCU', count: 3200 },
  { id: 'power', name: 'Power', count: 5670 },
  { id: 'sensor', name: 'Sensor', count: 2100 },
  { id: 'connector', name: 'Connector', count: 8900 },
  { id: 'relay', name: 'Relay', count: 1450 },
  { id: 'automation', name: 'Ind. Automation', count: 3800 },
  { id: 'embedded', name: 'Embedded', count: 960 },
]

const PRODUCTS: Product[] = [
  { id: '1', partNumber: 'STM32F103C8T6', description: 'ARM Cortex-M3 MCU, 72MHz, 64KB Flash, 20KB RAM', manufacturer: 'STMicroelectronics', package: 'LQFP-48', stock: 2400, price: '45.000', isNew: false, isRoHS: true },
  { id: '2', partNumber: 'LM2596S-5.0', description: 'SIMPLE SWITCHER Power Converter, 150kHz, 3A Step-Down', manufacturer: 'Texas Instruments', package: 'D2PAK-5', stock: 850, price: '18.500', isNew: false, isRoHS: true },
  { id: '3', partNumber: 'ESP32-WROOM-32E', description: 'Wi-Fi + BT + BLE MCU Module, 240MHz Dual-core, 4MB Flash', manufacturer: 'Espressif Systems', package: 'Module', stock: 1200, price: '95.000', isNew: true, isRoHS: true },
  { id: '4', partNumber: 'TLP521-4GB', description: 'Optocoupler 4-Channel, Transistor Output, 80mA', manufacturer: 'Toshiba Electronic', package: 'DIP-16', stock: 3600, price: '12.000', isNew: false, isRoHS: true },
  { id: '5', partNumber: 'ACS712ELCTR-20A', description: 'Hall-Effect Linear Current Sensor, ±20A range, SOIC-8', manufacturer: 'Allegro MicroSystems', package: 'SOIC-8', stock: 480, price: '38.000', isNew: false, isRoHS: true },
  { id: '6', partNumber: 'NRF24L01+T', description: '2.4GHz RF Transceiver, -100dBm RX sensitivity, 2Mbps', manufacturer: 'Nordic Semiconductor', package: 'QFN-20', stock: 920, price: '22.000', isNew: true, isRoHS: true },
]

const MANUFACTURERS = [
  'Texas Instruments', 'STMicroelectronics', 'NXP Semiconductors',
  'Renesas Electronics', 'Infineon Technologies', 'Microchip Technology',
  'Espressif Systems', 'Nordic Semiconductor', 'Allegro MicroSystems',
  'Toshiba Electronic', 'Vishay Intertechnology', 'Murata Manufacturing',
]

const TRUST_STATS = [
  { value: '100%', label: 'Chính hãng', sub: 'Từ NSX toàn cầu' },
  { value: '50K+', label: 'SKU sẵn kho', sub: 'Giao ngay hôm nay' },
  { value: '24h', label: 'Giao hàng', sub: 'Toàn quốc' },
  { value: '10+', label: 'Năm kinh nghiệm', sub: 'Phân phối linh kiện' },
]

const FEATURES = [
  { title: 'Chính hãng 100%', desc: 'Nhập khẩu trực tiếp từ NSX, đầy đủ CoC, datasheet gốc và chứng từ xuất xứ minh bạch.' },
  { title: 'Kho lớn – Giao nhanh', desc: 'Hơn 50.000 SKU sẵn kho, đáp ứng từ prototype vài chục pcs đến đơn công nghiệp hàng nghìn pcs.' },
  { title: 'Hỗ trợ kỹ thuật', desc: 'Đội kỹ sư tư vấn cross-reference, lựa chọn linh kiện thay thế và review BOM cho dự án.' },
  { title: 'Báo giá linh hoạt', desc: 'RFQ nhanh trong 2 giờ, giá theo bậc số lượng, hợp đồng khung dài hạn cho đối tác B2B.' },
]

const SOLUTIONS = ['SMT / EMS', 'Automation', 'Embedded Systems', 'Hardware Startup', 'Dealer & Reseller']

const FOOTER_LINKS = {
  'Sản phẩm': ['IC & Logic', 'MCU & Vi điều khiển', 'Power & Nguồn', 'Sensor & Cảm biến', 'Connector', 'Relay & Switch', 'Industrial Automation'],
  'Giải pháp': ['SMT / EMS Manufacturing', 'Industrial Automation', 'Embedded Systems', 'Hardware Startup', 'Dealer & Reseller', 'Semiconductor Solutions'],
  'Tài nguyên': ['Tra cứu linh kiện', 'RFQ / Báo giá', 'Tài liệu kỹ thuật', 'Cross Reference', 'Về VICHIP', 'Chính sách bảo hành', 'Liên hệ'],
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS  (line-based, 1.5px stroke, no fill)
// ─────────────────────────────────────────────────────────────────────────────

const svgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function IconIC() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="8" y="8" width="16" height="16" rx="2" /><line x1="8" y1="12" x2="4" y2="12" /><line x1="8" y1="16" x2="4" y2="16" /><line x1="8" y1="20" x2="4" y2="20" /><line x1="24" y1="12" x2="28" y2="12" /><line x1="24" y1="16" x2="28" y2="16" /><line x1="24" y1="20" x2="28" y2="20" /><line x1="12" y1="8" x2="12" y2="4" /><line x1="20" y1="8" x2="20" y2="4" /><line x1="12" y1="24" x2="12" y2="28" /><line x1="20" y1="24" x2="20" y2="28" /><rect x="11" y="11" width="10" height="10" rx="1" /></svg> }
function IconMCU() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="6" y="6" width="20" height="20" rx="3" /><rect x="10" y="10" width="12" height="12" rx="1" /><circle cx="13" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="13" cy="19" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="19" r="1" fill="currentColor" stroke="none" /></svg> }
function IconPower() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><path d="M13 4 7 18h8l-2 10 12-16h-9l3-8z" /></svg> }
function IconSensor() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><circle cx="16" cy="16" r="3.5" /><path d="M8.5 8.5a10.6 10.6 0 0 0 0 15" /><path d="M23.5 8.5a10.6 10.6 0 0 1 0 15" /><path d="M11.5 11.5a6.4 6.4 0 0 0 0 9" /><path d="M20.5 11.5a6.4 6.4 0 0 1 0 9" /></svg> }
function IconConnector() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="4" y="10" width="8" height="12" rx="2" /><rect x="20" y="10" width="8" height="12" rx="2" /><line x1="12" y1="14" x2="20" y2="14" /><line x1="12" y1="18" x2="20" y2="18" /><line x1="7" y1="10" x2="7" y2="7" /><line x1="25" y1="10" x2="25" y2="7" /><line x1="7" y1="22" x2="7" y2="25" /><line x1="25" y1="22" x2="25" y2="25" /></svg> }
function IconRelay() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="8" y="10" width="16" height="12" rx="2" /><path d="M12 16h3l2-3 2 6 2-3h3" /><line x1="11" y1="6" x2="11" y2="10" /><line x1="21" y1="6" x2="21" y2="10" /><line x1="11" y1="22" x2="11" y2="26" /><line x1="21" y1="22" x2="21" y2="26" /></svg> }
function IconAutomation() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><circle cx="16" cy="16" r="4" /><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" /><line x1="16" y1="4" x2="16" y2="8" /><line x1="16" y1="24" x2="16" y2="28" /><line x1="4" y1="16" x2="8" y2="16" /><line x1="24" y1="16" x2="28" y2="16" /><path d="M7.5 7.5l3 3" /><path d="M21.5 21.5l3 3" /><path d="M7.5 24.5l3-3" /><path d="M21.5 10.5l3-3" /></svg> }
function IconEmbedded() { return <svg viewBox="0 0 32 32" width="26" height="26" {...svgProps}><rect x="4" y="8" width="24" height="16" rx="2" /><rect x="8" y="12" width="6" height="8" rx="1" /><line x1="17" y1="13" x2="23" y2="13" /><line x1="17" y1="16" x2="23" y2="16" /><line x1="17" y1="19" x2="20" y2="19" /></svg> }
function IconSearch() { return <svg viewBox="0 0 20 20" width="18" height="18" {...svgProps}><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5 17 17" /></svg> }
function IconMenu() { return <svg viewBox="0 0 20 20" width="20" height="20" {...svgProps}><path d="M3 6h14M3 10h14M3 14h14" /></svg> }
function IconClose() { return <svg viewBox="0 0 20 20" width="20" height="20" {...svgProps}><path d="M5 5l10 10M15 5 5 15" /></svg> }
function IconCheck() { return <svg viewBox="0 0 20 20" width="16" height="16" {...svgProps} strokeWidth={2}><path d="M4 10l4 4 8-8" /></svg> }

const CAT_ICONS: Record<string, React.ReactNode> = {
  ic: <IconIC />, mcu: <IconMCU />, power: <IconPower />, sensor: <IconSensor />,
  connector: <IconConnector />, relay: <IconRelay />, automation: <IconAutomation />, embedded: <IconEmbedded />,
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

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

function Badge({ label, variant = 'default' }: { label: string; variant?: 'green' | 'blue' | 'amber' | 'red' | 'default' }) {
  const styles: Record<string, React.CSSProperties> = {
    green: { background: `${C.green}18`, color: C.dark },
    blue: { background: '#3B8BD418', color: '#185FA5' },
    amber: { background: '#EF9F2718', color: '#854F0B' },
    red: { background: '#E24B4A15', color: '#A32D2D' },
    default: { background: 'rgba(0,0,0,0.06)', color: C.gray },
  }
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded"
      style={styles[variant]}
    >
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(30,30,30,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded flex items-center justify-center text-white" style={{ background: C.green }}>
              <IconIC />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'var(--font-exo2, sans-serif)' }}>
                VI<span style={{ color: C.accent }}>CHIP</span>
              </p>
              <p className="text-xs tracking-[0.15em]" style={{ color: C.gray }}>ELECTRONICS</p>
            </div>
          </a>

          {/* ── Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {['Sản phẩm', 'Nhà sản xuất', 'Giải pháp', 'Tài nguyên', 'Về chúng tôi'].map((label) => (
              <a
                key={label}
                href="#"
                className="px-3.5 py-2 text-sm rounded transition-colors duration-150 text-white/75 hover:text-white hover:bg-white/10"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* ── Actions */}
          <div className="flex items-center gap-2">
            <button className="text-white/60 hover:text-white transition-colors p-2 rounded hover:bg-white/10">
              <IconSearch />
            </button>
            <a
              href="#rfq"
              className="hidden sm:flex px-4 py-2 text-sm font-semibold rounded transition-all duration-150 hover:brightness-110 active:scale-[.97]"
              style={{ background: C.green, color: C.white }}
            >
              Yêu cầu báo giá
            </a>
            <button
              className="lg:hidden text-white/70 hover:text-white p-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ background: 'rgba(20,20,20,0.98)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {['Sản phẩm', 'Nhà sản xuất', 'Giải pháp', 'Tài nguyên', 'Về chúng tôi'].map((label) => (
              <a
                key={label}
                href="#"
                className="px-3 py-2.5 text-sm rounded text-white/75 hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#rfq"
              className="mt-2 py-2.5 text-sm font-semibold rounded text-center"
              style={{ background: C.green, color: C.white }}
              onClick={() => setMobileOpen(false)}
            >
              Yêu cầu báo giá
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
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
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

function CategoryCard({ cat }: { cat: Category }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={`/products/${cat.id}`}
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

function CategoriesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: C.light }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)

  const stockVariant = product.stock > 1000 ? 'green' : product.stock > 0 ? 'amber' : 'red'
  const stockLabel = product.stock > 0 ? `${product.stock.toLocaleString()} sẵn kho` : 'Hết hàng'

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
  )
}

function FeaturedProductsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
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
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MANUFACTURERS
// ─────────────────────────────────────────────────────────────────────────────

function ManufacturersSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: C.light }}>
      <div className="max-w-7xl mx-auto">
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
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY VICHIP
// ─────────────────────────────────────────────────────────────────────────────

function WhyVichipSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <SectionHeading
              title="Tại sao chọn VICHIP?"
              subtitle="Không chỉ là nhà phân phối — chúng tôi là đối tác kỹ thuật tin cậy cho đội engineering của bạn."
            />
            <div className="mt-10 space-y-6">
              {FEATURES.map((feat, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${C.green}18`, color: C.green }}
                  >
                    <IconCheck />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: C.black }}>{feat.title}</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.gray }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dark card */}
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: C.black }}>
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(${C.green}80 1px, transparent 1px), linear-gradient(90deg, ${C.green}80 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: C.accent }}>
                Trusted Components. Scalable Supply.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: '10+', label: 'Năm kinh nghiệm' },
                  { value: '50K+', label: 'SKU sẵn kho' },
                  { value: '1K+', label: 'Khách hàng B2B' },
                  { value: '200+', label: 'Thương hiệu phân phối' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-lg border"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-3xl font-bold mb-1" style={{ color: C.green, fontFamily: 'var(--font-exo2, sans-serif)' }}>{stat.value}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-medium text-white mb-3">Giải pháp theo ngành</p>
                <div className="flex flex-wrap gap-2">
                  {SOLUTIONS.map((s) => (
                    <span key={s} className="text-xs px-3 py-1 rounded border" style={{ borderColor: `${C.green}45`, color: C.accent, background: `${C.green}12` }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RFQ SECTION
// ─────────────────────────────────────────────────────────────────────────────

const defaultForm: RFQForm = { name: '', company: '', phone: '', email: '', partNumber: '', quantity: '', note: '' }

function RFQSection() {
  const [form, setForm] = useState<RFQForm>(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ⚠ TODO: Replace with your Supabase/API call
    console.log('RFQ:', form)
    setSubmitted(true)
    setForm(defaultForm)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <section id="rfq" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: C.black }}>
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${C.green}80 1px, transparent 1px), linear-gradient(90deg, ${C.green}80 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.accent }}>Request for Quotation</p>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-exo2, sans-serif)' }}>
              Báo giá nhanh —<br />
              <span style={{ color: C.green }}>không cần chờ đợi.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Gửi yêu cầu và đội ngũ VICHIP sẽ phản hồi trong vòng 2 giờ làm việc với thông tin tồn kho, báo giá chính xác và thời gian giao hàng dự kiến.
            </p>
            {[
              { icon: '◈', label: 'Hỗ trợ upload BOM', sub: 'Excel, CSV, PDF' },
              { icon: '→', label: 'Phản hồi trong 2 giờ', sub: 'Trong giờ làm việc' },
              { icon: '✓', label: 'Báo giá kèm CoC', sub: 'Certificate of Conformance' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${C.green}22`, color: C.green }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div
            className="rounded-2xl p-8 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)' }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl" style={{ background: `${C.green}22`, color: C.green }}>
                  ✓
                </div>
                <p className="text-xl font-semibold text-white mb-2">Đã gửi thành công!</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  VICHIP sẽ phản hồi báo giá trong 2 giờ làm việc.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <p className="text-sm font-semibold text-white mb-5">Thông tin liên hệ</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Họ và tên *</span>
                    <input name="name" required value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" style={input} />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Công ty</span>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Công ty ABC" style={input} />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Số điện thoại *</span>
                    <input name="phone" required type="tel" value={form.phone} onChange={handleChange} placeholder="+84 9xx xxx xxx" style={input} />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Email *</span>
                    <input name="email" required type="email" value={form.email} onChange={handleChange} placeholder="email@company.com" style={input} />
                  </label>
                </div>

                <div className="border-t pt-5 mb-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-sm font-semibold text-white mb-4">Thông tin linh kiện</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Part Number *</span>
                      <input name="partNumber" required value={form.partNumber} onChange={handleChange} placeholder="VD: STM32F103C8T6" style={input} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Số lượng *</span>
                      <input name="quantity" required type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="VD: 500" style={input} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-xs font-medium block mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Ghi chú / BOM list</span>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Yêu cầu thêm, deadline cần hàng, hoặc paste toàn bộ BOM tại đây…"
                      style={{ ...input, resize: 'vertical' }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:brightness-110 active:scale-[.97]"
                  style={{ background: C.green, color: C.white }}
                >
                  Gửi yêu cầu báo giá
                </button>
                <p className="text-xs text-center mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Thông tin bảo mật, chỉ dùng cho mục đích báo giá.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
            <div className="space-y-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
                  <li key={link}>
                    <a href="#" className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{link}</a>
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
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function VichipLandingPage() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ManufacturersSection />
      <WhyVichipSection />
      <RFQSection />
      <Footer />
    </main>
  )
}