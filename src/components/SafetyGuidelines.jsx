import React from "react";
import { ShieldAlert, FlameKindling, Info, Baby, Wind, HelpCircle, CheckCircle2 } from "lucide-react";

const SafetyGuidelines = () => {
  const guidelines = [
    {
      icon: <Wind className="text-blue-500" />,
      title: "Open Space Only",
      desc: "Always light crackers in open areas. Keep away from buildings, dry grass, or flammable materials."
    },
    {
      icon: <Baby className="text-orange-500" />,
      title: "Adult Supervision",
      desc: "Children should never handle crackers alone. An adult must always be present to supervise."
    },
    {
      icon: <FlameKindling className="text-red-500" />,
      title: "Safe Distance",
      desc: "Maintain at least 5 meters distance after lighting. Never try to re-light a dud or failed cracker."
    },
    {
      icon: <ShieldAlert className="text-emerald-500" />,
      title: "Water Ready",
      desc: "Always keep a bucket of water or sand nearby for emergencies and to soak used sparklers."
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Header --- */}
      <div className="bg-slate-900 py-20 text-center px-6">
        <h4 className="text-orange-500 font-black tracking-[0.4em] uppercase mb-4 text-xs">Security Protocol</h4>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          Safety <span className="text-[#1E60F2]">Guidelines</span>
        </h1>
        <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-sm">
          At Himalaya Crackers, your celebration is our priority, but your safety is our responsibility. 
          Please follow these professional protocols.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* --- Main Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {guidelines.map((item, index) => (
            <div key={index} className="p-8 border border-slate-100 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- Detailed Dos & Don'ts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* DO'S */}
          <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100">
            <div className="flex items-center gap-4 mb-8">
              <CheckCircle2 className="text-emerald-600" size={32} />
              <h2 className="text-2xl font-black uppercase text-emerald-900">What To Do</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Store crackers in a cool, dry place inside a wooden or tin box.",
                "Use a long incense stick (agarbatti) to light crackers from a distance.",
                "Wear cotton clothes while lighting fireworks. Avoid synthetic fabrics.",
                "Discard used sparklers/fireworks in a bucket of water immediately."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-emerald-800 text-sm font-medium">
                  <span className="font-bold">0{i+1}.</span> {text}
                </li>
              ))}
            </ul>
          </div>

          {/* DON'TS */}
          <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100">
            <div className="flex items-center gap-4 mb-8">
              <ShieldAlert className="text-red-600" size={32} />
              <h2 className="text-2xl font-black uppercase text-red-900">What Not To Do</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Never light crackers while holding them in your hand.",
                "Don't light crackers inside the house or on balconies.",
                "Never keep extra crackers in your pocket while lighting others.",
                "Don't use matches or lighters; they require you to get too close."
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-red-800 text-sm font-medium">
                  <span className="font-bold text-red-400">✕</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Emergency Section --- */}
        <div className="mt-20 p-10 bg-[#1E60F2] rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-full">
              <Info size={40} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic">Emergency First Aid</h3>
              <p className="text-blue-100 text-sm mt-1">In case of minor burns, wash with cold water immediately. Do not apply creams.</p>
            </div>
          </div>
          <button className="bg-white text-[#1E60F2] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">
            Find Nearest Hospital
          </button>
        </div>

      </div>
    </div>
  );
};

export default SafetyGuidelines;