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
    <section className="py-20 bg-[#F8FAFC] font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-orange-500 font-bold tracking-widest uppercase mb-2 text-xs">
              Customer Favorites
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              Top Selling <span className="text-[#1E60F2]">Crackers</span>
            </h2>
          </div>
          <Link to="/products">
            <button
              className="hidden md:flex items-center gap-2 group px-6 py-2.5 bg-white
          text-slate-900 font-bold border-2 border-slate-200 hover:border-[#1E60F2] hover:text-[#1E60F2]
           transition-all rounded-full cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View All
              <Zap
                size={16}
                className="text-orange-500 group-hover:animate-pulse"
              />
            </button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm bg-white border border-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tag */}
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[#1E60F2] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {product.tag}
                  </span>
                )}

                {/* Wishlist */}
                <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                  <Heart size={15} />
                </button>

                {/* Floating Cart */}
                <button className="absolute bottom-3 right-3 w-9 h-9 bg-[#1E60F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                  <ShoppingCart size={15} />
                </button>
              </div>

              {/* Content */}
              <div className="mt-3 space-y-1.5 px-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-[#1E60F2]">{product.category}</span>
                  <span className="flex items-center gap-0.5 text-orange-500">
                    <Flame size={10} />
                    {product.noise.replace(' Noise', '')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#1E60F2] transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900">
                    ₹{product.price}
                  </span>
                  <span className="text-xs line-through text-slate-400">
                    ₹{product.mrp}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100
                    )}
                    % OFF
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <button className="w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-transform">
              View All Bestsellers
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;
