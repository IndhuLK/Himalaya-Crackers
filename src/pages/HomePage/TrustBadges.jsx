import React from 'react';
import { ShieldCheck, Leaf, BadgeCheck, Zap } from 'lucide-react';

const badges = [
  {
    id: 1,
    title: '100% Quality Assured',
    desc: 'Every product is tested for premium quality and safety.',
    icon: BadgeCheck,
    color: 'text-[#1E60F2]',
    bg: 'bg-blue-50',
    border: 'group-hover:border-[#1E60F2]',
  },
  {
    id: 2,
    title: 'Safety First',
    desc: 'Rigorous safety checks to ensure family-friendly fun.',
    icon: ShieldCheck,
    color: 'text-[#F2A31E]',
    bg: 'bg-orange-50',
    border: 'group-hover:border-[#F2A31E]',
  },
  {
    id: 3,
    title: 'Eco-Friendly',
    desc: 'Government approved Green Crackers with less smoke.',
    icon: Leaf,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'group-hover:border-green-600',
  },
  {
    id: 4,
    title: 'Direct Factory Price',
    desc: 'No middlemen. You get the best Sivakasi prices.',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'group-hover:border-purple-600',
  },
];

const TrustBadges = () => {
  return (
    <section className="py-16 bg-white font-poppins relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Why Choose <span className="text-[#1E60F2]">Himalaya?</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#F2A31E] to-[#1E60F2] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {badges.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`group p-5 md:p-6 rounded-2xl bg-white border border-slate-100 ${item.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`w-12 h-12 mx-auto flex items-center justify-center rounded-xl ${item.bg} ${item.color} mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1.5 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-center text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
