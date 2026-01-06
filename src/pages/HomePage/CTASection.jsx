import React, { useState } from 'react';
import { ShoppingBag, Boxes, PhoneCall, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BulkEnquiryPopup from '../../Context/BulkEnquiryPopup';

const CTASection = () => {
  const navigate = useNavigate()

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative py-28 bg-[#F8FAFC] font-poppins overflow-hidden">
      
      {/* Corner Accent Blobs */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-[#1E60F2] rounded-full blur-[160px] opacity-15"></div>
      <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-[#F2A31E] rounded-full blur-[160px] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* TEXT */}
        <div className="max-w-3xl mb-20">
          <p className="text-sm font-bold tracking-widest text-[#F2A31E] uppercase mb-3">
            Ready to Celebrate?
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Choose how you want to order from
            <span className="text-[#1E60F2]"> Himalaya Crackers</span>
          </h2>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            Whether it’s a small family celebration or a bulk festive order,
            we’re here to guide you safely and transparently.
          </p>
        </div>

        {/* CTA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* SHOP NOW */}
          <button
            onClick={() => {
    navigate("/products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
            className="group flex flex-col gap-6 p-8 rounded-3xl bg-white text-gray-900 border border-gray-100 hover:border-[#F2A31E] shadow-md hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-[#1E60F2]/10 flex items-center justify-center">
              <ShoppingBag className="text-[#1E60F2]" />
            </div>

            <div>
              <h3 className="text-xl font-black mb-2">Shop Now</h3>
              <p className="text-sm text-gray-600">
                Browse crackers, gift boxes & festive combos
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold mt-auto text-[#1E60F2]">
              Start Shopping <ArrowRight size={16} />
            </span>
          </button>

          {/* BULK ORDER */}
          <button
            
            className="group flex flex-col gap-6 p-8 rounded-3xl bg-[#1E60F2] text-white
             hover:bg-blue-700 shadow-lg transition-all"
             onClick={() => setIsPopupOpen(true)}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Boxes />
            </div>

            <div>
              <h3 className="text-xl font-black mb-2">Bulk Order</h3>
              <p className="text-sm text-blue-100">
                Wholesale & agent orders across Tamil Nadu & India
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold mt-auto">
              Enquire Now <ArrowRight size={16} />
            </span>
          </button>

          {/* CONTACT */}
          <button
            onClick={() => {
    navigate("/contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
            className="group flex flex-col gap-6 p-8 rounded-3xl bg-white text-gray-900 border border-gray-100 hover:border-[#1E60F2] shadow-md hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-[#F2A31E]/20 flex items-center justify-center">
              <PhoneCall className="text-[#F2A31E]" />
            </div>

            <div>
              <h3 className="text-xl font-black mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">
                Delivery areas, safety rules & custom queries
              </p>
            </div>

            <span className="inline-flex items-center gap-2 font-bold mt-auto text-[#F2A31E]">
              Talk to Us <ArrowRight size={16} />
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
  )
}

export default CTASection
