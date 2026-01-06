import React from "react";
import { RefreshCcw, XCircle, AlertTriangle, Truck, CheckCircle2, CreditCard } from "lucide-react";

const RefundPolicy = () => {
  const highlightPoints = [
    {
      icon: <XCircle className="text-red-500" />,
      title: "24-Hour Window",
      desc: "Cancellations are only accepted within 24 hours of placing the order."
    },
    {
      icon: <Truck className="text-[#1E60F2]" />,
      title: "No Returns",
      desc: "Due to safety and explosive transport laws, we cannot accept returns once delivered."
    },
    {
      icon: <RefreshCcw className="text-emerald-500" />,
      title: "Easy Refunds",
      desc: "Refunds for cancelled orders are processed back to the original payment source."
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Header --- */}
      <div className="bg-slate-50 py-20 text-center px-6 border-b border-slate-100">
        <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-6">
          <RefreshCcw className="text-orange-500" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
          Refund & <span className="text-[#1E60F2]">Cancellation</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm font-medium">
          Transparent policies for a worry-free celebration. Please read our terms regarding order modifications.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* --- Quick Overview Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {highlightPoints.map((item, index) => (
            <div key={index} className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-sm font-black uppercase mb-2 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* --- Detailed Policy Sections --- */}
        <div className="space-y-16">
          
          {/* Cancellation Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Cancellation <span className="text-red-600">Policy</span></h2>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Orders can be cancelled <strong>only within 24 hours</strong> of placement or before the status is marked as "Dispatched," whichever is earlier.
              </p>
              <div className="flex items-start gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <AlertTriangle size={14} className="text-orange-500 shrink-0" />
                <span>Once the shipment leaves our Sivakasi warehouse, no cancellations will be entertained.</span>
              </div>
            </div>
          </section>

          {/* Refund Section */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#1E60F2] text-white rounded-xl flex items-center justify-center font-bold">2</div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Refund <span className="text-[#1E60F2]">Process</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  Approved refunds will be credited to your original payment method (Bank Account/UPI/Wallet) within <strong>5-7 working days</strong>.
                </p>
                <div className="flex items-center gap-2 text-[#1E60F2]">
                  <CreditCard size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Zero Cancellation Fees</span>
                </div>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="text-emerald-900 font-black text-xs uppercase mb-3">Damaged Products</h4>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  In case of receiving damp or damaged crackers, please send an unboxing video to our WhatsApp within 24 hours of delivery to claim a partial refund or replacement.
                </p>
              </div>
            </div>
          </section>

          {/* Return Section */}
          <section className="bg-slate-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase italic mb-4">No Return Policy</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                Fireworks are classified as "Class 1 Explosives." Under the Indian Explosives Act, 
                re-shipping of these items by unauthorized individuals is illegal. Therefore, we do 
                not accept physical returns of products once they are delivered.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <CheckCircle2 className="text-orange-500" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safety Compliance Guaranteed</span>
              </div>
            </div>
            <Truck className="absolute -bottom-10 -right-10 text-white/5 size-64" />
          </section>

        </div>

        {/* --- Contact Support Footer --- */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Need help with an order?</p>
          <button 
            onClick={() => window.open('https://wa.me/919876543210', '_blank')}
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#1E60F2] transition-all cursor-pointer shadow-xl">
            Contact Billing Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;