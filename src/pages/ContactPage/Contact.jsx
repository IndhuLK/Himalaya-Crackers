import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormWhatsApp = (e) => {
    e.preventDefault();
    const phoneNumber = '919876543210';

    const text =
      `*New Website Inquiry*%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Subject:* ${formData.subject}%0A` +
      `*Message:* ${formData.message}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const handleQuickChat = () => {
    window.open(
      'https://wa.me/919876543210?text=Hi Himalaya Crackers, I need quick support.',
      '_blank'
    );
  };

  return (
    <section className="bg-white font-poppins min-h-screen overflow-hidden">
      <div className="relative isolate bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_48%,#fff7ed_100%)] border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_28%)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-18 pb-16 md:pt-24 md:pb-20">
          <div className="max-w-3xl">
            <p className="text-[#1E60F2] font-black tracking-[0.28em] uppercase mb-4 text-xs">
              Get In Touch
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02] text-slate-900 mb-5">
              Contact that feels direct, simple, and fast.
            </h1>
            <p className="max-w-2xl text-slate-600 text-base md:text-lg leading-8">
              Reach out for product questions, order support, bulk enquiries, or
              delivery details. Use the form or jump directly to WhatsApp for a
              quicker response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
              <Clock className="text-orange-500 mb-3" size={22} />
              <h3 className="font-black text-slate-900 mb-1">Working Hours</h3>
              <p className="text-sm text-slate-600 leading-6">
                Mon - Sat, 9:00 AM to 7:00 PM
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
              <ShieldCheck className="text-blue-600 mb-3" size={22} />
              <h3 className="font-black text-slate-900 mb-1">Quick Support</h3>
              <p className="text-sm text-slate-600 leading-6">
                Fast WhatsApp response for orders and updates.
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
              <Truck className="text-orange-500 mb-3" size={22} />
              <h3 className="font-black text-slate-900 mb-1">Delivery Help</h3>
              <p className="text-sm text-slate-600 leading-6">
                Guidance for Tamil Nadu delivery and bulk dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-10 items-start">
          <div className="relative overflow-hidden rounded-4xl bg-[linear-gradient(155deg,#0f172a_0%,#1e3a8a_55%,#2563eb_100%)] p-8 md:p-10 text-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.65)]">
            <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55 mb-3">
                Contact Information
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
                Talk to the team directly.
              </h2>

              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: 'Call Us Directly',
                    value: '+91 98765 43210',
                  },
                  {
                    icon: Mail,
                    label: 'Email Inquiry',
                    value: 'info@himalayacrackers.com',
                  },
                  {
                    icon: MapPin,
                    label: 'Our Location',
                    value: 'Sivakasi, Tamil Nadu, India - 626123',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-white/10 p-3 text-orange-300 shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50 mb-1.5">
                            {item.label}
                          </p>
                          <p className="text-sm md:text-base font-semibold text-white/90 leading-7">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-7 border-t border-white/10 flex flex-wrap items-center gap-4">
                <a
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:text-orange-300"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:text-orange-300"
                >
                  <Facebook size={18} />
                </a>
                <button
                  onClick={handleQuickChat}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-orange-400 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  Quick WhatsApp Chat
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 md:p-10 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.4)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500 mb-3">
                  Send a Message
                </p>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                  Tell us what you need.
                </h3>
                <p className="text-sm text-slate-500 leading-7 max-w-xl">
                  Your details are sent directly to WhatsApp, making follow-up
                  faster and easier.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <MessageSquare size={14} className="text-blue-600" />
                Live response ready
              </div>
            </div>

            <form onSubmit={handleFormWhatsApp} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Your Name">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                  />
                </Field>
              </div>

              <Field label="Email Address">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </Field>

              <Field label="Subject">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Complaint/Feedback</option>
                  <option>Become a Dealer</option>
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-36"
                  placeholder="How can we help you?"
                />
              </Field>

              <button
                type="submit"
                className="inline-flex w-full md:w-auto items-center justify-center gap-3 rounded-full bg-slate-900 px-7 py-4 text-xs font-black uppercase tracking-[0.28em] text-white transition-all hover:bg-[#1E60F2] hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
              >
                <Send size={16} />
                Send via WhatsApp
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-7">
            <Clock className="mx-auto text-orange-500 mb-4" size={28} />
            <h4 className="font-black tracking-tight text-slate-900 mb-2">
              Office Hours
            </h4>
            <p className="text-sm text-slate-500">
              Mon - Sat: 9:00 AM - 7:00 PM
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-7">
            <MessageSquare className="mx-auto text-[#1E60F2] mb-4" size={28} />
            <h4 className="font-black tracking-tight text-slate-900 mb-2">
              Support
            </h4>
            <p className="text-sm text-slate-500">
              Dedicated WhatsApp support for quick answers
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-7">
            <MapPin className="mx-auto text-orange-500 mb-4" size={28} />
            <h4 className="font-black tracking-tight text-slate-900 mb-2">
              Delivery
            </h4>
            <p className="text-sm text-slate-500">
              Pan-India shipping assistance for eligible orders
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
      {label}
    </label>
    {React.cloneElement(children, {
      className: `w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#1E60F2] focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${children.props.className || ''}`,
    })}
  </div>
);

export default Contact;
