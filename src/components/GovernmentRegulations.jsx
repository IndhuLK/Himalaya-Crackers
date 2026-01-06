import React from "react";
import { Scale, FileText, Gavel, ShieldCheck, Landmark, AlertTriangle, FileCheck } from "lucide-react";

const GovernmentRegulations = () => {
  const laws = [
    {
      icon: <Scale className="text-blue-600" />,
      title: "Explosives Act, 1884",
      desc: "All our manufacturing and storage processes comply strictly with the primary Indian Explosives Act and the Explosive Rules, 2008."
    },
    {
      icon: <FileText className="text-orange-600" />,
      title: "PESO Guidelines",
      desc: "Our facility is regulated by the Petroleum and Explosives Safety Organization (PESO), ensuring maximum safety in firework handling."
    },
    {
      icon: <Gavel className="text-slate-800" />,
      title: "Supreme Court Orders",
      desc: "We strictly enforce the ban on joined crackers (Saravedi) and harmful chemicals like Barium Nitrate as per SC directives."
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Legal Header --- */}
      <div className="bg-[#1e293b] py-24 text-center px-6 border-b-8 border-orange-500">
        <h4 className="text-[#1E60F2] font-black tracking-[0.4em] uppercase mb-4 text-xs">Statutory Compliance</h4>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          Government <span className="text-orange-500">Regulations</span>
        </h1>
        <p className="text-slate-400 mt-6 max-w-3xl mx-auto text-sm leading-relaxed uppercase tracking-widest font-bold">
          Authorized Manufacturing & Distribution License Holder
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* --- Key Regulatory Pillars --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {laws.map((law, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="p-6 bg-slate-50 rounded-full mb-6 border border-slate-100">
                {law.icon}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-slate-900">{law.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{law.desc}</p>
            </div>
          ))}
        </div>

        {/* --- Detailed Legal Requirements --- */}
        <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-200">
          <div className="flex items-center gap-4 mb-12">
            <Landmark className="text-[#1E60F2]" size={32} />
            <h2 className="text-3xl font-black uppercase tracking-tighter">Operational <span className="text-[#1E60F2]">Mandates</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Age & Sale Restriction */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-orange-500" size={20} />
                <h4 className="font-black uppercase text-sm tracking-widest">Sale to Minors</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                As per the Explosives Rules, sale of fireworks to children below 18 years of age is strictly prohibited. Age verification may be requested during bulk delivery.
              </p>
            </div>

            {/* Storage & Licensing */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="text-emerald-500" size={20} />
                <h4 className="font-black uppercase text-sm tracking-widest">Licensing & Storage</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                We maintain a valid PESO license for permanent storage. For bulk buyers, temporary 
                storage licenses from local district authorities are required for quantities exceeding 100kg.
              </p>
            </div>

            {/* Packaging Standards */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-blue-500" size={20} />
                <h4 className="font-black uppercase text-sm tracking-widest">Marking & Labeling</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every package contains detailed instructions in English, Hindi, and Tamil, including the 
                manufacturing date, expiry details, and chemical composition as per PESO norms.
              </p>
            </div>

            {/* Noise Level Standards */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-purple-500" size={20} />
                <h4 className="font-black uppercase text-sm tracking-widest">Noise Pollution Norms</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Firecrackers are manufactured to ensure that noise levels do not exceed 125 dB(AI) 
                or 145 dB(C)pk at 4 meters distance from the point of bursting.
              </p>
            </div>
          </div>
        </div>

        {/* --- Official Logo Section --- */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="text-center font-black text-xs uppercase tracking-[0.3em]">Make In India</div>
           <div className="text-center font-black text-xs uppercase tracking-[0.3em]">PESO Authorized</div>
           <div className="text-center font-black text-xs uppercase tracking-[0.3em]">CSIR-NEERI Approved</div>
        </div>

      </div>
    </div>
  );
};

export default GovernmentRegulations;