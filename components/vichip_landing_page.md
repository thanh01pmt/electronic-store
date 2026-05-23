import React from "react";
import { Search, Send, Box, ShieldCheck, Truck, Headphones, Building2, Cpu, Zap, Radio, Cable, Cog, Layers, Factory, ArrowRight, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "IC", desc: "Integrated Circuits", icon: Cpu },
  { name: "MCU", desc: "Microcontrollers", icon: Layers },
  { name: "Power", desc: "Power Management", icon: Zap },
  { name: "Sensor", desc: "Sensors & Modules", icon: Radio },
  { name: "Connector", desc: "Industrial Connectors", icon: Cable },
  { name: "Relay", desc: "Control Relays", icon: Box },
  { name: "Automation", desc: "Industrial Automation", icon: Cog },
  { name: "Embedded", desc: "Embedded Solutions", icon: Cpu },
];

const benefits = [
  { title: "100% Authentic", desc: "Official components from trusted global manufacturers.", icon: ShieldCheck },
  { title: "Wide Product Range", desc: "IC, MCU, Power, Sensor, Connector, Relay and more.", icon: Box },
  { title: "Fast Delivery", desc: "Strong inventory and efficient supply chain across Vietnam.", icon: Truck },
  { title: "Technical Support", desc: "Experienced team supporting engineers and purchasers.", icon: Headphones },
  { title: "Scale With Confidence", desc: "From prototype to mass production for EMS and startups.", icon: Building2 },
];

const brands = ["ST", "Texas Instruments", "Infineon", "NXP", "Microchip", "MPS"];

export default function VichipLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Cpu size={25} />
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight text-white"><span className="text-emerald-400">VI</span>CHIP</div>
              <div className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.45em] text-white/80">Electronics</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/90 lg:flex">
            <a href="#products">Products</a>
            <a href="#brands">Manufacturers</a>
            <a href="#solutions">Solutions</a>
            <a href="#about">About Us</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Search className="text-white" size={21} />
            <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-slate-950">Contact Us</Button>
            <Button className="bg-emerald-500 text-white hover:bg-emerald-600">Request RFQ</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 pt-32 text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute right-[-10%] top-[15%] h-[580px] w-[580px] rounded-full bg-emerald-500 blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[20%] h-[360px] w-[360px] rounded-full bg-emerald-700 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.96)_0%,rgba(15,23,42,.75)_45%,rgba(15,23,42,.35)_100%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #22c55e 1px, transparent 0)", backgroundSize: "34px 34px" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-24 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              <CheckCircle2 size={16} /> Official Industrial Electronics Distributor
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Trusted Components. <span className="text-emerald-400">Scalable Supply.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">
              VICHIP Electronics supplies authentic IC, MCU, Power, Sensor, Connector, Relay, Industrial Automation and Embedded components for EMS, hardware startups and industrial manufacturers.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button size="lg" className="h-14 rounded-xl bg-emerald-500 px-7 text-base font-bold hover:bg-emerald-600">
                <Send className="mr-2" size={18} /> Request RFQ
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-xl border-white/30 bg-transparent px-7 text-base font-bold text-white hover:bg-white hover:text-slate-950">
                Browse Products
              </Button>
            </div>

            <div id="brands" className="mt-14 flex flex-wrap items-center gap-x-9 gap-y-4 text-lg font-black text-white/75">
              {brands.map((brand) => <span key={brand}>{brand}</span>)}
              <a className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-400" href="#products">View all brands <ArrowRight size={16} /></a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-[2rem] bg-emerald-500/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-emerald-400/20 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
              <div className="mx-auto flex aspect-square max-w-md items-center justify-center rounded-[2rem] border border-emerald-400/30 bg-slate-950/80">
                <div className="relative h-52 w-52 rounded-3xl border-4 border-emerald-400 bg-slate-900 shadow-[0_0_70px_rgba(34,197,94,.45)]">
                  <Cpu className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={96} />
                  <div className="absolute -left-24 top-1/2 h-1 w-24 bg-emerald-400" />
                  <div className="absolute -right-24 top-1/2 h-1 w-24 bg-emerald-400" />
                  <div className="absolute -top-24 left-1/2 h-24 w-1 bg-emerald-400" />
                  <div className="absolute -bottom-24 left-1/2 h-24 w-1 bg-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-14 px-6">
        <div className="mx-auto grid max-w-7xl gap-0 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl md:grid-cols-5">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`border-white/10 p-6 text-white ${index !== 0 ? "md:border-l" : ""}`}>
                <Icon className="mb-4 text-emerald-400" size={34} />
                <h3 className="font-black uppercase tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="font-black uppercase tracking-wider text-emerald-600">Product Categories</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Everything You Need. <span className="text-emerald-600">All in One Place.</span></h2>
            <div className="mt-10 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <a key={cat.name} className="group border-b border-r border-slate-200 p-7 transition hover:bg-emerald-50" href="#">
                    <Icon className="text-emerald-600 transition group-hover:scale-110" size={42} />
                    <h3 className="mt-5 font-black uppercase">{cat.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{cat.desc}</p>
                    <ArrowRight className="mt-5 text-slate-400 group-hover:text-emerald-600" size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <Card className="rounded-3xl border-0 shadow-xl">
            <CardContent className="grid h-full grid-cols-2 gap-0 p-0">
              {[
                ["50K+", "Products in stock"],
                ["200+", "Global brands"],
                ["1000+", "Happy customers"],
                ["24h", "Fast shipping"]
              ].map(([num, label], idx) => (
                <div key={label} className={`flex flex-col items-center justify-center p-8 text-center ${idx < 2 ? "border-b" : ""} ${idx % 2 === 0 ? "border-r" : ""}`}>
                  <div className="text-4xl font-black text-emerald-600">{num}</div>
                  <div className="mt-2 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="solutions" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-black uppercase tracking-wider text-emerald-600">Solutions</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Built for EMS, startups and industrial teams.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["EMS & SMT Supply", "Stable sourcing for production lines, BOM fulfillment and replacement parts."],
              ["Hardware Startup Support", "From prototype sourcing to scalable production supply."],
              ["Industrial Automation", "Components for control systems, sensors, relays and embedded control."]
            ].map(([title, desc]) => (
              <Card key={title} className="rounded-3xl border-0 shadow-lg">
                <CardContent className="p-8">
                  <Factory className="text-emerald-600" size={42} />
                  <h3 className="mt-6 text-2xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="font-black uppercase tracking-wider text-emerald-600">Why VICHIP</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Authentic components for modern manufacturing.</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            VICHIP Electronics combines industrial supply capability with dynamic tech energy. We help purchasing teams, engineers and founders source reliable components faster and scale production with confidence.
          </p>
          <div className="mt-8 space-y-4">
            {["Official product sourcing", "Strong focus on MCU, Power and Embedded", "Technical support for engineering teams", "Fast RFQ response and logistics coordination"].map((text) => (
              <div key={text} className="flex items-center gap-3 font-semibold"><CheckCircle2 className="text-emerald-600" size={22} /> {text}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-black">Request a quotation</h3>
          <p className="mt-2 text-slate-300">Send your BOM or product requirement. Our team will respond quickly.</p>
          <div className="mt-8 grid gap-4">
            <input className="h-13 rounded-xl border border-white/10 bg-white/10 px-4 py-4 outline-none placeholder:text-slate-400" placeholder="Your name" />
            <input className="h-13 rounded-xl border border-white/10 bg-white/10 px-4 py-4 outline-none placeholder:text-slate-400" placeholder="Company email" />
            <textarea className="min-h-32 rounded-xl border border-white/10 bg-white/10 px-4 py-4 outline-none placeholder:text-slate-400" placeholder="Tell us what components you need" />
            <Button className="h-14 rounded-xl bg-emerald-500 text-base font-bold hover:bg-emerald-600">Submit RFQ</Button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <div className="text-3xl font-black"><span className="text-emerald-400">VI</span>CHIP</div>
            <p className="mt-3 max-w-sm text-slate-400">Trusted Components. Scalable Supply.</p>
          </div>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-center gap-3"><Phone size={18} className="text-emerald-400" /> +84 982 295 846</div>
            <div className="flex items-center gap-3"><Mail size={18} className="text-emerald-400" /> sales@vichip.com</div>
            <div className="flex items-center gap-3"><MapPin size={18} className="text-emerald-400" /> Ho Chi Minh City, Vietnam</div>
          </div>
          <div className="text-sm text-slate-500 md:text-right">© 2026 VICHIP Electronics. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
