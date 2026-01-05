import React from "react"
import {
  Facebook,
  Instagram,
  PhoneCall,
  Mail,
  MapPin,
} from "lucide-react"
import logo from "../assets/Himalaya.jpeg"

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT – LOGO & LINKS */}
        <div>
          <img src={logo} alt="Himalaya Crackers" className="h-14 mb-4" />
          <p className="text-sm leading-relaxed mb-6">
            Premium quality Sivakasi crackers at factory prices.  
            Celebrate festivals with brightness & safety 🎆
          </p>

          <div className="flex gap-4 text-sm font-semibold">
            <a href="/" className="hover:text-[#F2A31E]">Home</a>
            <a href="/products" className="hover:text-[#F2A31E]">Crackers</a>
            <a href="/about" className="hover:text-[#F2A31E]">About</a>
            <a href="/contact" className="hover:text-[#F2A31E]">Contact</a>
          </div>
        </div>

        {/* CENTER – CONTACT */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-[#F2A31E] inline-block">
            Contact Us
          </h3>

          <div className="flex items-start gap-3">
            <MapPin className="text-[#F2A31E]" size={20} />
            <p className="text-sm">
              Sivakasi, Tamil Nadu <br /> India – 626123
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PhoneCall className="text-[#F2A31E]" size={18} />
            <p className="text-sm">+91 98765 43210</p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-[#F2A31E]" size={18} />
            <p className="text-sm">himalayacrackers@gmail.com</p>
          </div>
        </div>

        {/* RIGHT – ABOUT & SOCIAL */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-[#F2A31E] inline-block">
            About Himalaya
          </h3>

          <p className="text-sm leading-relaxed mb-6">
            We manufacture and supply safe, eco-friendly crackers
            directly from Sivakasi. Trusted by thousands of families.
          </p>

          <div className="flex gap-4">
            <a className="p-2 bg-[#1E60F2] rounded-full hover:bg-[#F2A31E] transition">
              <Facebook size={18} className="text-white" />
            </a>
            <a className="p-2 bg-[#1E60F2] rounded-full hover:bg-[#F2A31E] transition">
              <Instagram size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-[#F2A31E] font-semibold">Himalaya Crackers</span>.  
        All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
