import React from 'react';
import { Sparkles, Rocket, Flame, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Standardizing imports (assumed paths from your snippet)
import sparklersImg from '../../assets/sparklers.png';
import rocketsImg from '../../assets/rockets.png';
import fancyCrackersImg from '../../assets/fancy_crackers.png';
import giftBoxesImg from '../../assets/gift_boxes.png';

const categories = [
  {
    id: '01',
    title: 'Sparklers',
    path: '/category/sparklers', // Added explicit path
    icon: <Sparkles className="w-5 h-5" />,
    image: sparklersImg,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: '02',
    title: 'Rockets',
    path: '/category/rockets',
    icon: <Rocket className="w-5 h-5" />,
    image: rocketsImg,
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: '03',
    title: 'Fancy Crackers',
    path: '/category/fancy-crackers',
    icon: <Flame className="w-5 h-5" />,
    image: fancyCrackersImg,
    color: 'from-red-500 to-pink-600',
  },
  {
    id: '04',
    title: 'Gift Boxes',
    path: '/category/gift-boxes',
    icon: <Gift className="w-5 h-5" />,
    image: giftBoxesImg,
    color: 'from-emerald-500 to-teal-600',
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden font-poppins">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <p className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3">
            Our Collections
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Explore Our <span className="text-[#1E60F2]">Premium Range</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-[#1E60F2] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div
                    className={`inline-flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-br ${cat.color} text-white mb-3 shadow-lg`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-[#1E60F2] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
