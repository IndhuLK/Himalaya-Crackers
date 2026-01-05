import React from "react";
import { ShieldCheck, Leaf, BadgeCheck, Zap } from "lucide-react";

const badges = [
  {
    id: 1,
    title: "100% Quality Assured",
    desc: "Every product is tested for premium quality and safety.",
    icon: BadgeCheck,
    color: "text-[#1E60F2]",
    bg: "bg-blue-50",
    border: "group-hover:border-[#1E60F2]",
  },
  {
    id: 2,
    title: "Safety First",
    desc: "Rigorous safety checks to ensure family-friendly fun.",
    icon: ShieldCheck,
    color: "text-[#F2A31E]",
    bg: "bg-orange-50",
    border: "group-hover:border-[#F2A31E]",
  },
  {
    id: 3,
    title: "Eco-Friendly",
    desc: "Government approved Green Crackers with less smoke.",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "group-hover:border-green-600",
  },
  {
    id: 4,
    title: "Direct Factory Price",
    desc: "No middlemen. You get the best Sivakasi prices.",
    icon: Zap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "group-hover:border-purple-600",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-20 bg-white font-poppins relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-50 blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Why Choose <span className="text-[#1E60F2]">Himalaya?</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#F2A31E] to-[#1E60F2] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`group p-8 rounded-3xl bg-white border-2 border-transparent ${item.border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className={`w-20 h-20 mx-auto flex items-center justify-center rounded-2xl ${item.bg} ${item.color} mb-6 transition-transform duration-300 group-hover:rotate-6`}>
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-center text-sm leading-relaxed">
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
