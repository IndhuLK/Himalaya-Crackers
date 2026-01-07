import React, { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Rocket,
  PhoneCall,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Himalaya.jpeg";
import { useCart } from "../context/CartContext";
import ShoppingCartPopup from "./ShoppingCart";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Crackers", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#1E60F2] text-white py-2 px-4 flex justify-between text-xs font-bold">
        <span className="flex items-center gap-1">
          <PhoneCall size={12} /> +91 98765 43210
        </span>
        <span className="hidden md:block italic">
          ✨ Sivakasi Crackers at Factory Price
        </span>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white border-b-2 border-orange-400 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-12" />
            <Rocket className="text-orange-500 animate-bounce hidden sm:block" />
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-bold rounded-lg transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-blue-50 text-gray-800"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            {searchOpen ? (
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent outline-none font-bold"
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X />
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)}>
                <Search />
              </button>
            )}

            {/* CART */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 font-bold border-b"
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      {/* CART POPUP */}
      <ShoppingCartPopup
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
