import React from "react";
import { Sparkles, Rocket, Flame, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Standardizing imports (assumed paths from your snippet)
import sparklersImg from "../../assets/sparklers.png";
import rocketsImg from "../../assets/rockets.png";
import fancyCrackersImg from "../../assets/fancy_crackers.png";
import giftBoxesImg from "../../assets/gift_boxes.png";

const categories = [
  {
    id: "01",
    title: "Sparklers",
    path: "/category/sparklers", // Added explicit path
    icon: <Sparkles className="w-5 h-5" />,
    image: sparklersImg,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "02",
    title: "Rockets",
    path: "/category/rockets",
    icon: <Rocket className="w-5 h-5" />,
    image: rocketsImg,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "03",
    title: "Fancy Crackers",
    path: "/category/fancy-crackers",
    icon: <Flame className="w-5 h-5" />,
    image: fancyCrackersImg,
    color: "from-red-500 to-pink-600",
  },
  {
    id: "04",
    title: "Gift Boxes",
    path: "/category/gift-boxes",
    icon: <Gift className="w-5 h-5" />,
    image: giftBoxesImg,
    color: "from-emerald-500 to-teal-600",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden font-poppins">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h4 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-3">Our Collections</h4>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">Premium Range</span>
          </h2>
        </div>

        {/* Circular Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-start">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.path}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex flex-col items-center text-center"
            >
              {/* The Rounded Circle Frame */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 mb-6 transition-all duration-500 transform group-hover:scale-105">
                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200 group-hover:border-orange-400 group-hover:rotate-45 transition-all duration-700"></div>
                
                {/* Image Container */}
                <div className="absolute inset-2 overflow-hidden rounded-full bg-white shadow-xl border-4 border-white">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                </div>

                {/* Floating Icon Badge */}
                <div className={`absolute bottom-2 right-2 p-3 rounded-full bg-gradient-to-br ${cat.color} text-white shadow-lg border-2 border-white transform group-hover:translate-y-[-5px] transition-transform duration-300`}>
                  {cat.icon}
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>View More</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button for Mobile/Desktop */}
        <div className="mt-20 text-center">
          <Link to="/products" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;