import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, Smartphone, Mail } from 'lucide-react';

const BulkEnquiryPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailId: '',
    companyName: '',
    orderType: 'Corporate Gifting',
    details: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    const phoneNumber = "919876543210"; // Your brand's WhatsApp number
    
    // Professional message formatting
    const message = `*NEW BULK ENQUIRY - HIMALAYA CRACKERS*%0A%0A` +
      `*Name:* ${formData.fullName}%0A` +
      `*Mobile:* ${formData.mobileNumber}%0A` +
      `*Email:* ${formData.emailId}%0A` +
      `*Company:* ${formData.companyName}%0A` +
      `*Type:* ${formData.orderType}%0A` +
      `*Details:* ${formData.details}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-sm">
        
        {/* Brand Sidebar - Using Himalaya Blue */}
        <div className="bg-[#1E60F2] text-white p-8 md:w-1/3 flex flex-col justify-between">
          <div>
            <div className="mb-8">
               <h3 className="text-sm font-black tracking-[0.2em] uppercase text-orange-400">Himalaya</h3>
               <p className="text-[10px] uppercase tracking-widest text-white/60">Wholesale Desk</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-orange-400 mt-1" />
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest">Support Line</p>
                  <p className="text-sm font-bold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-orange-400 mt-1" />
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest">Official Email</p>
                  <p className="text-sm font-bold">sales@himalaya.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10">
            <p className="text-[8px] text-white/40 leading-relaxed uppercase tracking-widest">
              Premium Festive Solutions for Corporate & Events
            </p>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="p-8 md:w-2/3 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              Bulk <span className="text-[#1E60F2]">Enquiry</span>
            </h2>
            <button onClick={onClose} className="text-slate-300 hover:text-orange-500 transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Name Field */}
              <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-colors">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contact Person</label>
                <input 
                  type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                  className="w-full py-2 outline-none text-sm font-semibold text-slate-800 bg-transparent" 
                  placeholder="Enter full name" 
                />
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-colors">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-slate-300" />
                    <input 
                      type="tel" name="mobileNumber" required value={formData.mobileNumber} onChange={handleChange}
                      className="w-full py-2 outline-none text-sm font-semibold text-slate-800 bg-transparent" 
                      placeholder="98765 00000" 
                    />
                  </div>
                </div>
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-colors">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email ID</label>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-300" />
                    <input 
                      type="email" name="emailId" required value={formData.emailId} onChange={handleChange}
                      className="w-full py-2 outline-none text-sm font-semibold text-slate-800 bg-transparent" 
                      placeholder="name@email.com" 
                    />
                  </div>
                </div>
              </div>

              {/* Company & Type */}
              <div className="grid grid-cols-2 gap-5">
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-colors">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Organization</label>
                  <input 
                    type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                    className="w-full py-2 outline-none text-sm font-semibold text-slate-800 bg-transparent" 
                    placeholder="Company name" 
                  />
                </div>
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-colors">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Enquiry Type</label>
                  <select 
                    name="orderType" value={formData.orderType} onChange={handleChange}
                    className="w-full py-2 outline-none text-sm font-semibold text-slate-800 bg-transparent"
                  >
                    <option>Corporate Gifting</option>
                    <option>Event/Wedding</option>
                    <option>Wholesale/B2B</option>
                  </select>
                </div>
              </div>

              {/* Details Field */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Requirements</label>
                <textarea 
                  name="details" required value={formData.details} onChange={handleChange}
                  className="w-full border border-slate-100 bg-slate-50 p-3 outline-none text-sm font-medium h-20 focus:ring-1 ring-[#1E60F2] transition-all" 
                  placeholder="Tell us about your requirements..." 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1E60F2] text-white py-4 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-blue-200">
              <MessageSquare size={16} /> Send via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkEnquiryPopup;