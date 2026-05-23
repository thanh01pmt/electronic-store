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

const FEATURES = [
  { title: 'Chính hãng 100%', desc: 'Nhập khẩu trực tiếp từ NSX, đầy đủ CoC, datasheet gốc và chứng từ xuất xứ minh bạch.' },
  { title: 'Kho lớn – Giao nhanh', desc: 'Hơn 50.000 SKU sẵn kho, đáp ứng từ prototype vài chục pcs đến đơn công nghiệp hàng nghìn pcs.' },
  { title: 'Hỗ trợ kỹ thuật', desc: 'Đội kỹ sư tư vấn cross-reference, lựa chọn linh kiện thay thế và review BOM cho dự án.' },
  { title: 'Báo giá linh hoạt', desc: 'RFQ nhanh trong 2 giờ, giá theo bậc số lượng, hợp đồng khung dài hạn cho đối tác B2B.' },
];

const SOLUTIONS = ['SMT / EMS', 'Automation', 'Embedded Systems', 'Hardware Startup', 'Dealer & Reseller'];

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

export function WhyVichip() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
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
  );
}
