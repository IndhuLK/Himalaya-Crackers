import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import logo from "../assets/Himalaya.jpeg";

const Footer = () => {
  const navigate = useNavigate();

  // Helper to scroll to top when clicking links
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. BRAND INFO */}
          <div className="space-y-6">
            <img src={logo} alt="Himalaya Crackers" className="h-16 rounded-lg border border-white/10 shadow-lg" />
            <p className="text-sm leading-relaxed text-gray-400">
              Premium quality Sivakasi crackers at factory prices. 
              Celebrating safety, innovation, and tradition since 1998. 🎇
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-[#1E60F2] rounded-xl hover:bg-[#F2A31E] hover:-translate-y-1 transition-all duration-300">
                <Facebook size={18} className="text-white" />
              </a>
              <a href="#" className="p-2.5 bg-[#1E60F2] rounded-xl hover:bg-[#F2A31E] hover:-translate-y-1 transition-all duration-300">
                <Instagram size={18} className="text-white" />
              </a>
              <button 
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                className="p-2.5 bg-emerald-600 rounded-xl hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <MessageSquare size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Explore
            </h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
              <li>
                <Link to="/about" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/safety" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Safety Guidelines</Link>
              </li>
              <li>
                <Link to="/policy/green-crackers" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Green Crackers Policy</Link>
              </li>
              <li>
                <Link to="/regulations" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Government Regulations</Link>
              </li>
              <li>
                <Link to="/faq" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL & SUPPORT */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Legal
            </h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-400">
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/refund" onClick={scrollToTop} className="hover:text-[#F2A31E] transition-colors">Refund & Cancellation</Link>
              </li>
            </ul>
          </div>

          {/* 4. OFFICE INFO */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">
              Head Office
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#F2A31E] shrink-0" size={20} />
                <p className="text-sm leading-relaxed">
                  Sivakasi Main Road, <br />
                  Virudhunagar Dist, <br />
                  Tamil Nadu – 626123
                </p>
              </div>
              <div className="flex items-center gap-4">
                <PhoneCall className="text-[#F2A31E] shrink-0" size={18} />
                <p className="text-sm font-bold">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-[#F2A31E] shrink-0" size={18} />
                <p className="text-sm">sales@himalaya.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">
            © {new Date().getFullYear()} <span className="text-[#1E60F2]">Himalaya Crackers</span>. All Rights Reserved.
          </p>
          <p className="text-[10px] text-gray-600 uppercase tracking-tighter">
            Design & Developed for Premium Festive Experience
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;