import React, { useState } from 'react';
import { ShoppingBag, Boxes, PhoneCall, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BulkEnquiryPopup from '../../Context/BulkEnquiryPopup';

const CTASection = () => {
  const navigate = useNavigate();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative py-16 bg-[#F8FAFC] font-poppins overflow-hidden">
      {/* Corner Accent Blobs */}
      <div className="absolute -top-40 -left-40 w-105 h-105 bg-[#1E60F2] rounded-full blur-[120px] opacity-10"></div>
      <div className="absolute -bottom-40 -right-40 w-[320px] h-105 bg-[#F2A31E] rounded-full blur-[120px] opacity-15"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* TEXT */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold tracking-widest text-[#F2A31E] uppercase mb-2">
            Ready to Celebrate?
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Choose how you want to order from
            <span className="text-[#1E60F2]"> Himalaya Crackers</span>
          </h2>
          <p className="text-base text-gray-600 mt-4 leading-relaxed">
            Whether it’s a small family celebration or a bulk festive order,
            we’re here to guide you safely and transparently.
          </p>
        </div>

        {/* CTA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* SHOP NOW */}
          <button
            onClick={() => {
              navigate('/products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col gap-4 p-6 rounded-2xl bg-white text-gray-900 border border-gray-100 hover:border-[#F2A31E] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1E60F2]/10 flex items-center justify-center">
              <ShoppingBag size={20} className="text-[#1E60F2]" />
            </div>

            <div>
              <h3 className="text-lg font-black mb-1">Shop Now</h3>
              <p className="text-sm text-gray-600">
                Browse crackers, gift boxes & festive combos
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold text-sm mt-auto text-[#1E60F2]">
              Start Shopping <ArrowRight size={14} />
            </span>
          </button>

          {/* BULK ORDER */}
          <button
            className="group flex flex-col gap-4 p-6 rounded-2xl bg-[#1E60F2] text-white
             hover:bg-blue-700 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => setIsPopupOpen(true)}
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <Boxes size={20} />
            </div>

            <div>
              <h3 className="text-lg font-black mb-1">Bulk Order</h3>
              <p className="text-sm text-blue-100">
                Wholesale & agent orders across Tamil Nadu & India
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold text-sm mt-auto">
              Enquire Now <ArrowRight size={14} />
            </span>
          </button>

          {/* CONTACT */}
          <button
            onClick={() => {
              navigate('/contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col gap-4 p-6 rounded-2xl bg-white text-gray-900 border border-gray-100 hover:border-[#1E60F2] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F2A31E]/20 flex items-center justify-center">
              <PhoneCall size={20} className="text-[#F2A31E]" />
            </div>

            <div>
              <h3 className="text-lg font-black mb-1">Contact Us</h3>
              <p className="text-sm text-gray-600">
                Delivery areas, safety rules & custom queries
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold text-sm mt-auto text-[#F2A31E]">
              Talk to Us <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </div>

      {/* Popup Component */}
      <BulkEnquiryPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </section>
  );
};

export default CTASection;
