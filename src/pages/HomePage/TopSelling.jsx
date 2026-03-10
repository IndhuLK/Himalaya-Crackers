import React from 'react';
import { ShoppingCart, Heart, Flame, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Product Data
const products = [
  {
    id: 1,
    name: '240 Shots Multi Color',
    price: 3500,
    mrp: 4200,
    category: 'SKY SHOTS',
    noise: 'High Noise',
    image:
      'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80&w=400',
    tag: 'Bestseller',
  },
  {
    id: 2,
    name: '1000 Wala Giant Crackers',
    price: 1200,
    mrp: 1500,
    category: 'GARLANDS',
    noise: 'High Noise',
    image:
      'https://images.unsplash.com/photo-1549465220-1d8c9d9c470c?auto=format&fit=crop&q=80&w=400',
    tag: 'Trending',
  },
  {
    id: 3,
    name: 'Flower Pots - Large',
    price: 450,
    mrp: 600,
    category: 'FOUNTAINS',
    noise: 'Low Noise',
    image:
      'https://images.unsplash.com/photo-1533230408703-a2321476d067?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    name: 'Rocket Bomb Box',
    price: 850,
    mrp: 1100,
    category: 'ROCKETS',
    noise: 'Medium Noise',
    image:
      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=400',
    tag: 'Hot Deal',
  },
];

const TopSelling = () => {
  return (
    <section className="py-24 bg-[#F8FAFC] font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h4 className="text-orange-600 font-semibold tracking-wider uppercase mb-2 text-sm">
              Customer Favorites
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-2 capitalize">
              Top Selling <span className="text-[#1E60F2]">Crackers</span>
            </h2>
          </div>
          <Link to="/products">
            <button
              className="hidden md:flex items-center gap-2 group px-8 py-3 bg-white
          text-slate-900 font-bold border-2 border-slate-900 hover:bg-slate-900
           hover:text-white transition-all rounded-2xl shadow-lg cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              VIEW ALL PRODUCTS
              <Zap
                size={18}
                className="text-orange-500 group-hover:animate-pulse"
              />
            </button>
          </Link>
        </div>

        {/* Product Grid */}
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Image */}
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-sm border border-slate-100/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Tag */}
                {product.tag && (
                  <span
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[#1E60F2]
          text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                  >
                    {product.tag}
                  </span>
                )}

                {/* Wishlist */}
                <button
                  className="absolute top-5 right-5 p-2 bg-white/90 rounded-full
        text-slate-400 hover:text-red-500 transition"
                >
                  <Heart size={18} />
                </button>

                {/* Floating Cart */}
                <button
                  className="absolute bottom-5 right-5 w-12 h-12 bg-[#1E60F2]
        text-white rounded-full flex items-center justify-center
        hover:scale-110 transition"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="mt-5 space-y-2.5 px-1">
                {/* Meta */}
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                  <span className="text-[#1E60F2]">{product.category}</span>
                  <span className="flex items-center gap-1 text-orange-600">
                    <Flame size={12} />
                    {product.noise}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#1E60F2] transition">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm line-through text-slate-400">
                    ₹{product.mrp}
                  </span>
                </div>

                <div className="h-[2px] w-12 bg-[#1E60F2]/40"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-14 text-center md:hidden">
          <button
            className="w-full py-3.5 bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-md active:scale-95 transition-transform"
            onClick={() => {
              window.location.href = '/products';
            }}
          >
            View All Bestsellers
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;
