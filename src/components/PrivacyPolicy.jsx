import React from "react";
import { Lock, Eye, ShieldCheck, Database, Share2, Bell, FileLock } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <Database className="text-[#1E60F2]" />,
      title: "Data Collection",
      content: "We collect personal information such as your name, mobile number, email, and shipping address when you place an order or fill out an enquiry form. This is used solely for order processing and delivery."
    },
    {
      icon: <Lock className="text-orange-500" />,
      title: "Payment Security",
      content: "Your payment details are processed through encrypted, PCI-compliant payment gateways. Himalaya Crackers never stores your credit card, debit card, or UPI PIN information on our servers."
    },
    {
      icon: <Share2 className="text-emerald-500" />,
      title: "Third-Party Sharing",
      content: "We do not sell or rent your personal information to third parties. We only share data with trusted logistics partners to ensure your fireworks are delivered to your doorstep."
    },
    {
      icon: <Bell className="text-blue-500" />,
      title: "Communications",
      content: "By providing your mobile number, you agree to receive order status updates via SMS or WhatsApp. You can opt-out of marketing messages at any time."
    }
  ];

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* --- Simple Professional Header --- */}
      <div className="bg-slate-50 border-b border-slate-100 py-20 text-center px-6">
        <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
          <FileLock className="text-[#1E60F2]" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
          Privacy <span className="text-[#1E60F2]">Policy</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-sm font-medium">
          Effective Date: January 2026. Your trust is our most valuable asset. 
          Here is how we protect your digital footprint.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* --- Highlighted Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, index) => (
            <div key={index} className="p-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border-l-4 border-l-[#1E60F2]">
              <div className="mb-4">{section.icon}</div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">{section.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* --- Detailed Legal Content --- */}
        <div className="prose prose-slate max-w-none border-t border-slate-100 pt-16">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 mb-4">
                <Eye size={24} className="text-orange-500" /> 1. Use of Cookies
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                We use cookies to enhance your browsing experience, remember your cart items, and understand how you interact with our website. You can choose to disable cookies through your browser settings, but some features of the site may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 mb-4">
                <ShieldCheck size={24} className="text-[#1E60F2]" /> 2. Data Protection
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Himalaya Crackers implements a variety of security measures to maintain the safety of your personal information. We use SSL (Secure Sockets Layer) technology to ensure that your data is transmitted safely across the internet.
              </p>
            </section>

            <section className="bg-slate-900 text-white p-10 rounded-[2.5rem]">
              <h2 className="text-2xl font-black uppercase italic mb-4">3. Your Rights</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                You have the right to request access to the personal data we hold about you, to correct any inaccuracies, or to request the deletion of your data from our records.
              </p>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E60F2]">
                Contact: privacy@himalayacrackers.com
              </div>
            </section>
          </div>
        </div>

        {/* --- Footer Note --- */}
        <div className="mt-20 text-center border-t border-slate-100 pt-10">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
            Himalaya Crackers reserves the right to update this policy. <br />
            Any changes will be posted on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;