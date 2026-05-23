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

interface RFQForm {
  name: string;
  company: string;
  phone: string;
  email: string;
  partNumber: string;
  quantity: string;
  note: string;
}

const defaultForm: RFQForm = { name: '', company: '', phone: '', email: '', partNumber: '', quantity: '', note: '' };

export function RfqSection() {
  const [form, setForm] = useState<RFQForm>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RFQ Submitted:', form);
    setSubmitted(true);
    setForm(defaultForm);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const input: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)', color: '#fff',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };

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
  );
}
