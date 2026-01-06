import React from "react";
import { ShieldCheck, Leaf, Star, Heart, Award, CheckCircle2, Package, Globe } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="bg-white font-poppins text-slate-900">
      {/* --- Hero Header --- */}
      <div className="relative py-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h4 className="text-[#1E60F2] font-black tracking-[0.4em] uppercase mb-4 text-xs">
            Since 1998
          </h4>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">
            Himalaya <span className="text-orange-500">Crackers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed">
            A trusted name in the fireworks industry, delivering high-quality, safe, 
            and vibrant crackers for your most precious celebrations.
          </p>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-slate-200/30 select-none -z-0 uppercase tracking-tighter">
          Trust
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* --- Mission & Values Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px] bg-orange-500"></div>
              <h2 className="text-2xl font-black uppercase tracking-widest">Our Mission</h2>
            </div>
            <ul className="space-y-6">
              {[
                "Deliver premium-quality crackers",
                "Follow strict safety standards",
                "Promote responsible and eco-conscious celebrations",
                "Provide best value at affordable prices"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 group">
                  <CheckCircle2 className="text-[#1E60F2] mt-1 group-hover:text-orange-500 transition-colors" size={20} />
                  <span className="text-slate-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <ShieldCheck />, title: "Safety First" },
              { icon: <Leaf />, title: "Eco-Friendly" },
              { icon: <Award />, title: "Quality Assured" },
              { icon: <Star />, title: "Top Rated" }
            ].map((val, i) => (
              <div key={i} className="p-8 border border-slate-100 bg-slate-50 rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <div className="mb-4 text-[#1E60F2] group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h3 className="font-bold uppercase tracking-tighter text-sm">{val.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* --- What We Offer - Horizontal Grid --- */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Our Offering</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Family Combos", "Kids Safe", "Sparklers", "Aerial Shots", "Event Specials"
            ].map((product, i) => (
              <div key={i} className="border border-slate-200 p-6 text-center uppercase font-black text-[10px] tracking-[0.2em] hover:bg-[#1E60F2] hover:text-white transition-all cursor-default">
                {product}
              </div>
            ))}
          </div>
        </div>

        {/* --- Commitment Sections --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Safety Card */}
          <div className="p-10 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="text-orange-500 mb-6" size={40} />
              <h3 className="text-2xl font-black uppercase mb-4 italic">Safety Commitment</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                We strictly follow government regulations and conduct rigorous 
                quality checks at every stage.
              </p>
              <div className="space-y-2 text-xs font-bold tracking-widest text-slate-300">
                <p>• CERTIFIED STORAGE</p>
                <p>• PROPER PACKAGING</p>
                <p>• TESTED FORMULAS</p>
              </div>
            </div>
            <Globe className="absolute -bottom-10 -right-10 text-white/5 size-64" />
          </div>

          {/* Eco Card */}
          <div className="p-10 bg-[#1E60F2] text-white rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10">
              <Leaf className="text-orange-400 mb-6" size={40} />
              <h3 className="text-2xl font-black uppercase mb-4 italic">Eco Initiative</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Supporting the nature through low-noise crackers and reduced 
                smoke formulas for a greener tomorrow.
              </p>
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest">
                Responsible Manufacturing
              </div>
            </div>
            <Package className="absolute -bottom-10 -right-10 text-white/5 size-64" />
          </div>
        </div>
      </div>

      {/* --- Trust Footer --- */}
      <div className="py-20 bg-slate-50 text-center border-t border-slate-100">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">
          Why Choose <span className="text-[#1E60F2]">Himalaya?</span>
        </h2>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 px-6">
          {["Trusted Brand", "Wide Range", "Safe & Certified", "Reliable Support"].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="text-orange-500" size={16} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;