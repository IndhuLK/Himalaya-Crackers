import React from "react";
import { ShoppingCart, Heart, Flame, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Product Data
const products = [
  {
    id: 1,
    name: "240 Shots Multi Color",
    price: 3500,
    mrp: 4200,
    category: "SKY SHOTS",
    noise: "High Noise",
    image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80&w=400",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "1000 Wala Giant Crackers",
    price: 1200,
    mrp: 1500,
    category: "GARLANDS",
    noise: "High Noise",
    image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c470c?auto=format&fit=crop&q=80&w=400",
    tag: "Trending",
  },
  {
    id: 3,
    name: "Flower Pots - Large",
    price: 450,
    mrp: 600,
    category: "FOUNTAINS",
    noise: "Low Noise",
    image: "https://images.unsplash.com/photo-1533230408703-a2321476d067?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Rocket Bomb Box",
    price: 850,
    mrp: 1100,
    category: "ROCKETS",
    noise: "Medium Noise",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=400",
    tag: "Hot Deal",
  },
];

const TopSelling = () => {
  return (
    <section className="py-24 bg-[#F8FAFC] font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h4 className="text-orange-600 font-black tracking-[0.2em] uppercase mb-2 text-sm">
             Customer Favorites
            </h4>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              Top Selling <span className="text-[#1E60F2]">Crackers</span>
            </h2>
          </div>
          <Link to="/products">
          <button className="hidden md:flex items-center gap-2 group px-8 py-3 bg-white 
          text-slate-900 font-bold border-2 border-slate-900 hover:bg-slate-900
           hover:text-white transition-all rounded-2xl shadow-lg cursor-pointer"
           onClick={() => {
    window.scrollTo({ top: 0, behavior: "smooth" })}}
    >
            VIEW ALL PRODUCTS
            <Zap size={18} className="text-orange-500 group-hover:animate-pulse" />
          </button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Container with Top-Left heavy rounding (Referencing uploaded image) */}
              <div className="relative h-72 overflow-hidden m-3 rounded-tl-[3rem] rounded-tr-[1.5rem] rounded-bl-[1.5rem] rounded-br-[1.5rem]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badges */}
                <div className="absolute top-5 left-5">
                  {product.tag && (
                    <span className="bg-white/95 backdrop-blur-md text-[#1E60F2] text-[10px] font-black px-4 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Wishlist Icon */}
                <button className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm hover:scale-110">
                  <Heart size={20} />
                </button>
              </div>

              {/* Product Details Area */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-[#1E60F2] uppercase tracking-[0.15em]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                    <Flame size={12} className="text-orange-500" />
                    <span className="text-[9px] font-black text-orange-600 uppercase">
                      {product.noise}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-5 line-clamp-1 group-hover:text-[#1E60F2] transition-colors leading-tight">
                  {product.name}
                </h3>

                {/* Price and Cart Action Box */}
                <div className="bg-slate-50 p-4 rounded-[2rem] flex items-center justify-between group-hover:bg-[#1E60F2]/5 transition-all border border-transparent group-hover:border-[#1E60F2]/10">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">₹{product.price}</span>
                      <span className="text-xs text-slate-400 line-through font-medium">₹{product.mrp}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                      Limited Time Offer
                    </span>
                  </div>
                  
                  <button className="w-12 h-12 bg-[#1E60F2] text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                    <ShoppingCart size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-14 text-center md:hidden">
          <button className="w-full py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-[1.5rem] shadow-xl active:scale-95 transition-transform">
            View All Bestsellers
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;