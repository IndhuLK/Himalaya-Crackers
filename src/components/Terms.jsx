import React from "react";
import { Gavel, AlertCircle, ShoppingBag, Truck, CheckSquare, Scale } from "lucide-react";

const TermsAndConditions = () => {
  const sections = [
    {
      icon: <CheckSquare className="text-[#1E60F2]" />,
      title: "Agreement to Terms",
      content: "By accessing this website and placing an order with Himalaya Crackers, you agree to be bound by these Terms and Conditions and all applicable laws in India."
    },
    {
      icon: <AlertCircle className="text-orange-500" />,
      title: "Age Restriction",
      content: "You must be at least 18 years of age to purchase any products from this site. By placing an order, you verify that you meet this legal age requirement."
    },
    {
      icon: <ShoppingBag className="text-emerald-500" />,
      title: "Product Representation",
      content: "While we strive for 100% accuracy, actual product packaging may vary slightly from website images. The chemical performance remains as per safety standards."
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Header --- */}
      <div className="bg-slate-900 py-24 text-center px-6 border-b-4 border-[#1E60F2]">
        <div className="inline-block p-3 bg-white/5 rounded-2xl mb-6">
          <Scale className="text-orange-500" size={36} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          Terms & <span className="text-[#1E60F2]">Conditions</span>
        </h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm font-bold tracking-[0.2em] uppercase">
          Legal Framework & Usage Policy
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* --- Highlighted Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {sections.map((section, index) => (
            <div key={index} className="p-8 border border-slate-100 rounded-3xl bg-slate-50 flex flex-col items-center text-center">
              <div className="mb-4">{section.icon}</div>
              <h3 className="text-sm font-black uppercase mb-3">{section.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* --- Detailed Clauses --- */}
        <div className="space-y-12">
          <section className="border-l-4 border-[#1E60F2] pl-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              1. Orders and Pricing
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Himalaya Crackers reserves the right to cancel any order if the product is out of stock or due to pricing errors. 
              All prices are inclusive of GST as per Indian Government norms. Prices are subject to change during peak 
              festival seasons (Diwali) without prior notice.
            </p>
          </section>

          <section className="border-l-4 border-orange-500 pl-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              2. Shipping and Delivery
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fireworks are categorized as "Hazardous Goods" and cannot be shipped via Air. 
              All deliveries are made via Surface Transport. Himalaya Crackers is not responsible for 
              delays caused by transport strikes, regional lockdowns, or weather conditions.
            </p>
          </section>

          <section className="border-l-4 border-slate-900 pl-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              3. Safety Disclaimer
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed italic">
              "The use of fireworks is at the customer's own risk." 
              Himalaya Crackers shall not be liable for any injury, damage, or loss resulting from 
              the misuse or negligent handling of our products. Please read the Safety Guidelines provided 
              on the box.
            </p>
          </section>

          <section className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              4. Governing Law
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              These terms are governed by the laws of India. Any disputes arising from transactions on this 
              website shall be subject to the exclusive jurisdiction of the courts in <strong>Sivakasi/Virudhunagar</strong>, 
              Tamil Nadu.
            </p>
          </section>
        </div>

        {/* --- Acknowledgement Footer --- */}
        <div className="mt-20 p-8 bg-[#1E60F2]/5 rounded-2xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            By proceeding with a purchase, you acknowledge you have read and accepted these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;