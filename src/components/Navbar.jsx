import React, { useState } from "react";
import {
  ShoppingCart, Menu, X, Rocket, PhoneCall, Search, ChevronRight, Trash2, Plus, Minus
} from "lucide-react";
import logo from "../assets/Himalaya.jpeg";
import { NavLink } from "react-router-dom"



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Search expansion state
  const [searchTerm, setSearchTerm] = useState("");

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Flower Pots Big", price: 450, qty: 1 },
    { id: 2, name: "Chakkars Special", price: 200, qty: 2 },
  ]);

  const cartCount = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Crackers", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="w-full top-0 z-50">
        {/* Top Bar */}
        <div className="bg-[#1E60F2] text-white py-2 px-4 flex justify-center md:justify-between items-center text-[10px] md:text-xs font-bold">
          <span className="flex items-center gap-1">
            <PhoneCall size={12} /> Call: +91 98765 43210
          </span>
          <span className="hidden md:block italic">
            ✨ High Quality Sivakasi Crackers at Factory Prices
          </span>
        </div>

        {/* Main Navbar */}
        <nav className="bg-white shadow-xl border-b-2 border-orange-400">
          <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center relative">
            
            {/* Logo Section - Search open aana mobile-la hide aagum */}
            <div className={`flex items-center h-14 md:h-16 transition-all duration-300 ${isSearchOpen ? 'scale-0 w-0 opacity-0 md:scale-100 md:w-auto md:opacity-100' : 'scale-100 w-auto opacity-100'}`}>
              <img src={logo} alt="Logo" className="h-full w-auto object-contain transition-transform group-hover:scale-105" />
              <Rocket className="ml-2 text-orange-500 animate-bounce hidden sm:block" size={20} />
            </div>

            {/* Desktop Nav - Search open aana hide aagum */}
            <div className={`hidden lg:flex items-center space-x-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
             {navLinks.map((link) => (
  <NavLink
    key={link.path}
    to={link.path}
    className={({ isActive }) =>
      `px-4 py-2 font-bold rounded-lg transition-all ${
        isActive
          ? "text-[#1E60F2] bg-blue-100"
          : "text-gray-800 hover:text-[#1E60F2] hover:bg-blue-50"
      }`
    }
  >
    {link.name}
  </NavLink>
))}

            </div>

            {/* Icons & Expanding Search Section */}
            <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchOpen ? 'flex-1 justify-end' : 'w-auto'}`}>
              
              {/* --- INLINE EXPANDING SEARCH --- */}
              <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full md:max-w-md' : 'w-10'}`}>
                {isSearchOpen ? (
                  <div className="flex items-center w-full bg-gray-100 border-2 border-blue-400 rounded-full px-4 py-2 animate-in slide-in-from-right-5 duration-300">
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search for crackers..."
                      className="bg-transparent outline-none w-full font-bold text-gray-800 placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => {setIsSearchOpen(false); setSearchTerm("")}}>
                      <X size={20} className="text-gray-500 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <Search size={24} />
                  </button>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 text-gray-700 hover:bg-orange-50 rounded-full transition group ${isSearchOpen ? 'hidden md:block' : 'block'}`}
              >
                <ShoppingCart size={26} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 ${isSearchOpen ? 'hidden' : 'block'}`}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen border-t" : "max-h-0 overflow-hidden"}`}>
            <div className="px-4 py-4 bg-white space-y-2">
              {navLinks.map((link) => (
  <NavLink
    key={link.path}
    to={link.path}
    onClick={() => setIsOpen(false)}
    className="flex justify-between items-center px-4 py-4 rounded-xl bg-gray-50 font-bold"
  >
    {link.name}
    <ChevronRight size={18} />
  </NavLink>
))}

              <div className="pt-4">
                <button className="w-full bg-[#F2A31E] text-white py-4 rounded-xl font-black shadow-lg">DOWNLOAD PRICE LIST (PDF)</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center bg-[#1E60F2] text-white">
            <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart size={24} /> My Basket ({cartCount})</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-blue-700 rounded-full"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-xl shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-[#1E60F2] font-bold text-sm">₹{item.price}</p>
                </div>
                <button className="text-red-400"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <div className="p-6 border-t bg-gray-50 text-center">
            <div className="flex justify-between mb-4 font-bold text-xl"><span>Total</span><span>₹{totalPrice}</span></div>
            <button className="w-full bg-[#F2A31E] text-white py-4 rounded-xl font-black">CHECKOUT NOW</button>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]" onClick={() => setIsCartOpen(false)} />
      )}
    </>
  );
};

export default Navbar;