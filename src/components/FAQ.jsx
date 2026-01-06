import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, Truck, ShieldCheck, CreditCard, Package } from 'lucide-react';

const FAQ = () => {
  const [activeTab, setActiveTab] = useState(0);

  const faqData = [
    {
      category: "Ordering & Delivery",
      icon: <Truck size={20} />,
      questions: [
        {
          q: "How do I place an order?",
          a: "You can browse our products online and add them to your cart. Once you're ready, proceed to checkout. For bulk or corporate orders, please use our 'Bulk Enquiry' form to get special wholesale pricing."
        },
        {
          q: "Do you ship across India?",
          a: "Yes! We ship to almost all major cities across India through specialized chemical-safe transport carriers. Shipping timelines usually vary between 5-9 days depending on your location."
        },
        {
          q: "Is there a minimum order value?",
          a: "To ensure safe and economical transport from Sivakasi, we usually have a minimum order value of ₹3,000 for retail home delivery."
        }
      ]
    },
    {
      category: "Safety & Quality",
      icon: <ShieldCheck size={20} />,
      questions: [
        {
          q: "Are your crackers 100% Green Crackers?",
          a: "Absolutely. All our products are manufactured as per CSIR-NEERI guidelines. You will find a QR code on every box to verify the green cracker certification."
        },
        {
          q: "Do you sell joined crackers (Saravedi)?",
          a: "No. In compliance with the Supreme Court's order, we do not manufacture or sell joined crackers. We only offer eco-friendly single-burst and aerial crackers."
        }
      ]
    },
    {
      category: "Payments & Refunds",
      icon: <CreditCard size={20} />,
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major UPI apps (GPay, PhonePe), Credit/Debit cards, and Net Banking through our secure payment gateway."
        },
        {
          q: "Can I cancel my order?",
          a: "Orders can be cancelled within 24 hours of placement. However, once the products have been dispatched from our Sivakasi warehouse, we cannot accept cancellations due to the specialized nature of firework transport."
        }
      ]
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen pb-20">
      {/* --- Header --- */}
      <div className="bg-[#1E60F2] py-24 text-center px-6">
        <h4 className="text-orange-400 font-black tracking-[0.4em] uppercase mb-4 text-xs">Support Center</h4>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
          Common <span className="text-slate-900">Questions</span>
        </h1>
        <p className="text-blue-100 mt-6 max-w-2xl mx-auto text-sm">
          Everything you need to know about Himalaya Crackers, shipping, and safety protocols.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
          {faqData.map((section, sIdx) => (
            <div key={sIdx} className="border-b border-slate-100 last:border-0">
              {/* Category Header */}
              <div className="bg-slate-50 px-8 py-4 flex items-center gap-3">
                <span className="text-[#1E60F2]">{section.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{section.category}</span>
              </div>

              {/* Questions */}
              {section.questions.map((faq, fIdx) => {
                const globalIdx = `${sIdx}-${fIdx}`;
                const isOpen = activeTab === globalIdx;

                return (
                  <div key={fIdx} className="border-b border-slate-50 last:border-0">
                    <button
                      onClick={() => setActiveTab(isOpen ? null : globalIdx)}
                      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                      {isOpen ? <Minus size={18} className="text-orange-500" /> : <Plus size={18} className="text-[#1E60F2]" />}
                    </button>
                    
                    <div className={`px-8 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                      <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-orange-500 pl-4">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* --- Still Have Questions? --- */}
        <div className="mt-16 text-center bg-slate-50 rounded-[2rem] p-10 border border-dashed border-slate-200">
          <HelpCircle className="mx-auto text-[#1E60F2] mb-4" size={40} />
          <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-6">If you cannot find an answer in our FAQ, you can always contact us.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
               onClick={() => window.open('https://wa.me/919876543210', '_blank')}
               className="bg-[#1E60F2] text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all cursor-pointer">
              WhatsApp Us
            </button>
            <button className="bg-white border border-slate-200 text-slate-900 px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;