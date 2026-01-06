import React from "react";
import { Sparkles, Rocket, Flame, Gift, ArrowRight } from "lucide-react";
import sparklersImg from "../../assets/sparklers.png";
import rocketsImg from "../../assets/rockets.png";
import fancyCrackersImg from "../../assets/fancy_crackers.png";
import giftBoxesImg from "../../assets/gift_boxes.png";

import { Link } from "react-router-dom";

const categories = [
  {
    id: "01",
    title: "Sparklers",
    subtitle: "Magical moments for everyone",
    icon: <Sparkles className="w-6 h-6" />,
    image: sparklersImg,
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/50",
    description: "Brighten up your festival with our long-lasting, safe, and mesmerizing sparklers.",
  },
  {
    id: "02",
    title: "Rockets",
    subtitle: "Touch the sky",
    icon: <Rocket className="w-6 h-6" />,
    image: rocketsImg,
    color: "from-blue-500 to-purple-600",
    shadow: "shadow-blue-500/50",
    description: "High-flying rockets that paint the night sky with dazzling colors and loud bangs.",
  },
  {
    id: "03",
    title: "Fancy Crackers",
    subtitle: "Ground visuals & flower pots",
    icon: <Flame className="w-6 h-6" />,
    image: fancyCrackersImg,
    color: "from-red-500 to-pink-600",
    shadow: "shadow-red-500/50",
    description: "Colorful ground chakkars, flower pots, and fountains for a spectacular ground show.",
  },
  {
    id: "04",
    title: "Gift Boxes",
    subtitle: "The perfect festival package",
    icon: <Gift className="w-6 h-6" />,
    image: giftBoxesImg,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/50",
    description: "Curated assortments of the best crackers, perfect for gifting and family celebrations.",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden font-poppins">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h4 className="text-orange-400 font-bold tracking-widest uppercase mb-2">Our Collections</h4>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E60F2] to-[#033ab1]">Premium Range</span>
            </h2>
          </div>
          <Link to="/products">
          <button className="hidden md:flex items-center gap-2 group px-8 py-3 bg-white 
          text-slate-900 font-bold border-2 border-slate-900 hover:bg-slate-900
           hover:text-white transition-all rounded-2xl shadow-lg cursor-pointer"
            onClick={() => {
    window.scrollTo({ top: 0, behavior: "smooth" })}}
    >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="group relative h-[320px]  overflow-hidden cursor-pointer shadow-xl 
              hover:shadow-2xl transition-all duration-500 rounded-3xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Float Icon */}
              <div className={`absolute top-6 right-6 p-3 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-500`}>
                {cat.icon}
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md mb-3 border border-white/20`}>
                    {cat.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {cat.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <button className="items-center gap-2 group px-8 py-4 bg-white
           text-black  font-semibold hover:bg-gray-800 
           transition-all inline-flex shadow-xl shadow-gray-900/30">
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;