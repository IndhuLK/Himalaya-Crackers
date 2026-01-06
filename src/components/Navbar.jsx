import React, { useState } from "react";
import {
  ShoppingCart, Menu, X, Rocket, PhoneCall, Search, ChevronRight, Trash2, Plus, Minus, User, Mail, MapPin, Building, Hash
} from "lucide-react";
import logo from "../assets/Himalaya.jpeg";
import { NavLink } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();

  const cartCount = cartItems.length;
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Customer Details State
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: ""
  });



  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // WhatsApp Order Logic
  const handleCheckout = async () => {
    if (!customer.name || !customer.address || !customer.pincode || !customer.mobile) {
      alert("Please fill Name, Mobile Number, Address, and Pincode to continue!");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // 1. Save Order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), {
        customer: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        address: `${customer.address}, ${customer.city} - ${customer.pincode}`,
        items: cartItems,
        total: totalPrice,
        status: "Pending", // Default Status
        createdAt: serverTimestamp(),
        date: new Date().toLocaleString()
      });

      // 2. Clear Cart locally
      clearCart();

      // 3. Redirect to WhatsApp
      const phoneNumber = "919500694734"; // Unga WhatsApp number inge kudunga

      let message = `*NEW ORDER – HIMALAYA CRACKERS*%0A%0A`;
      message += `*Customer Details:*%0A`;
      message += `• Name: ${customer.name}%0A`;
      message += `• Email: ${customer.email || 'N/A'}%0A`;
      message += `• Mobile: ${customer.mobile}%0A`;
      message += `• Address: ${customer.address}, ${customer.city} - ${customer.pincode}%0A%0A`;

      message += `*Order Items:*%0A`;
      cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}%0A`;
      });

      message += `%0A💰 *Total Amount: ₹${totalPrice}*%0A%0A`;
      message += `👉 Please confirm my order.`;

      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

      setIsCheckoutLoading(false);
      setIsCartOpen(false); // Close cart drawer
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
      setIsCheckoutLoading(false);
    }
  };

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
          <span className="hidden md:block italic">✨ High Quality Sivakasi Crackers at Factory Prices</span>
        </div>

        {/* Main Navbar */}
        <nav className="bg-white shadow-xl border-b-2 border-orange-400">
          <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center relative">

            <div className={`flex items-center h-14 md:h-16 transition-all duration-300 ${isSearchOpen ? 'scale-0 w-0 opacity-0 md:scale-100 md:w-auto md:opacity-100' : 'scale-100 w-auto opacity-100'}`}>
              <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
              <Rocket className="ml-2 text-orange-500 animate-bounce hidden sm:block" size={20} />
            </div>

            <div className={`hidden lg:flex items-center space-x-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={({ isActive }) => `px-4 py-2 font-bold rounded-lg transition-all ${isActive ? "text-[#1E60F2] bg-blue-100" : "text-gray-800 hover:text-[#1E60F2] hover:bg-blue-50"}`}>
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchOpen ? 'flex-1 justify-end' : 'w-auto'}`}>
              <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-full md:max-w-md' : 'w-10'}`}>
                {isSearchOpen ? (
                  <div className="flex items-center w-full bg-gray-100 border-2 border-blue-400 rounded-full px-4 py-2">
                    <input autoFocus type="text" placeholder="Search..." className="bg-transparent outline-none w-full font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button onClick={() => setIsSearchOpen(false)}><X size={20} /></button>
                  </div>
                ) : (
                  <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"><Search size={24} /></button>
                )}
              </div>

              <button onClick={() => setIsCartOpen(true)} className={`relative p-2 text-gray-700 hover:bg-orange-50 rounded-full transition group ${isSearchOpen ? 'hidden md:block' : 'block'}`}>
                <ShoppingCart size={26} />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{cartCount}</span>}
              </button>

              <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 ${isSearchOpen ? 'hidden' : 'block'}`}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* --- CART DRAWER (FULL POPUP) --- */}
      <div className={`fixed inset-0 z-[110] flex justify-end transition-all duration-500 ${isCartOpen ? "visible" : "invisible"}`}>
        {/* Background Overlay */}
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsCartOpen(false)} />

        {/* Side Panel */}
        <div className={`relative w-full md:max-w-4xl bg-white h-full shadow-2xl flex flex-col md:flex-row transform transition-transform duration-500 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Left Side: Cart Items List */}
          <div className="flex-1 flex flex-col bg-gray-50 border-r overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">🛒 YOUR SHOPPING CART</h2>
              <button onClick={() => setIsCartOpen(false)} className="md:hidden p-2 bg-gray-100 rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length > 0 ? cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="bg-blue-50 p-3 rounded-xl"><Rocket className="text-blue-600" size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                    <p className="text-blue-600 font-bold">₹{item.price} <span className="text-gray-400 text-xs ml-2">Per Unit</span></p>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button className="p-1 hover:text-red-500"><Minus size={16} /></button>
                    <span className="px-4 font-bold">{item.qty}</span>
                    <button className="p-1 hover:text-blue-500"><Plus size={16} /></button>
                  </div>
                  <div className="w-full sm:w-auto text-right border-t sm:border-none pt-2 sm:pt-0">
                    <p className="font-black text-gray-900">₹{item.price * item.qty}</p>
                    <button className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold mt-1 ml-auto sm:ml-0"><Trash2 size={14} /> REMOVE</button>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <ShoppingCart size={80} />
                  <p className="font-bold text-xl mt-4">Your basket is empty!</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t space-y-2">
              <div className="flex justify-between text-gray-500 font-medium"><span>Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between text-gray-500 font-medium"><span>Delivery Fee</span><span className="text-green-600 font-bold">FREE</span></div>
              <div className="flex justify-between text-gray-900 font-black text-2xl pt-2"><span>Total Amount</span><span>₹{totalPrice}</span></div>
            </div>
          </div>

          {/* Right Side: Checkout Form */}
          <div className="w-full md:w-[400px] flex flex-col bg-white overflow-y-auto">
            <div className="p-6 border-b bg-gray-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">SHIPPING DETAILS</h3>
              <button onClick={() => setIsCartOpen(false)} className="hidden md:block p-1 hover:bg-gray-800 rounded-md"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User size={12} /> Full Name *</label>
                <input name="name" onChange={handleInputChange} type="text" placeholder="Enter your name" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Email ID</label>
                <input name="email" onChange={handleInputChange} type="email" placeholder="email@example.com" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Delivery Address *</label>
                <textarea name="address" onChange={handleInputChange} rows="3" placeholder="Door No, Street Name..." className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><PhoneCall size={12} /> Mobile *</label>
                  <input name="mobile" onChange={handleInputChange} type="text" placeholder="9876543210" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Building size={12} /> City</label>
                  <input name="city" onChange={handleInputChange} type="text" placeholder="Your City" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash size={12} /> Pincode *</label>
                  <input name="pincode" onChange={handleInputChange} type="number" placeholder="600001" className="w-full bg-gray-50 border-none rounded-xl py-4 px-5 font-bold" />
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full bg-[#F2A31E] hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCheckoutLoading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ShoppingCart size={22} className="group-hover:animate-bounce" />
                )}
                {isCheckoutLoading ? "PLACING ORDER..." : "PLACE ORDER VIA WHATSAPP"}
              </button>

              <p className="text-[10px] text-center text-gray-400 font-bold">BY CLICKING, YOU AGREE TO OUR TERMS OF SERVICE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;