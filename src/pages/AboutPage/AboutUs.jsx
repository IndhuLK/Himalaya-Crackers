import React from 'react';
import {
  ShieldCheck,
  Leaf,
  Star,
  Award,
  CheckCircle2,
  Package,
  Globe,
  Sparkles,
  Rocket,
  BadgeCheck,
} from 'lucide-react';

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    desc: 'Strict storage, packing, and quality checks before every dispatch.',
    tone: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Leaf,
    title: 'Eco Friendly',
    desc: 'Low-noise and reduced-smoke options for responsible celebrations.',
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    desc: 'Carefully sourced products with dependable performance and finish.',
    tone: 'bg-orange-50 text-orange-500',
  },
  {
    icon: Star,
    title: 'Trusted Service',
    desc: 'A familiar name for families, festive orders, and repeat buyers.',
    tone: 'bg-slate-100 text-slate-700',
  },
];

const offerings = [
  'Family Combos',
  'Kids Safe Range',
  'Sparklers',
  'Aerial Shots',
  'Event Specials',
  'Festival Packs',
];

const AboutUs = () => {
  return (
    <section className="bg-white font-poppins text-slate-900 overflow-hidden">
      <div className="relative isolate bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_48%,#f97316_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-18 md:pt-28 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/90 mb-6">
                <Sparkles size={14} className="text-orange-300" />
                Since 1998
              </div>
              <h1 className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98] mb-6">
                Built on trust, packed for celebration.
              </h1>
              <p className="max-w-2xl text-base md:text-lg leading-8 text-white/78">
                Himalaya Crackers brings together quality, safety, and festive
                value so families can celebrate with confidence. From classic
                sparklers to premium event specials, every order is handled with
                care.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60 mb-3">
                  Experience
                </p>
                <p className="text-3xl font-black">25+</p>
                <p className="text-sm text-white/70 mt-1">
                  Years serving festive orders
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/60 mb-3">
                  Focus
                </p>
                <p className="text-3xl font-black">100%</p>
                <p className="text-sm text-white/70 mt-1">
                  Safety and quality minded
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <BadgeCheck size={18} className="text-orange-300" />
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">
                    What customers expect from us
                  </p>
                </div>
                <p className="text-sm md:text-base leading-7 text-white/82">
                  Reliable festive stock, responsible product selection, and a
                  service approach that stays practical and transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 space-y-16 md:space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-start">
          <div className="rounded-4xl border border-slate-200 bg-slate-50 p-7 md:p-10 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-orange-400" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Our Mission
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-5">
              Celebrate better, not louder.
            </h2>
            <p className="text-slate-600 leading-8 mb-8 max-w-2xl">
              We aim to deliver high-quality fireworks that feel festive,
              dependable, and responsibly chosen. That means balancing visual
              impact, safety standards, pricing clarity, and eco-conscious
              options wherever practical.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Deliver premium-quality crackers',
                'Follow strict safety standards',
                'Promote eco-conscious celebrations',
                'Keep value and transparency intact',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm"
                >
                  <CheckCircle2
                    size={18}
                    className="text-blue-600 mt-0.5 shrink-0"
                  />
                  <span className="text-sm font-semibold text-slate-700 leading-6">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.5)]"
                >
                  <div
                    className={`mb-5 inline-flex rounded-2xl p-3 ${pillar.tone}`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-7 md:p-10 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500 mb-3">
                Our Offering
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                A range built for family orders and festive events.
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <Rocket size={14} className="text-blue-600" />
              Festival Ready
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {offerings.map((product) => (
              <div
                key={product}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 transition-colors hover:bg-slate-900 hover:text-white"
              >
                {product}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="relative overflow-hidden rounded-4xl bg-slate-950 p-8 md:p-10 text-white">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="relative z-10">
              <ShieldCheck className="text-orange-400 mb-5" size={34} />
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
                Safety commitment
              </h3>
              <p className="text-sm md:text-base leading-8 text-slate-300 mb-6 max-w-xl">
                We prioritize compliant storage, careful packing, and dependable
                handling so customers receive products that are ready for safe
                festive use.
              </p>
              <div className="space-y-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                <p>Certified storage</p>
                <p>Proper packaging</p>
                <p>Tested formulas</p>
              </div>
            </div>
            <Globe
              className="absolute -bottom-12 -right-12 text-white/5"
              size={180}
            />
          </div>

          <div className="relative overflow-hidden rounded-4xl bg-[linear-gradient(135deg,#1e3a8a_0%,#2563eb_48%,#f97316_100%)] p-8 md:p-10 text-white">
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <Leaf className="text-orange-300 mb-5" size={34} />
              <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
                Eco initiative
              </h3>
              <p className="text-sm md:text-base leading-8 text-white/82 mb-6 max-w-xl">
                We support better celebrations through low-noise selections and
                reduced-smoke options that align with more responsible festive
                use.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em]">
                <Package size={14} />
                Responsible Manufacturing
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-slate-50 border border-slate-200 px-6 py-10 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-7">
            Why customers stay with Himalaya
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              'Trusted Brand',
              'Wide Range',
              'Safe and Certified',
              'Reliable Support',
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl bg-white border border-slate-200 px-4 py-5 shadow-sm"
              >
                <CheckCircle2
                  className="mx-auto text-orange-500 mb-3"
                  size={18}
                />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600 leading-6">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
