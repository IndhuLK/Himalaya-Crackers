import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Loader2,
  Leaf,
  X,
  Filter,
  ShoppingCart,
  Flame,
  Heart,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { db } from '../../config/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useCart } from '../../Context/CartContext';

const ProductListing = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* UI STATE */
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  /* FILTER STATE */
  const activeCategory = searchParams.get('category') || 'All';
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [noise, setNoise] = useState('All');
  const [greenOnly, setGreenOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let data = products.filter((p) => {
      const price = Number(p.ourPrice);
      return (
        (activeCategory === 'All' || p.category === activeCategory) &&
        price >= priceRange.min &&
        price <= priceRange.max &&
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (noise === 'All' || p.noiseLevel === noise) &&
        (!greenOnly || p.isGreen)
      );
    });

    if (sortBy === 'low') data.sort((a, b) => a.ourPrice - b.ourPrice);
    if (sortBy === 'high') data.sort((a, b) => b.ourPrice - a.ourPrice);
    if (sortBy === 'popularity')
      data.sort((a, b) => (b.stockQty || 0) - (a.stockQty || 0));

    return data;
  }, [
    products,
    activeCategory,
    priceRange,
    searchTerm,
    noise,
    greenOnly,
    sortBy,
  ]);

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat });
  };

  // ----------------------------------------------------------------------
  // PREMIUM FILTER UI
  // ----------------------------------------------------------------------
  const filterElements = (
    <div className="space-y-7">
      {/* SEARCH */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-4 h-4 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" />
        </div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search magical sparks..."
          className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-400 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition-all shadow-sm focus:shadow-emerald-100/50 focus:ring-2 focus:ring-emerald-50"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-800 tracking-[0.2em] uppercase mb-3">
          <Filter size={13} className="text-emerald-500" />
          Collection
        </h4>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 translate-x-0.5'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{cat}</span>
              {activeCategory === cat && (
                <ChevronRight size={14} className="text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* PRICE BUCKETS */}
      <div>
        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-800 tracking-[0.2em] uppercase mb-3">
          <Sparkles size={13} className="text-emerald-500" />
          Price Range
        </h4>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'All Fireworks', min: 0, max: 200000 },
            { label: 'Under ₹500', min: 0, max: 500 },
            { label: '₹500 - ₹1,000', min: 500, max: 1000 },
            { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
            { label: 'Above ₹5,000', min: 5000, max: 200000 },
          ].map((range) => {
            const isActive =
              priceRange.min === range.min && priceRange.max === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  setPriceRange({ min: range.min, max: range.max })
                }
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{range.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* NOISE LEVEL */}
      <div>
        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-800 tracking-[0.2em] uppercase mb-3">
          <Flame size={13} className="text-orange-500" />
          Intensity
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {['All', 'Low Noise', 'Medium Noise', 'High Noise'].map((level) => (
            <button
              key={level}
              onClick={() => setNoise(level)}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                noise === level
                  ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {level === 'All' ? 'Any' : level.replace(' Noise', '')}
            </button>
          ))}
        </div>
      </div>

      {/* GREEN TOGGLE */}
      <label className="relative flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer group hover:border-emerald-300 hover:bg-emerald-50/30 transition-all overflow-hidden">
        {greenOnly && (
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
        )}
        <div className="flex items-center gap-3 relative z-10">
          <div
            className={`p-2 rounded-full transition-colors ${greenOnly ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}
          >
            <Leaf size={16} />
          </div>
          <div>
            <span
              className={`block text-sm font-bold tracking-wide transition-colors ${greenOnly ? 'text-emerald-700' : 'text-slate-700'}`}
            >
              Eco-Friendly
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Green Crackers Only
            </span>
          </div>
        </div>

        {/* iOS style toggle */}
        <div
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 z-10 ${greenOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}
        >
          <div
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${greenOnly ? 'translate-x-5' : 'translate-x-0'}`}
          ></div>
        </div>

        <input
          type="checkbox"
          checked={greenOnly}
          onChange={() => setGreenOnly(!greenOnly)}
          className="hidden"
        />
      </label>
    </div>
  );

  // ----------------------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 font-bold text-slate-400 tracking-[0.2em] uppercase text-xs flex items-center gap-2">
          <Sparkles size={14} className="animate-pulse text-emerald-400" />
          Preparing Collection
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-16 text-slate-900">
      {/* --- HERO BANNER --- */}
      <div className="relative overflow-hidden bg-slate-900 pt-14 pb-18 px-6">
        {/* Abstract Glows */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-[11px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Premium Selection
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 capitalize leading-tight">
            {activeCategory === 'All'
              ? 'Explore Our Fireworks'
              : `${activeCategory} Collection`}
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
            Light up the sky with our hand-picked, high-quality fireworks.
            Factory fresh and ready to dazzle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* --- DESKTOP FILTER --- */}
            <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl shadow-slate-200/50 sticky top-24">
              {filterElements}
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1">
            {/* TOOLBAR */}
            <div className="bg-white/80 backdrop-blur-xl p-3 md:px-6 md:py-3.5 rounded-xl border border-white shadow-lg shadow-slate-200/40 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors"
                >
                  <Filter size={16} /> Filters
                </button>
                <div className="text-sm font-semibold text-slate-500 tracking-wide bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <span className="text-slate-900 font-bold">
                    {filteredProducts.length}
                  </span>{' '}
                  Products Found
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sort:
                </span>
                <select
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer border-none"
                  value={sortBy}
                >
                  <option value="popularity">Top Selling</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((p) => {
                  const isAvailable = Number(p.stockQty) > 0 && !p.isOutOfStock;
                  const isHovered = hoveredProduct === p.id;

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                      onMouseEnter={() => setHoveredProduct(p.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* IMAGE CONTAINER */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50 p-3 flex flex-col">
                        {/* TOP BADGES */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
                          <div className="flex flex-col gap-1.5">
                            {p.isBestSeller && (
                              <div className="bg-linear-to-r from-orange-500 to-rose-500 text-white px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md shadow-orange-500/30">
                                Best Seller
                              </div>
                            )}
                            {p.isGreen && (
                              <div className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30">
                                <Leaf size={10} />
                              </div>
                            )}
                          </div>
                          <button className="pointer-events-auto w-7 h-7 bg-white/80 backdrop-blur flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-white hover:scale-110 shadow-sm transition-all">
                            <Heart size={13} />
                          </button>
                        </div>

                        <Link
                          to={`/product/${p.id}`}
                          onClick={() => window.scrollTo(0, 0)}
                          className="block w-full h-full relative z-0 mt-2"
                        >
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-full h-full object-contain mix-blend-multiply transform transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {/* OUT OF STOCK OVERLAY */}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                            <span className="bg-slate-900 text-white text-xs font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl">
                              Sold Out
                            </span>
                          </div>
                        )}

                        {/* HOVER ADD TO CART (GLASSMORPHISM) */}
                        {isAvailable && (
                          <div
                            className={`absolute bottom-3 left-3 right-3 z-20 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(p);
                              }}
                              className="w-full bg-slate-900/95 backdrop-blur-md text-white py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-500 transition-colors flex justify-center items-center gap-1.5 shadow-xl shadow-slate-900/40"
                            >
                              <ShoppingCart size={13} /> Quick Add
                            </button>
                          </div>
                        )}
                      </div>

                      {/* DETAILS CONTAINER */}
                      <div className="flex flex-col flex-1 p-3 md:p-4 relative bg-white z-30">
                        <div className="flex justify-between items-start mb-1.5 gap-1.5">
                          <Link
                            to={`/product/${p.id}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className="text-slate-900 font-bold text-sm leading-snug hover:text-emerald-600 transition-colors line-clamp-2"
                          >
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-md shrink-0 border border-slate-100">
                            <Flame
                              size={10}
                              className={
                                p.noiseLevel?.includes('High')
                                  ? 'text-rose-500'
                                  : 'text-orange-400'
                              }
                            />
                            <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase">
                              {p.noiseLevel === 'Low Noise'
                                ? 'Low'
                                : p.noiseLevel === 'High Noise'
                                  ? 'High'
                                  : 'Med'}
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                          {p.category}
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-2.5 border-t border-slate-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 line-through mb-0.5">
                              ₹{p.mrpPrice}
                            </span>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-sm font-black text-emerald-600">
                                ₹
                              </span>
                              <span className="text-lg font-black text-slate-900 tracking-tighter">
                                {p.ourPrice}
                              </span>
                            </div>
                          </div>

                          {/* Mobile Add button (visible on smaller screens or when not hovering on desktop) */}
                          <button
                            disabled={!isAvailable}
                            onClick={() => addToCart(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all lg:hidden ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-slate-200/40 p-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-sm">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  No Fireworks Found
                </h3>
                <p className="text-slate-500 font-medium max-w-md">
                  We couldn't find any products matching your current filters.
                  Try adjusting your search or category, or browse our entire
                  collection!
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearchParams({ category: 'All' });
                    setPriceRange({ min: 0, max: 100000 });
                    setNoise('All');
                    setGreenOnly(false);
                  }}
                  className="mt-8 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- MOBILE DRAWER FILTERS --- */}
      {showFilters && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col rounded-l-3xl">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-900 tracking-wider">
                REFINE SEARCH
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 shadow-sm transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {filterElements}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-10">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold tracking-[0.2em] uppercase hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex justify-center items-center gap-2"
              >
                View Result{' '}
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                  {filteredProducts.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
