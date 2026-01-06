import React from "react";
import { Leaf, ShieldCheck, Wind, Zap, CheckCircle, Droplets, Info } from "lucide-react";

const GreenPolicy = () => {
  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Header Section --- */}
      <div className="bg-[#064E3B] py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
           <Leaf size={200} className="text-white" />
        </div>
        <h4 className="text-emerald-400 font-black tracking-[0.4em] uppercase mb-4 text-xs">Eco-Friendly Initiative</h4>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          Green <span className="text-orange-400">Crackers</span> Policy
        </h1>
        <p className="text-emerald-100 mt-6 max-w-2xl mx-auto text-sm leading-relaxed">
          Himalaya Crackers is committed to the Supreme Court's vision. We exclusively 
          manufacture and supply "Green Crackers" developed by CSIR-NEERI.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* --- What are Green Crackers? --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-slate-900">
              Understanding <span className="text-emerald-600">Eco-Innovation</span>
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Green crackers are low-emission fireworks that do not contain harmful chemicals like 
              Barium Nitrate, Lead, or Mercury. They are designed to reduce air pollution and noise 
              while maintaining the festive spirit.
            </p>
            <div className="space-y-4">
              {[
                "30% reduction in particulate matter (PM10 & PM2.5)",
                "Zero usage of Barium Nitrate (The main pollutant)",
                "Reduced sound levels (110-125 decibels max)",
                "CSIR-NEERI Certified QR Code on every box"
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500" size={18} />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-center">
             <div className="inline-block p-6 bg-white rounded-full shadow-xl mb-6">
                <ShieldCheck size={48} className="text-[#1E60F2]" />
             </div>
             <h3 className="text-xl font-black uppercase mb-4">NEERI Certified</h3>
             <p className="text-slate-500 text-sm italic">
                All our products carry the official QR code which can be scanned to verify 
                authenticity and chemical composition.
             </p>
          </div>
        </div>

        {/* --- The Three Categories --- */}
        <div className="mb-24">
          <h2 className="text-center text-3xl font-black uppercase tracking-tighter mb-16">
            Our <span className="text-emerald-600">Technology</span> Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-emerald-50 rounded-3xl border border-emerald-100 group hover:bg-emerald-600 hover:text-white transition-all duration-500">
               <Droplets className="mb-6 text-emerald-600 group-hover:text-white" size={40} />
               <h3 className="text-xl font-black uppercase mb-4">SWAS</h3>
               <p className="text-sm opacity-80 leading-relaxed italic">Safe Water Releaser. Releases water vapour to suppress dust and particulate matter.</p>
            </div>
            <div className="p-10 bg-blue-50 rounded-3xl border border-blue-100 group hover:bg-[#1E60F2] hover:text-white transition-all duration-500">
               <Wind className="mb-6 text-[#1E60F2] group-hover:text-white" size={40} />
               <h3 className="text-xl font-black uppercase mb-4">STAR</h3>
               <p className="text-sm opacity-80 leading-relaxed italic">Safe Thermite Cracker. Eliminates usage of Potassium Nitrate and Sulfur.</p>
            </div>
            <div className="p-10 bg-orange-50 rounded-3xl border border-orange-100 group hover:bg-orange-500 hover:text-white transition-all duration-500">
               <Zap className="mb-6 text-orange-600 group-hover:text-white" size={40} />
               <h3 className="text-xl font-black uppercase mb-4">SAFAL</h3>
               <p className="text-sm opacity-80 leading-relaxed italic">Safe Minimal Aluminium. Low usage of aluminium to reduce brightness-related smoke.</p>
            </div>
          </div>
        </div>

        {/* --- Government Compliance Notice --- */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-6">Government <span className="text-emerald-400">Compliance</span></h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                In accordance with the Honorable Supreme Court of India's orders, Himalaya Crackers 
                strictly adheres to the manufacturing protocols for Green Fireworks. We do not 
                manufacture or sell "Joined Crackers" (Saravedi) or use prohibited chemicals.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <Info size={14} /> Official Manufacturing License: SIV-2024-XXX
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
               <div className="w-32 h-32 border-4 border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-black text-xs text-center p-4">
                  100% LEGAL & CERTIFIED
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GreenPolicy;