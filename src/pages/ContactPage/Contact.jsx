import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Instagram, Facebook } from 'lucide-react';

const Contact = () => {
  // 1. Add state to capture form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Updated WhatsApp handler for the form
  const handleFormWhatsApp = (e) => {
    e.preventDefault();
    const phoneNumber = "919876543210"; // Your actual number
    
    // Constructing a professional message template
    const text = `*New Website Inquiry*%0A` +
                 `*Name:* ${formData.name}%0A` +
                 `*Phone:* ${formData.phone}%0A` +
                 `*Email:* ${formData.email}%0A` +
                 `*Subject:* ${formData.subject}%0A` +
                 `*Message:* ${formData.message}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const handleQuickChat = () => {
    window.open(`https://wa.me/919876543210?text=Hi Himalaya Crackers, I need quick support.`, '_blank');
  };

  return (
    <section className="bg-white font-poppins min-h-screen">
      {/* --- Header Section --- */}
      <div className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h4 className="text-[#1E60F2] font-black tracking-[0.3em] uppercase mb-4 text-xs">
            Get In Touch
          </h4>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
            Contact <span className="text-orange-500">Us</span>
          </h1>
          <div className="w-20 h-1.5 bg-slate-900 mx-auto mt-6"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl">
          
          {/* --- Left Column: Contact Info --- */}
          <div className="lg:col-span-5 bg-[#1E60F2] p-10 md:p-16 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">
                Contact <br />Information
              </h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-xl text-orange-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Call Us Directly</p>
                    <p className="text-xl font-bold">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-xl text-orange-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Email Inquiry</p>
                    <p className="text-xl font-bold">info@himalayacrackers.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-xl text-orange-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Our Location</p>
                    <p className="text-lg font-bold leading-tight">Sivakasi, Tamil Nadu, <br />India - 626123</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-white/10 flex gap-6">
              <a href="#" className="hover:text-orange-400 transition-colors"><Instagram size={20}/></a>
              <a href="#" className="hover:text-orange-400 transition-colors"><Facebook size={20}/></a>
              <button onClick={handleQuickChat} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-orange-400 cursor-pointer">
                <MessageSquare size={18} /> Chat Now
              </button>
            </div>
          </div>

          {/* --- Right Column: Contact Form --- */}
          <div className="lg:col-span-7 p-10 md:p-16 bg-white">
            <div className="mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Send a Message</h3>
              <p className="text-slate-400 text-sm">Fill out the form below to send the details directly to our WhatsApp.</p>
            </div>

            <form onSubmit={handleFormWhatsApp} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full py-3 outline-none text-slate-800 font-semibold" placeholder="John Doe" 
                  />
                </div>
                <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input 
                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                    className="w-full py-3 outline-none text-slate-800 font-semibold" placeholder="+91 00000 00000" 
                  />
                </div>
              </div>

              <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full py-3 outline-none text-slate-800 font-semibold" placeholder="john@example.com" 
                />
              </div>

              <div className="relative border-b border-slate-200 focus-within:border-[#1E60F2] transition-all">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
                <select 
                  name="subject" value={formData.subject} onChange={handleChange}
                  className="w-full py-3 outline-none text-slate-800 font-semibold bg-transparent"
                >
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Complaint/Feedback</option>
                  <option>Become a Dealer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                <textarea 
                  name="message" required value={formData.message} onChange={handleChange}
                  className="w-full border border-slate-100 bg-slate-50 p-4 rounded-xl outline-none focus:ring-2 ring-[#1E60F2]/10 h-32" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button type="submit" className="px-10 py-5 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.4em] hover:bg-[#1E60F2] transition-all flex items-center gap-3 shadow-xl cursor-pointer">
                <Send size={16} /> Send via WhatsApp
              </button>
            </form>
          </div>
        </div>

        {/* --- Info Footer --- */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border border-slate-100 rounded-2xl">
            <Clock className="mx-auto text-orange-500 mb-4" size={32} />
            <h4 className="font-black uppercase tracking-widest text-sm mb-2">Office Hours</h4>
            <p className="text-slate-500 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
          </div>
          <div className="p-8 border border-slate-100 rounded-2xl">
            <MessageSquare className="mx-auto text-[#1E60F2] mb-4" size={32} />
            <h4 className="font-black uppercase tracking-widest text-sm mb-2">Support</h4>
            <p className="text-slate-500 text-sm">Dedicated WhatsApp Support</p>
          </div>
          <div className="p-8 border border-slate-100 rounded-2xl">
            <MapPin className="mx-auto text-orange-500 mb-4" size={32} />
            <h4 className="font-black uppercase tracking-widest text-sm mb-2">Delivery</h4>
            <p className="text-slate-500 text-sm">Pan-India Shipping Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;